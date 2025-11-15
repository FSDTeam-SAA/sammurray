import { Request, Response } from 'express';
import config from '../config';
import Stripe from 'stripe';
import Payment from '../modules/payment/payment.model';
import User from '../modules/user/user.model';

const stripe = new Stripe(config.stripe.secretKey!);

const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig,
      config.stripe.webhookSecret!
    );
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("🔥 EVENT:", event.type);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const payment = await Payment.findOne({ stripeSessionId: session.id });
      if (!payment) return res.json({ received: true });

      payment.status = "completed";
      payment.stripePaymentIntentId = session.payment_intent as string;

      await payment.save();

      const user = await User.findById(payment.user);
      if (user) {
        user.isSubscription = true;
        await user.save();
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as Stripe.PaymentIntent;

      const payment = await Payment.findOne({
        stripePaymentIntentId: intent.id,
      });

      if (payment) {
        payment.status = "failed";
        await payment.save();
      }
    }

    return res.json({ received: true });
  } catch (err: any) {
    console.error("❌ Handler Error:", err.message);
    return res.status(500).send(`Webhook Handler Error: ${err.message}`);
  }
};


export default stripeWebhookHandler;
