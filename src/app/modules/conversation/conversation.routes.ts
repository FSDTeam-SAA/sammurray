import express from 'express';
import { conversationController } from './conversation.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';

const router = express.Router();

// Create conversation between logged-in user and receiver
router.post(
  '/',
  auth(userRole.SUPPLIER, userRole.TENANT),
  conversationController.createConversation
);

// Get all conversations of logged-in user
router.get(
  '/',
  auth(userRole.SUPPLIER, userRole.TENANT),
  conversationController.getAllConversations
);

// Get single conversation by ID
router.get(
  '/:id',
  auth(userRole.SUPPLIER, userRole.TENANT),
  conversationController.getConversationById
);

// Delete a conversation
router.delete(
  '/:id',
  auth(userRole.SUPPLIER, userRole.TENANT),
  conversationController.deleteConversation
);

export const conversationRoutes = router;