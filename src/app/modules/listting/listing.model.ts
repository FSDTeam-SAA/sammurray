import mongoose from 'mongoose';
import { IListing } from './listing.interface';



const porertySchema = new mongoose.Schema<IListing>(
  {
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyType', required: true },
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
    extaraLocation: {
      letatus: { type: String },
      languate: { type: String },
    },
  },
  { timestamps: true },
);

const Property = mongoose.model<IListing>('Property', porertySchema);
export default Property;
