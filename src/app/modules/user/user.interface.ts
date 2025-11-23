import { Types } from 'mongoose';
import { userRole } from './user.constant';

export interface IUser {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  role: (typeof userRole)[keyof typeof userRole];
  profileImage?: string;
  agencyName?: string;
  location?: string;
  phone?: string;
  licenseImage?: string;
  logoImage?: string;
  bio?: string;
  otp?: string;
  otpExpiry?: Date;
  verified?: boolean;
  stripeAccountId?: string;
  isSubscription?: boolean;
  subscriptionExpiry?: Date | null;
  license?: string;
  agencyLogo?: string;
  website?: string;
  agentApproved?: boolean;
}
