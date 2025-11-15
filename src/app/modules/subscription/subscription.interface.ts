import { Types } from 'mongoose';

export interface ISubscription {
  name: string;
  discription?: string;
  amount: number;
  user?: Types.ObjectId[];
}
