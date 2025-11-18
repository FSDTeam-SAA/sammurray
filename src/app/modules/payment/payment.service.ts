import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import Payment from './payment.model';

const getAllPayment = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const searchableFields = ['status'];

  if (searchTerm) {
    andCondition.push({
      $or: searchableFields.map((field) => ({
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

  const result = await Payment.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('user', 'fullName email profileImage');
  if (!result) {
    throw new AppError(404, 'payment not found');
  }
  const total = await Payment.countDocuments(whereCondition);
  return {
    data: result,
    meta: { total, page, limit },
  };
};

export const paymentService = {
  getAllPayment,
};
