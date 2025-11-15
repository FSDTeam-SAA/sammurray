import mongoose from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new mongoose.Schema<IPayment>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    stripeSessionId: { type: String, required: true, unique: true },
    stripePaymentIntentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;
