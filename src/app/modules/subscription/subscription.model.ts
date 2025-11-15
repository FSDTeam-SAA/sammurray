import mongoose from 'mongoose';
import { ISubscription } from './subscription.interface';

const subscriptionSchema = new mongoose.Schema<ISubscription>(
  {
    name: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

const Subscription = mongoose.model<ISubscription>(
  'Subscription',
  subscriptionSchema,
);

export default Subscription;
