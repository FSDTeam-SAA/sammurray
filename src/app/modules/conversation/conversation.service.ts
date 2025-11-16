import AppError from '../../error/appError';
import Conversation from './conversation.model';
import Message from '../message/message.model';

const createConversation = async (userId: string, receiverId: string) => {
  if (userId === receiverId) {
    throw new AppError(400, "You can't create a conversation with yourself");
  }
  const existing = await Conversation.findOne({
    members: { $all: [userId, receiverId] },
  }).populate('members', 'fullName email profileImage role');

  if (existing) {
    return existing;
  }

  // Create new conversation
  const conversation = await Conversation.create({
    members: [userId, receiverId],
  });

  // Populate members before returning
  await conversation.populate('members', 'fullName email profileImage role');

  return conversation;
};

const getAllConversations = async (userId: string) => {
  const conversations = await Conversation.find({
    members: { $in: [userId] },
  })
    .populate('members', 'fullName email profileImage role')
    .sort({ updatedAt: -1 });

  // Get last message for each conversation
  const conversationsWithLastMsg = await Promise.all(
    conversations.map(async (conv) => {
      const lastMessage = await Message.findOne({
        conversationId: conv._id,
      })
        .sort({ createdAt: -1 })
        .populate('senderId', 'fullName profileImage')
        .limit(1);

      // Get unread message count
      const unreadCount = await Message.countDocuments({
        conversationId: conv._id,
        receiverId: userId,
        isRead: false,
      });

      return {
        ...conv.toJSON(),
        lastMessage,
        unreadCount,
      };
    })
  );

  return conversationsWithLastMsg;
};

const getConversationById = async (userId: string, conversationId: string) => {
  const conversation = await Conversation.findById(conversationId).populate(
    'members',
    'fullName email profileImage role'
  );

  if (!conversation) {
    throw new AppError(404, 'Conversation not found');
  }

  // Verify user is part of this conversation
  const isMember = conversation.members.some(
    (member: any) => member._id.toString() === userId
  );

  if (!isMember) {
    throw new AppError(403, 'You are not a member of this conversation');
  }

  return conversation;
};

const deleteConversation = async (userId: string, conversationId: string) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new AppError(404, 'Conversation not found');
  }

  // Verify user is part of this conversation
  const isMember = conversation.members.some(
    (member: any) => member.toString() === userId
  );

  if (!isMember) {
    throw new AppError(403, 'You are not a member of this conversation');
  }

  // Delete all messages in this conversation
  await Message.deleteMany({ conversationId });

  // Delete the conversation
  await Conversation.findByIdAndDelete(conversationId);

  return { message: 'Conversation deleted successfully' };
};

export const conversationService = {
  createConversation,
  getAllConversations,
  getConversationById,
  deleteConversation,
};