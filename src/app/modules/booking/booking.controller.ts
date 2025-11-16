import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { bookingService } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await bookingService.createBooking(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getAllBooking = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['searchTerm', 'fullName', 'email', 'phone']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await bookingService.getAllBooking(filter, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bookings retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getMyAllBooking = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const filter = pick(req.query, ['searchTerm', 'fullName', 'email', 'phone']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await bookingService.getMyAllBooking(userId, filter, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bookings retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getBookingById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await bookingService.getBookingById(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking retrieved successfully',
    data: result,
  });
});
const updateBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await bookingService.updateBooking(id!, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking updated successfully',
    data: result,
  });
});
const updateMyBooking = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await bookingService.updateMyBooking(userId, id!, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking updated successfully',
    data: result,
  });
});
const deleteBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await bookingService.deleteBooking(id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking deleted successfully',
    data: result,
  });
});
const deleteMyBooking = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await bookingService.deleteMyBooking(userId, id!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking deleted successfully',
    data: result,
  });
});
export const bookingController = {
  createBooking,
  getAllBooking,
  getMyAllBooking,
  getBookingById,
  updateBooking,
  updateMyBooking,
  deleteBooking,
  deleteMyBooking,
};
