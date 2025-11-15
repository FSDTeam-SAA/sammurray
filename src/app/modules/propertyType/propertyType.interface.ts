import { Types } from 'mongoose';

export interface IPropertyType {
  name: string;
  createBy: Types.ObjectId;
}
