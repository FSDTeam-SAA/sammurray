import express from 'express';
import { messageController } from './message.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { fileUploader } from '../../helper/fileUploder';

const router = express.Router();

router.post(
  '/',
  auth(userRole.TENANT, userRole.SUPPLIER),
  fileUploader.upload.single('file'),
  messageController.createMessage,
);

router.get(
  '/:conversationId',
  auth(userRole.TENANT, userRole.SUPPLIER),
  messageController.getMessages,
);

router.put(
  '/:id',
  auth(userRole.TENANT, userRole.SUPPLIER),
  messageController.updateMessage,
);

router.delete(
  '/:id',
  auth(userRole.TENANT, userRole.SUPPLIER),
  messageController.deleteMessage,
);

export const messageRoutes = router;