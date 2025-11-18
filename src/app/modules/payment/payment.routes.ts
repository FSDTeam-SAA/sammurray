import express from 'express';
import { paymentController } from './payment.conroller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
const router = express.Router();

router.get('/', auth(userRole.ADMIN), paymentController.getAllPayment);

export const paymentRouter = router;
