import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import PropertyType from '../propertyType/propertyType.model';
import Subscription from '../subscription/subscription.model';
import { listingService } from './listing.service';



// const getAllListtings = catchAsync(async (req, res) => {
//   const filters = pick(req.query, [
//     'searchTerm',
//     'type',
//     'address',
//     'size',
//     'title',
//     'description',
//     'country',
//     'city',
//     'areaya',
//     'mounth',
//   ]);

//   const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
//   if (filters.type) {
//     const typeDoc = await PropertyType.findOne({ name: filters.type });
//     if (typeDoc)
//       filters.type = typeDoc._id.toString(); // replace string with ObjectId
//     else delete filters.type; // if not found, ignore filter
//   }

//   const isSubscriptionActive =
//     req.user?.isSubscription === true &&
//     req.user?.subscriptionExpiry &&
//     new Date(req.user.subscriptionExpiry) > new Date();

//   const result = await listingService.getAllListing(
//     filters,
//     options,
//     isSubscriptionActive,
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Listtings retrieved successfully',
//     meta: result.meta,
//     data: result.data,
//   });
// });

// const getSingleListting = catchAsync(async (req, res) => {
//   const isSubscriptionActive =
//     req.user?.isSubscription === true &&
//     req.user?.subscriptionExpiry &&
//     new Date(req.user.subscriptionExpiry) > new Date();
//   const id = req.params.id!;


//   const result = await listingService.getSingleListting(
//     id,
//     isSubscriptionActive,

//   );
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Listting retrieved successfully',
//     data: result,
//   });
// });



const createListting = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await listingService.createListing(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Listting created successfully',
    data: result,
  });
});



const getAllListtings = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'type',
    'address',
    'size',
    'title',
    'description',
    'country',
    'city',
    'areaya',
    'mounth',
  ]);

  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  if (filters.type) {
    const typeDoc = await PropertyType.findOne({ name: filters.type });
    if (typeDoc) {
      filters.type = typeDoc._id.toString();
    } else {
      delete filters.type;
    }
  }

  const isSubscriptionActive =
    req.user?.isSubscription === true &&
    req.user?.subscriptionExpiry &&
    new Date(req.user.subscriptionExpiry) > new Date();

  const subscriptionSystemActive =
    (await Subscription.countDocuments({ status: 'active' })) > 0;

  const result = await listingService.getAllListing(
    filters,
    options,
    isSubscriptionActive,
    subscriptionSystemActive, 
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Listings retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleListting = catchAsync(async (req, res) => {
  const isSubscriptionActive =
    req.user?.isSubscription === true &&
    req.user?.subscriptionExpiry &&
    new Date(req.user.subscriptionExpiry) > new Date();
  const id = req.params.id!;

  const subscriptionSystemActive =
    (await Subscription.countDocuments({ status: 'active' })) > 0;
  const result = await listingService.getSingleListting(
    id,
    isSubscriptionActive,
    subscriptionSystemActive
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Listting retrieved successfully',
    data: result,
  });
});

const getAdminAllListtings = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'type',
    'address',
    'size',
    'title',
    'description',
    'country',
    'city',
    'areaya',
    'mounth',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  if (filters.type) {
    const typeDoc = await PropertyType.findOne({ name: filters.type });
    if (typeDoc)
      filters.type = typeDoc._id.toString();
    else delete filters.type; 
  }
  const result = await listingService.getAdminAllListing(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Listtings retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateListting = catchAsync(async (req, res) => {
  const id = req.params.id!;

  const result = await listingService.updateListing(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Listting updated successfully',
    data: result,
  });
});

const deleteListting = catchAsync(async (req, res) => {
  const id = req.params.id!;
  const result = await listingService.deleteListing(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Listting deleted successfully',
    data: result,
  });
});

const getAdminWonSingleListting = catchAsync(async (req, res) => {
  const id = req.params.id!;
  const result = await listingService.getAdminWonSingleListing(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Listting retrieved successfully',
    data: result,
  });
});

const getMyAllListtings = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',

    'type',
    'address',
    'size',
    'title',
    'description',
    'country',
    'city',
    'areaya',
    'mounth',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  if (filters.type) {
    const typeDoc = await PropertyType.findOne({ name: filters.type });
    if (typeDoc) filters.type = typeDoc._id.toString();
    else delete filters.type;
  }
  const userId = req.user.id;
  const result = await listingService.getMyAllListing(userId, filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Listtings retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});
const updateMyListting = catchAsync(async (req, res) => {
  const id = req.params.id!;
  const userId = req.user.id;
  const result = await listingService.updateMyListing(id, userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Listting updated successfully',
    data: result,
  });
});

const deleteMyListing = catchAsync(async (req, res) => {
  const id = req.params.id!;
  const userId = req.user.id;
  const result = await listingService.deleteMyListing(id, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Listting deleted successfully',
    data: result,
  });
});

export const listingController = {
  createListting,
  getAllListtings,
  getSingleListting,

  getAdminAllListtings,
  updateListting,
  deleteListting,

  getAdminWonSingleListting,

  getMyAllListtings,
  updateMyListting,
  deleteMyListing,
};
