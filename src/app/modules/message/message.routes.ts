import express from 'express';
import { messageController } from './message.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { fileUploader } from '../../helper/fileUploder';

const router = express.Router();

// Create/send a message
router.post(
  '/',
  auth(userRole.SUPPLIER, userRole.TENANT),
  fileUploader.upload.single('file'),
  messageController.createMessage
);

// Get all messages in a conversation (with pagination)
router.get(
  '/:conversationId',
  auth(userRole.SUPPLIER, userRole.TENANT),
  messageController.getMessages
);

// Mark messages as read
router.patch(
  '/mark-read',
  auth(userRole.SUPPLIER, userRole.TENANT),
  messageController.markMessagesAsRead
);

// Update a message
router.put(
  '/:id',
  auth(userRole.SUPPLIER, userRole.TENANT),
  messageController.updateMessage
);

// Delete a message
router.delete(
  '/:id',
  auth(userRole.SUPPLIER, userRole.TENANT),
  messageController.deleteMessage
);

export const messageRoutes = router;