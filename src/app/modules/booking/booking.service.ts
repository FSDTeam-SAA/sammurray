import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import Property from '../property/property.model';
import User from '../user/user.model';
import { IBooking } from './booking.interface';
import Booking from './booking.model';

const createBooking = async (userId: string, payload: IBooking) => {
  console.log(userId, payload);
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const properity = await Property.findById(payload.propertyId);
  if (!properity) {
    throw new AppError(404, 'Property not found');
  }

  if (!user.isSubscription) {
    throw new AppError(400, 'You are not Subscription');
  }

  if (user.subscriptionExpiry && user.subscriptionExpiry < new Date()) {
    throw new AppError(400, 'Your Subscription is expired');
  }

  if (user._id!.toString() === properity.user.toString()) {
    throw new AppError(400, 'You can not book your own property');
  }
  const booking = await Booking.create({ ...payload, userId: user._id });
  if (!booking) {
    throw new AppError(400, 'Booking not created');
  }
  properity?.bookingUser?.push(booking._id);
  await properity.save();

  return booking;
};

const getAllBooking = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = ['fullName', 'email', 'phone'];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Booking.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('propertyId')
    .populate('userId');

  const total = await Booking.countDocuments(whereCondition);

  return {
    data: result,
    meta: { total, page, limit },
  };
};

const getMyAllBooking = async (
  userId: string,
  params: any,
  options: IOption,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = ['fullName', 'email', 'phone'];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Booking.find({ ...whereCondition, userId: user._id })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('propertyId')
    .populate('userId');

  const total = await Booking.countDocuments({
    ...whereCondition,
    userId: user._id,
  });

  return {
    data: result,
    meta: { total, page, limit },
  };
};

const getBookingById = async (id: string) => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  return booking;
};

const updateBooking = async (id: string, payload: IBooking) => {
  const booking = await Booking.findByIdAndUpdate(id, payload, { new: true });
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  return booking;
};

const updateMyBooking = async (
  userId: string,
  id: string,
  payload: IBooking,
) => {
  const booking = await Booking.findOneAndUpdate({ _id: id, userId }, payload, {
    new: true,
  });
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  return booking;
};

const deleteBooking = async (id: string) => {
  const booking = await Booking.findByIdAndDelete(id);
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  return booking;
};

const deleteMyBooking = async (userId: string, id: string) => {
  const booking = await Booking.findOneAndDelete({ _id: id, userId });
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  return booking;
};

export const bookingService = {
  createBooking,
  getAllBooking,
  getMyAllBooking,
  getBookingById,
  updateBooking,
  updateMyBooking,
  deleteBooking,
  deleteMyBooking,
};
