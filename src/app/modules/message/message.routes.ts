import express from 'express';
import { messageController } from './message.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { fileUploader } from '../../helper/fileUploder';

const router = express.Router();

router.post(
  '/',
  auth(userRole.SUPPLIER, userRole.TENANT),
  fileUploader.upload.single('file'),
  messageController.createMessage,
);

router.get(
  '/:conversationId',
  auth(userRole.SUPPLIER, userRole.TENANT),
  messageController.getMessages,
);

router.put(
  '/:id',
  auth(userRole.SUPPLIER, userRole.TENANT),
  messageController.updateMessage,
);

router.delete(
  '/:id',
  auth(userRole.SUPPLIER, userRole.TENANT),
  messageController.deleteMessage,
);

export const messageRoutes = router;