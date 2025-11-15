import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { subscriptionController } from './subscription.controller';
const router = express.Router();

router.post(
  '/pay-subscription/:id',
  auth(userRole.TENANT, userRole.SUPPLIER),
  subscriptionController.paySubscription,
);

router.post(
  '/',
  auth(userRole.ADMIN),
  subscriptionController.createSubscription,
);

router.get('/', subscriptionController.getAllSubscription);
router.get('/:id', subscriptionController.singleSubscription);
router.put(
  '/:id',
  auth(userRole.ADMIN),
  subscriptionController.updateSubscription,
);
router.delete(
  '/:id',
  auth(userRole.ADMIN),
  subscriptionController.deleteSubscription,
);

export const subscriptionRouter = router;
