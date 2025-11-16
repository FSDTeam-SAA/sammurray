import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { conversationService } from './conversation.service';

const createConversation = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { receiverId } = req.body;

  if (!receiverId) {
    return res.status(400).json({
      success: false,
      message: 'Receiver ID is required',
    });
  }

  const result = await conversationService.createConversation(
    userId,
    receiverId,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Conversation created successfully',
    data: result,
  });
});

const getAllConversations = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await conversationService.getAllConversations(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Conversations retrieved successfully',
    data: result,
  });
});

const getConversationById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const conversationId = req.params.id!;

  const result = await conversationService.getConversationById(
    userId,
    conversationId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Conversation retrieved successfully',
    data: result,
  });
});

const deleteConversation = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const conversationId = req.params.id!;

  const result = await conversationService.deleteConversation(
    userId,
    conversationId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});

export const conversationController = {
  createConversation,
  getAllConversations,
  getConversationById,
  deleteConversation,
};
