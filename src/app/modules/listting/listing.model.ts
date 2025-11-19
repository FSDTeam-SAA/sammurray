import mongoose from 'mongoose';
import { IListing } from './listing.interface';

const porertySchema = new mongoose.Schema<IListing>(
  {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PropertyType',
      required: true,
    },
    address: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    areaya: { type: String },
    mounth: { type: String },
    extraLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
  },
  { timestamps: true },
);

const Listing = mongoose.model<IListing>('Listing', porertySchema);
export default Listing;
