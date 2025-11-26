import z from 'zod';
import { userRole } from './user.constant';

// Use the imported constant to avoid duplication & fix "unused" error
const roleEnum = [userRole.TENANT, userRole.SUPPLIER, userRole.ADMIN] as const;

/* -------------------------------- Zod Schema -------------------------------- */
export const zUserSchema = z.object({
  fullName: z.string().min(3, 'Name must be ≥3 chars'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be ≥6 chars'),
  role: z.enum(roleEnum).default(userRole.TENANT),

  // Optional fields
  profileImage: z.string().optional(),
  agencyName: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  licenseImage: z.string().optional(),
  logoImage: z.string().optional(),
  bio: z.string().optional(),
  otp: z.string().optional(),
  otpExpiry: z.coerce.date().optional(),
  verified: z.boolean().optional(),
  stripeAccountId: z.string().optional(),
});

/* Update → all fields optional */
export const zUpdateUserSchema = zUserSchema.partial();

/* Export for convenience */
export const userValidation = {
  create: zUserSchema,
  update: zUpdateUserSchema,
};
