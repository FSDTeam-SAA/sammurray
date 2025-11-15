import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { propertyController } from './property.controller';
import { fileUploader } from '../../helper/fileUploder';
const router = express.Router();

router.post(
  '/',
  auth(userRole.ADMIN, userRole.SUPPLIER),
  fileUploader.upload.single('thumble'),
  propertyController.createProperty,
);

export const propertyRouter = router;
