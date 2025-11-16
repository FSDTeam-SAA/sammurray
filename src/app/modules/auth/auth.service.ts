/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../error/appError';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import { jwtHelpers } from '../../helper/jwtHelpers';
import sendMailer from '../../helper/sendMailer';
import bcrypt from 'bcryptjs';
import createOtpTemplate from '../../utils/createOtpTemplate';
import { userRole } from '../user/user.constant';
import { fileUploader } from '../../helper/fileUploder';

const registerUser = async (
  payload: Partial<IUser>,
  files?: Express.Multer.File[],
) => {
  const exist = await User.findOne({ email: payload.email });
  if (exist) throw new AppError(400, 'User already exists');

  const idx = Math.floor(Math.random() * 100);
  payload.profileImage = `https://avatar.iran.liara.run/public/${idx}.png`;

  if (payload.role === userRole.SUPPLIER) {
    if (
      !payload.agencyName ||
      !payload.location ||
      !payload.phone ||
      !payload.bio
    ) {
      throw new AppError(
        400,
        'Agency name, location, phone and bio are required for supplier registration',
      );
    }

    if (!files || files.length < 2) {
      throw new AppError(
        400,
        'Supplier must upload licenseImage and logoImage',
      );
    }

    const uploadedFiles = await Promise.all(
      files.map((f) => fileUploader.uploadToCloudinary(f)),
    );

    if (!uploadedFiles[0]?.secure_url || !uploadedFiles[1]?.secure_url) {
      throw new AppError(400, 'File upload failed');
    }

    payload.licenseImage = uploadedFiles[0].secure_url;
    payload.logoImage = uploadedFiles[1].secure_url;
  }

  const user = await User.create(payload);
  return user;
};

const loginUser = async (payload: Partial<IUser>) => {
  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user) throw new AppError(401, 'User not found');
  if (!payload.password) throw new AppError(400, 'Password is required');

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isPasswordMatched) throw new AppError(401, 'Password not matched');

  const accessToken = jwtHelpers.genaretToken(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      isSubscription: user.isSubscription,
      subscriptionExpiry: user.subscriptionExpiry,
    },
    config.jwt.accessTokenSecret as Secret,
    config.jwt.accessTokenExpires,
  );

  const refreshToken = jwtHelpers.genaretToken(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      isSubscription: user.isSubscription,
      subscriptionExpiry: user.subscriptionExpiry,
    },
    config.jwt.refreshTokenSecret as Secret,
    config.jwt.refreshTokenExpires,
  );

  const { password, ...userWithoutPassword } = user.toObject();
  return { accessToken, refreshToken, user: userWithoutPassword };
};

const refreshToken = async (token: string) => {
  const varifiedToken = jwtHelpers.verifyToken(
    token,
    config.jwt.refreshTokenSecret as Secret,
  ) as JwtPayload;

  const user = await User.findById(varifiedToken.id);
  if (!user) throw new AppError(401, 'User not found');

  const accessToken = jwtHelpers.genaretToken(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      isSubscription: user.isSubscription,
      subscriptionExpiry: user.subscriptionExpiry,
    },
    config.jwt.accessTokenSecret as Secret,
    config.jwt.accessTokenExpires,
  );

  const { password, ...userWithoutPassword } = user.toObject();
  return { accessToken, user: userWithoutPassword };
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(401, 'User not found');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 20 * 60 * 1000); // 20 mins
  await user.save();

  await sendMailer(
    user.email,
    user.fullName,
    createOtpTemplate(otp, user.email, 'Your Company'),
  );

  return { message: 'OTP sent to your email' };
};

const verifyEmail = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(401, 'User not found');

  if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    throw new AppError(400, 'Invalid or expired OTP');
  }

  user.verified = true;
  (user as any).otp = undefined;
  (user as any).otpExpiry = undefined;
  await user.save();

  return { message: 'Email verified successfully' };
};

const resetPassword = async (email: string, newPassword: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(404, 'User not found');

  user.password = newPassword;
  (user as any).otp = undefined;
  (user as any).otpExpiry = undefined;
  await user.save();

  // Auto-login after reset
  const accessToken = jwtHelpers.genaretToken(
    { id: user._id,
      role: user.role,
      email: user.email,
      isSubscription: user.isSubscription,
      subscriptionExpiry: user.subscriptionExpiry,},
    config.jwt.accessTokenSecret as Secret,
    config.jwt.accessTokenExpires,
  );
  const refreshToken = jwtHelpers.genaretToken(
    { id: user._id,
      role: user.role,
      email: user.email,
      isSubscription: user.isSubscription,
      subscriptionExpiry: user.subscriptionExpiry,},
    config.jwt.refreshTokenSecret as Secret,
    config.jwt.refreshTokenExpires,
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError(404, 'User not found');
  const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordMatched) throw new AppError(400, 'Password not matched');

  user.password = newPassword;
  await user.save();

  return { message: 'Password changed successfully' };
};

export const authService = {
  registerUser,
  loginUser,
  refreshToken,
  forgotPassword,
  verifyEmail,
  resetPassword,
  changePassword,
};
