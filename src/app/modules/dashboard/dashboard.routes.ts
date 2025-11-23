import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { dashboardController } from './dashboard.conroller';
const router = express.Router();

router.get('/', auth(userRole.ADMIN), dashboardController.dashboardOverView);
router.get(
  '/monthly-earnings',
  auth(userRole.ADMIN),
  dashboardController.getMonthlyEarnings,
);

export const dashboardRouter = router;
