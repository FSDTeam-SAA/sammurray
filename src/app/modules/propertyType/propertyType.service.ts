import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import User from '../user/user.model';
import { IPropertyType } from './propertyType.interface';
import PropertyType from './propertyType.model';

const createPropertyType = async (payload: IPropertyType, userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  const result = await PropertyType.create({ ...payload, createBy: user._id });
  if (!result) throw new AppError(400, 'Internal server error');
  return result;
};

const getAllPropertyType = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = ['name'];

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

  const result = await PropertyType.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  const total = await PropertyType.countDocuments(whereCondition);

  return {
    data: result,
    meta: { total, page, limit },
  };
};

const getSinglePropertyType = async (id: string) => {
  const result = await PropertyType.findById(id);
  if (!result) throw new AppError(404, 'PropertyType not found');
  return result;
};

const updatePropertyType = async (
  id: string,
  payload: Partial<IPropertyType>,
) => {
  const result = await PropertyType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) throw new AppError(404, 'PropertyType not found');
  return result;
};

const deletePropertyType = async (id: string) => {
  const result = await PropertyType.findByIdAndDelete(id);
  if (!result) throw new AppError(404, 'PropertyType not found');
  return result;
};

export const propertyTypeService = {
  createPropertyType,
  getAllPropertyType,
  getSinglePropertyType,
  updatePropertyType,
  deletePropertyType,
};
