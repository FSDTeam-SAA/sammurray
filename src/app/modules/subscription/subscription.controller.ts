import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { subscriptionService } from './subscription.service';

const createSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.createSubscription(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Subscription created successfully',
    data: result,
  });
});

const getAllSubscription = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['searchTerm', 'name', 'discription']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await subscriptionService.getAllSubscription(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const singleSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.singleSubscription(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription retrieved successfully',
    data: result,
  });
});

const updateSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.updateSubscription(
    req.params.id!,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription updated successfully',
    data: result,
  });
});
const deleteSubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.deleteSubscription(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription deleted successfully',
    data: result,
  });
});

const paySubscription = catchAsync(async (req, res) => {
  const result = await subscriptionService.paySubscription(
    req.user?.id,
    req.params.id!,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription paid successfully',
    data: result,
  });
});

export const subscriptionController = {
  createSubscription,
  getAllSubscription,
  singleSubscription,
  updateSubscription,
  deleteSubscription,
  paySubscription,
};
