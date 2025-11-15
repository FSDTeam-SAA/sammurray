import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../../config';
import { IUser } from './user.interface';
import { userRole } from './user.constant';

const userSchema = new mongoose.Schema<IUser & Document>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: [userRole.TENANT, userRole.SUPPLIER, userRole.ADMIN],
      default: userRole.TENANT,
    },
    profileImage: { type: String },
    agencyName: { type: String },
    location: { type: String },
    phone: { type: String },
    licenseImage: { type: String },
    logoImage: { type: String },
    bio: { type: String },
    otp: { type: String },
    otpExpiry: { type: Date },
    verified: { type: Boolean, default: false },
    stripeAccountId: { type: String },
    isSubscription: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const saltRounds = Number(config.bcryptSaltRounds);
  if (Number.isNaN(saltRounds) || saltRounds < 1) {
    return next(new Error('Invalid bcryptSaltRounds in config'));
  }

  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

const User = mongoose.model<IUser & Document>('User', userSchema);
export default User;
