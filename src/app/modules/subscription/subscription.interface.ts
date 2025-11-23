import { Types } from 'mongoose';

export interface ISubscription {
  name: string;
  discription?: string;
  amount: number;
  type?: 'monthly' | 'yearly';
  user?: Types.ObjectId[];
  status?: 'active' | 'inactive';
}
