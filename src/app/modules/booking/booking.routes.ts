import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { bookingController } from './booking.controller';
const router = express.Router();

router.post('/', auth(userRole.TENANT), bookingController.createBooking);
router.get('/', auth(userRole.ADMIN), bookingController.getAllBooking);

// my
router.get(
  '/my-bookings',
  auth(userRole.TENANT),
  bookingController.getMyAllBooking,
);

// admin
router.put('/admin/:id', auth(userRole.ADMIN), bookingController.updateBooking);
router.delete(
  '/admin/:id',
  auth(userRole.ADMIN),
  bookingController.deleteBooking,
);

// admin my
router.get(
  '/:id',
  auth(userRole.TENANT, userRole.ADMIN),
  bookingController.getBookingById,
);

// my
router.put('/:id', auth(userRole.TENANT), bookingController.updateMyBooking);

router.delete('/:id', auth(userRole.TENANT), bookingController.deleteMyBooking);

export const bookingRouter = router;
