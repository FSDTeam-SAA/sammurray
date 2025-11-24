import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { hireAgentService } from './hireAgent.service';

const createHireAgent = catchAsync(async (req, res) => {
  console.log('first');
  const result = await hireAgentService.createHireAgent(req.user.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hire agent created successfully',
    data: result,
  });
});

const getAllHireAgent = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'agentId.fullName',
    'supplierId.email',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await hireAgentService.getAllHirAgent(
    req.user?.id,
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hire agents fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleHireAgent = catchAsync(async (req, res) => {
  const result = await hireAgentService.getHireAgentById(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hire agent fetched successfully',
    data: result,
  });
});

const updateHireAgent = catchAsync(async (req, res) => {
  const result = await hireAgentService.updateHireAgentById(
    req.params.id!,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hire agent updated successfully',
    data: result,
  });
});

const deleteHireAgent = catchAsync(async (req, res) => {
  const result = await hireAgentService.deleteHireAgentById(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hire agent deleted successfully',
    data: result,
  });
});

const getAllHirAgentSupplier = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const filters = pick(req.query, [
    'searchTerm',
    'agentId.fullName',
    'supplierId.email',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await hireAgentService.getAllHirAgentSupplier(
    userId,
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hire agents retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const hireAgentController = {
  createHireAgent,
  getAllHireAgent,
  getSingleHireAgent,
  updateHireAgent,
  deleteHireAgent,
  getAllHirAgentSupplier,
};
