import { fileUploader } from '../../helper/fileUploder';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { messageService } from './message.service';

const createMessage = catchAsync(async (req, res) => {
  const userId = req.user.id;

  let fileUrl: string | undefined;
  if (req.file) {
    const uploaded = await fileUploader.uploadToCloudinary(req.file);
    fileUrl = uploaded.secure_url;
  }

  const result = await messageService.createMessage(userId, {
    ...req.body,
    file: fileUrl,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

const getMessages = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const conversationId = req.params.conversationId!;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;

  const result = await messageService.getMessagesByConversation(
    userId,
    conversationId,
    page,
    limit
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Messages retrieved successfully',
    data: result.messages,
    meta: result.pagination,
  });
});

const updateMessage = catchAsync(async (req, res) => {
  const id = req.params.id!;
  const userId = req.user.id;

  const result = await messageService.updateMessage(userId, id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message updated successfully',
    data: result,
  });
});

const deleteMessage = catchAsync(async (req, res) => {
  const id = req.params.id!;
  const userId = req.user.id;
  
  const result = await messageService.deleteMessage(userId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});

const markMessagesAsRead = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { conversationId } = req.body;

  const result = await messageService.markAsRead(userId, conversationId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: { modifiedCount: result.modifiedCount },
  });
});

export const messageController = {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  markMessagesAsRead,
};