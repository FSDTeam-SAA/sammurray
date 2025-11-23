import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import Subscription from '../subscription/subscription.model';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import { IListing } from './listing.interface';
import Listing from './listing.model';

const createListing = async (userId: string, payload: IListing) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const property = await Listing.create({ ...payload, user: user._id });
  if (!property) {
    throw new AppError(400, 'Listing not created');
  }
  return property;
};

// const getAllListing = async (
//   params: any,
//   options: IOption,
//   isSubscriptionActive: boolean,
// ) => {
//   const { page, limit, skip, sortBy, sortOrder } = pagination(options);
//   const { searchTerm, ...filterData } = params;

//   const andCondition: any[] = [];
//   const searchableFields = [
//     'address',
//     'size',
//     'title',
//     'description',
//     'country',
//     'city',
//     'areaya',
//     'mounth',
//   ];

//   if (searchTerm) {
//     andCondition.push({
//       $or: [
//         ...searchableFields.map((field) => ({
//           [field]: { $regex: searchTerm, $options: 'i' },
//         })),
//         { 'type.name': { $regex: searchTerm, $options: 'i' } }, // ✅ search by PropertyType name
//       ],
//     });
//   }

//   if (Object.keys(filterData).length) {
//     andCondition.push({
//       $and: Object.entries(filterData).map(([field, value]) => ({
//         [field]: value,
//       })),
//     });
//   }

//   const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

//   let projection = {};

//   if (!isSubscriptionActive) {
//     projection = {
//       description: 0,
//       size: 0,
//       areaya: 0,
//       mounth: 0,
//       extaraLocation: 0,
//       createdAt: 0,
//       updatedAt: 0,
//       user: 0,
//       __v: 0,
//     };
//   }

//   const result = await Listing.find(whereCondition)
//     .select(projection)
//     .skip(skip)
//     .limit(limit)
//     .sort({ [sortBy]: sortOrder } as any)
//     .populate('type');

//   const total = await Listing.countDocuments(whereCondition);

//   return {
//     data: result,
//     meta: { total, page, limit },
//   };
// };

const getAllListing = async (
  params: any,
  options: IOption,
  isSubscriptionActive: boolean, // user's subscription status
  subscriptionSystemActive: boolean // whether subscription system is active
) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const searchableFields = [
    'address',
    'size',
    'title',
    'description',
    'country',
    'city',
    'areaya',
    'mounth',
  ];

  // Search
  if (searchTerm) {
    andCondition.push({
      $or: [
        ...searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
        { 'type.name': { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }

  // Filters
  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  // Determine projection based on rules
  let projection = {};

  }

  const result = await Listing.find(whereCondition)
    .select(projection)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('type').populate('user', 'fullName profileImage');

  const total = await Listing.countDocuments(whereCondition);

  return {
    data: result,
    meta: { total, page, limit },
  };
};


const getSingleListting = async (id: string, isSubscriptionActive: boolean) => {
  let projection = {};

  if (!isSubscriptionActive) {
    projection = {
      description: 0,
      size: 0,
      areaya: 0,
      mounth: 0,
      extaraLocation: 0,
      createdAt: 0,
      updatedAt: 0,
      user: 0,
      __v: 0,
    };
  }
  const property = await Listing.findById(id)
    .select(projection)
    .populate('user')
    .populate('type');
  if (!property) {
    throw new AppError(404, 'Property not found');
  }
  return property;
};

const getAdminAllListing = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const searchableFields = [
    'address',
    'size',
    'title',
    'description',
    'country',
    'city',
    'areaya',
    'mounth',
  ];

  if (searchTerm) {
    andCondition.push({
      $or: [
        ...searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
        { 'type.name': { $regex: searchTerm, $options: 'i' } }, // ✅ search by PropertyType name
      ],
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

  const result = await Listing.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('type');
  if (!result) {
    throw new AppError(404, 'Property not found');
  }
  const total = await Listing.countDocuments(whereCondition);
  return {
    data: result,
    meta: { total, page, limit },
  };
};

const updateListing = async (id: string, payload: Partial<IListing>) => {
  const listing = await Listing.findByIdAndUpdate(id, payload, { new: true });
  if (!listing) {
    throw new AppError(404, 'Property not found');
  }
  return listing;
};

const deleteListing = async (id: string) => {
  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    throw new AppError(404, 'Property not found');
  }
  return listing;
};

const updateMyListing = async (
  id: string,
  userId: string,
  payload: Partial<IListing>,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const property = await Listing.findOneAndUpdate(
    { _id: id, user: userId },
    payload,
    { new: true },
  );
  if (!property) {
    throw new AppError(404, 'Property not found');
  }
  return property;
};

const getMyAllListing = async (
  userId: string,
  params: any,
  options: IOption,
) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const searchableFields = [
    'address',
    'size',
    'title',
    'description',
    'country',
    'city',
    'areaya',
    'mounth',
  ];

  if (searchTerm) {
    andCondition.push({
      $or: [
        ...searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
        { 'type.name': { $regex: searchTerm, $options: 'i' } }, // ✅ search by PropertyType name
      ],
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
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const result = await Listing.find({ ...whereCondition, user: userId })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('type');
  if (!result) {
    throw new AppError(404, 'Property not found');
  }
  const total = await Listing.countDocuments({
    ...whereCondition,
    user: userId,
  });
  return {
    data: result,
    meta: { total, page, limit },
  };
};

const deleteMyListing = async (id: string, userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const listing = await Listing.findOneAndDelete({ _id: id, user: userId });
  if (!listing) {
    throw new AppError(404, 'Property not found');
  }
  return listing;
};

const getAdminWonSingleListing = async (id: string) => {
  const property = await Listing.findById(id);
  if (!property) {
    throw new AppError(404, 'Property not found');
  }
  return property;
};

export const listingService = {
  createListing,
  getAllListing,
  getSingleListting,

  getAdminAllListing,
  updateListing,
  deleteListing,

  getAdminWonSingleListing,

  getMyAllListing,
  updateMyListing,
  deleteMyListing,
};
