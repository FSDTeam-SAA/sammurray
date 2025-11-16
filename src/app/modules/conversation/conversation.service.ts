import AppError from '../../error/appError';
import Conversation from './conversation.model';

const createConversation = async (userId: string, receiverId: string) => {
  if (userId === receiverId)
    throw new AppError(400, "You can't create a conversation with yourself");

  const existing = await Conversation.findOne({
    members: { $all: [userId, receiverId] },
  });

  if (existing) return existing;

  const conversation = await Conversation.create({
    members: [userId, receiverId],
  });
  return conversation;
};

const getAllConversations = async (userId: string) => {
  const conversation = await Conversation.find({
    members: { $in: [userId] },
  }).populate('members', 'fullName email profileImage role');
  return conversation;
};

const getConversationById = async (conversationId: string) => {
  const conversation = await Conversation.findById(conversationId);
  if(!conversation) throw new AppError(404, "Conversation not found")
  return conversation;
};

export const conversationService = {
  createConversation,
  getAllConversations,
  getConversationById
};