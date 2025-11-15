import express from 'express';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { fileUploader } from '../../helper/fileUploder';

const router = express.Router();

router.post(
  '/register',
  fileUploader.upload.fields([
    { name: 'licenseImage', maxCount: 1 },
    { name: 'logoImage', maxCount: 1 },
  ]),
  authController.registerUser,
);
router.post('/login', authController.loginUser);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authController.logoutUser);
router.post(
  '/change-password',
  auth(userRole.ADMIN, userRole.TENANT, userRole.SUPPLIER),
  authController.changePassword,
);

export const authRoutes = router;
