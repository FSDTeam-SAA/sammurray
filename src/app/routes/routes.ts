import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { subscriptionRouter } from '../modules/subscription/subscription.routes';
import { propertyTypeRouter } from '../modules/propertyType/propertyType.routes';
import { propertyRouter } from '../modules/property/property.routes';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
