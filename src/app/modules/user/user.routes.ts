import express from 'express';
import { userController } from './user.controller';
import validationRequest from '../../middlewares/validationRequest';
import { userValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { fileUploader } from '../../helper/fileUploder';
import { userRole } from './user.constant';

const router = express.Router();

router.post(
  '/create-user',
  validationRequest(userValidation.create),
  userController.createUser,
);

router.get(
  '/profile',
  auth(userRole.ADMIN, userRole.TENANT, userRole.SUPPLIER),
  userController.profile,
);
router.put(
  '/profile',
  auth(userRole.ADMIN, userRole.TENANT, userRole.SUPPLIER),
  fileUploader.upload.single('profileImage'),
  userController.updateUserById,
);

router.get('/all-user', auth(userRole.ADMIN), userController.getAllUser);
router.get('/:id', auth(userRole.ADMIN), userController.getUserById);

router.delete('/:id', auth(userRole.ADMIN), userController.deleteUserById);

export const userRoutes = router;
