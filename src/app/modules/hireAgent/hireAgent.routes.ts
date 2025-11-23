import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { hireAgentController } from './hireAgent.controller';
const router = express.Router();

router.post('/', auth(userRole.SUPPLIER), hireAgentController.createHireAgent);
router.get('/', auth(userRole.SUPPLIER), hireAgentController.getAllHireAgent);
router.get(
  '/:id',
  auth(userRole.SUPPLIER),
  hireAgentController.getSingleHireAgent,
);
router.put(
  '/:id',
  auth(userRole.SUPPLIER),
  hireAgentController.updateHireAgent,
);
router.delete(
  '/:id',
  auth(userRole.SUPPLIER),
  hireAgentController.deleteHireAgent,
);

export const hireAgentRoutes = router;
