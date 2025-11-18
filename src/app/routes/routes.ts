import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { subscriptionRouter } from '../modules/subscription/subscription.routes';
import { propertyTypeRouter } from '../modules/propertyType/propertyType.routes';
import { propertyRouter } from '../modules/property/property.routes';
import { conversationRoutes } from '../modules/conversation/conversation.routes';
import { messageRoutes } from '../modules/message/message.routes';
import { listingRouter } from '../modules/listting/listing.routes';
import { bookingRouter } from '../modules/booking/booking.routes';
import { dashboardRouter } from '../modules/dashboard/dashboard.routes';
import { paymentRouter } from '../modules/payment/payment.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/subscription',
    route: subscriptionRouter,
  },
  {
    path: '/propertytype',
    route: propertyTypeRouter,
  },
  {
    path: '/property',
    route: propertyRouter,
  },
  {
    path: '/conversation',
    route: conversationRoutes,
  },
  {
    path: '/conversation',
    route: conversationRoutes,
  },
  {
    path: '/message',
    route: messageRoutes,
  },
  {
    path: '/listing',
    route: listingRouter,
  },
  {
    path: '/booking',
    route: bookingRouter,
  },
  {
    path: '/dashboard',
    route: dashboardRouter,
  },
  {
    path: '/payment',
    route: paymentRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
