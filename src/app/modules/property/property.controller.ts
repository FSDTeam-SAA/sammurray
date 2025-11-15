import catchAsync from '../../utils/catchAsycn';
import { propertyService } from './property.service';

const createProperty = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const file = req.file as Express.Multer.File;
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await propertyService.createProperty(userId, fromData, file);
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

export const propertyController = {
  createProperty,
};
