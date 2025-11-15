import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { propertyTypeController } from './propertyType.controller';
const router = express.Router();

router.post(
  '/',
  auth(userRole.ADMIN),
  propertyTypeController.createPropertyType,
);

router.get('/', propertyTypeController.getAllPropertyType);
router.get('/:id', propertyTypeController.getSinglePropertyType);
router.put(
  '/:id',
  auth(userRole.ADMIN),
  propertyTypeController.updatePropertyType,
);

router.delete(
  '/:id',
  auth(userRole.ADMIN),
  propertyTypeController.deletePropertyType,
);


export const propertyTypeRouter = router;
