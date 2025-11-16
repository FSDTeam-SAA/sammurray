import { Types } from 'mongoose';

export interface IBooking {
  propertyId: Types.ObjectId;
  userId: Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
}
