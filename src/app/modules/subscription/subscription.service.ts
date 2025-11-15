import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { ISubscription } from './subscription.interface';
import Subscription from './subscription.model';
import User from '../user/user.model';
import config from '../../config';
import Stripe from 'stripe';
import Payment from '../payment/payment.model';

const stripe = new Stripe(config.stripe.secretKey!);

const createSubscription = async (payload: ISubscription) => {
  const existingSubscription = await Subscription.findOne({
    name: payload.name,
  });
  if (existingSubscription) {
    throw new AppError(400, 'Subscription already exists');
  }
  const result = await Subscription.create(payload);
  return result;
};

const getAllSubscription = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = ['name', 'discription'];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Subscription.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  const total = await Subscription.countDocuments(whereCondition);

  return {
    data: result,
    meta: { total, page, limit },
  };
};

const singleSubscription = async (id: string) => {
  const result = await Subscription.findById(id);
  if (!result) {
    throw new AppError(404, 'Subscription not found');
  }
  return result;
};

const updateSubscription = async (
  id: string,
  payload: Partial<ISubscription>,
) => {
  const existingSubscription = await Subscription.findById(id);
  if (!existingSubscription) {
    throw new AppError(404, 'Subscription not found');
  }

  if (payload.name) {
    const existingSubscriptionName = await Subscription.findOne({
      name: payload.name,
    });
    if (existingSubscriptionName && existingSubscriptionName.id !== id) {
      throw new AppError(
        400,
        'Another subscription with this name already exists',
      );
    }
  }

  const result = await Subscription.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteSubscription = async (id: string) => {
  const existingSubscription = await Subscription.findById(id);
  if (!existingSubscription) {
    throw new AppError(404, 'Subscription not found');
  }
  const result = await Subscription.findByIdAndDelete(id);
  return result;
};

const paySubscription = async (userId: string, subscriptionId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new AppError(404, 'Subscription not found');

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: subscription.amount * 100,
          product_data: {
            name: subscription.name,
            description: subscription.discription || '',
          },
        },
        quantity: 1,
      },
    ],
    customer_email: user.email,

    success_url: `${config.frontendUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.frontendUrl}/payments/cancel`,

    metadata: {
      userId: user.id,
      subscriptionId: subscription.id,
      type: subscription.type || 'monthly',
    },
  });

  await Payment.create({
    user: user.id,
    subscription: subscription.id,
    stripeSessionId: session.id,
    amount: subscription.amount,
    currency: 'usd',
    status: 'pending',
  });

  return { url: session.url, sessionId: session.id };
};

export const subscriptionService = {
  createSubscription,
  getAllSubscription,
  singleSubscription,
  updateSubscription,
  deleteSubscription,
  paySubscription,
};
