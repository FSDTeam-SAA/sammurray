import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { fileUploader } from '../../helper/fileUploder';
import optionalAuth from '../../middlewares/optionalAuth';
import { listingController } from './listing.controller';
const router = express.Router();

// create property
router.post(
  '/',
  auth(userRole.ADMIN, userRole.TENANT),
  fileUploader.upload.single('thumble'),
  listingController.createListting,
);

// admin access
router.get(
  '/admin',
  auth(userRole.ADMIN),
  listingController.getAdminAllListtings,
);
router.put(
  '/admin/:id',
  auth(userRole.ADMIN),
  fileUploader.upload.single('thumble'),
  listingController.updateListting,
);
router.delete(
  '/admin/:id',
  auth(userRole.ADMIN),
  listingController.deleteListting,
);

// won property
router.get(
  '/my',
  auth(userRole.TENANT, userRole.ADMIN),
  listingController.getMyAllListtings,
);
router.put(
  '/my/:id',
  auth(userRole.TENANT, userRole.ADMIN),
  fileUploader.upload.single('thumble'),
  listingController.updateMyListting,
);
router.delete(
  '/my/:id',
  auth(userRole.TENANT, userRole.ADMIN),
  listingController.deleteMyListing,
);

// single property
router.get(
  '/my/:id',
  auth(userRole.ADMIN, userRole.TENANT),
  listingController.getAdminWonSingleListting,
);

// all user access
router.get('/', optionalAuth, listingController.getAllListtings);
router.get('/:id', optionalAuth, listingController.getSingleListting);

export const listingRouter = router;
