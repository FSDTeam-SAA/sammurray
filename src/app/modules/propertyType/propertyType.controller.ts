import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { propertyTypeService } from './propertyType.service';

const createPropertyType = catchAsync(async (req, res) => {
  const result = await propertyTypeService.createPropertyType(
    req.body,
    req.user?.id,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Property Type created successfully',
    data: result,
  });
});
const getAllPropertyType = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['searchTerm', 'name']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await propertyTypeService.getAllPropertyType(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property Type retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSinglePropertyType = catchAsync(async (req, res) => {
  const result = await propertyTypeService.getSinglePropertyType(
    req.params.id!,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property Type retrieved successfully',
    data: result,
  });
});

const updatePropertyType = catchAsync(async (req, res) => {
  const result = await propertyTypeService.updatePropertyType(
    req.params.id!,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property Type updated successfully',
    data: result,
  });
});

const deletePropertyType = catchAsync(async (req, res) => {
  const result = await propertyTypeService.deletePropertyType(req.params.id!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property Type deleted successfully',
    data: result,
  });
});

export const propertyTypeController = {
  createPropertyType,
  getAllPropertyType,
  getSinglePropertyType,
  updatePropertyType,
  deletePropertyType,
};
