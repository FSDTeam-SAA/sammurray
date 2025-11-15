import mongoose from 'mongoose';
import { IPropertyType } from './propertyType.interface';

const propertyTypeSchema = new mongoose.Schema<IPropertyType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const PropertyType = mongoose.model<IPropertyType>(
  'PropertyType',
  propertyTypeSchema,
);

export default PropertyType;
