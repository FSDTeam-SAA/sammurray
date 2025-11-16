import mongoose from 'mongoose';
import { IBooking } from './booking.interface';

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;
