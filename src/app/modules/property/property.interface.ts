import { Types } from 'mongoose';

export interface IProperty {
  type: Types.ObjectId;
  address: string;
  size: string;
  price: number;
  title: string;
  description?: string;
  thumble?: string;
  user: Types.ObjectId;
  country?: string;
  city: string;
  areaya?: string;
  mounth?: string;
  extaraLocation?: {
    letatus: string;
    languate: string;
  };
}
