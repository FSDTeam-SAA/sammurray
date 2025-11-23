import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import User from '../user/user.model';
import { IHireAgent } from './hireAgent.interface';
import HireAgent from './hireAgent.model';

const createHireAgent = async (userId: string, payload: IHireAgent) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  if (user.role !== 'SUPPLIER')
    throw new AppError(400, 'You are not a supplier');

  const result = await HireAgent.create({ ...payload, supplierId: user._id });
  return result;
};

const getAllHirAgent = async (
  userId: string,
  params: any,
  options: IOption,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  if (user.role !== 'SUPPLIER')
    throw new AppError(400, 'You are not a supplier');

  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = ['agentId.fullName', 'supplierId.email'];

  andCondition.push({ supplierId: user._id });

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

  const result = await HireAgent.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('supplierId')
    .populate('agentId');

  if (!result) {
    throw new AppError(404, 'Hire agents not found');
  }

  const total = await HireAgent.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getHireAgentById = async (id: string) => {
  const result = await HireAgent.findById(id)
    .populate('supplierId')
    .populate('agentId');
  return result;
};

const updateHireAgentById = async (id: string, payload: IHireAgent) => {
  const result = await HireAgent.findByIdAndUpdate(id, payload, { new: true })
    .populate('supplierId')
    .populate('agentId');
  return result;
};

const deleteHireAgentById = async (id: string) => {
  const result = await HireAgent.findByIdAndDelete(id);
  return result;
};

export const hireAgentService = {
  createHireAgent,
  getAllHirAgent,
  getHireAgentById,
  updateHireAgentById,
  deleteHireAgentById,
};
