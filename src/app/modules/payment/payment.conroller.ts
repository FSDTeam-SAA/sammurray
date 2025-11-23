import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { paymentService } from './payment.service';

const getAllPayment = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['searchTerm', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await paymentService.getAllPayment(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const paymentController = {
  getAllPayment,
};
