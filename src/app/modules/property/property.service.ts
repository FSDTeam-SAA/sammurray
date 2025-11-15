import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import User from '../user/user.model';
import { IProperty } from './property.interface';
import Property from './property.model';

const createProperty = async (
  userId: string,
  payload: IProperty,
  file?: Express.Multer.File,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  if (file) {
    const propertyImage = await fileUploader.uploadToCloudinary(file);
    payload.thumble = propertyImage.secure_url;
  }

  const property = await Property.create({ ...payload, user: user._id });
  if (!property) {
    throw new AppError(400, 'Property not created');
  }
  return property;
};

export const propertyService = {
  createProperty,
};
