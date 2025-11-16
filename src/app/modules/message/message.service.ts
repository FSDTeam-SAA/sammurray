import Message from './message.model';
import { IMessage } from './message.interface';
import AppError from '../../error/appError';
import Conversation from '../conversation/conversation.model';

// Create message
const createMessage = async (userId: string, payload: Partial<IMessage>) => {
  const { conversationId, receiverId, message, file } = payload;

  // Validate conversation exists
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new AppError(404, 'Conversation not found');
  }

  // Verify sender is part of the conversation
  const isMember = conversation.members.some(
    (member: any) => member.toString() === userId
  );
  if (!isMember) {
    throw new AppError(403, 'You are not a member of this conversation');
  }

  // Verify receiver is part of the conversation
  const isReceiverMember = conversation.members.some(
    (member: any) => member.toString() === receiverId
  );
  if (!isReceiverMember) {
    throw new AppError(403, 'Receiver is not a member of this conversation');
  }

  // Validate at least message or file is provided
  if (!message && !file) {
    throw new AppError(400, 'Message or file is required');
  }

  // Create message
  const newMessage = await Message.create({
    senderId: userId,
    receiverId,
    conversationId,
    message,
    file,
  });

  // Update conversation's updatedAt
  await Conversation.findByIdAndUpdate(conversationId, {
    updatedAt: new Date(),
  });

  // Populate sender and receiver
  const populatedMessage = await Message.findById(newMessage._id)
    .populate('senderId', 'fullName profileImage email')
    .populate('receiverId', 'fullName profileImage email');

  return populatedMessage;
};

// Get all messages by conversation
const getMessagesByConversation = async (
  userId: string,
  conversationId: string,
  page: number = 1,
  limit: number = 50
) => {
  // Verify user is part of the conversation
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new AppError(404, 'Conversation not found');
  }

  const isMember = conversation.members.some(
    (member: any) => member.toString() === userId
  );
  if (!isMember) {
    throw new AppError(403, 'You are not a member of this conversation');
  }

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Get messages with pagination
  const messages = await Message.find({ conversationId })
    .populate('senderId', 'fullName profileImage email')
    .populate('receiverId', 'fullName profileImage email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get total count
  const total = await Message.countDocuments({ conversationId });

  // Mark messages as read for the current user
  await Message.updateMany(
    {
      conversationId,
      receiverId: userId,
      isRead: false,
    },
    { isRead: true }
  );

  return {
    messages: messages.reverse(), // Reverse to show oldest first
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Update message
const updateMessage = async (
  userId: string,
  id: string,
  payload: Partial<IMessage>
) => {
  const message = await Message.findById(id);
  if (!message) {
    throw new AppError(404, 'Message not found');
  }

  if (message.senderId.toString() !== userId) {
    throw new AppError(403, 'You can only edit your own messages');
  }

  // Only allow updating message text, not file
  const updatedMessage = await Message.findByIdAndUpdate(
    id,
    { message: payload.message },
    { new: true }
  )
    .populate('senderId', 'fullName profileImage email')
    .populate('receiverId', 'fullName profileImage email');

  return updatedMessage;
};

// Delete message
const deleteMessage = async (userId: string, id: string) => {
  const message = await Message.findById(id);
  if (!message) {
    throw new AppError(404, 'Message not found');
  }

  if (message.senderId.toString() !== userId) {
    throw new AppError(403, 'You can only delete your own messages');
  }

  await Message.findByIdAndDelete(id);
  return { message: 'Message deleted successfully' };
};

// Mark messages as read
const markAsRead = async (userId: string, conversationId: string) => {
  const result = await Message.updateMany(
    {
      conversationId,
      receiverId: userId,
      isRead: false,
    },
    { isRead: true }
  );

  return {
    modifiedCount: result.modifiedCount,
    message: 'Messages marked as read',
  };
};

export const messageService = {
  createMessage,
  getMessagesByConversation,
  updateMessage,
  deleteMessage,
  markAsRead,
};