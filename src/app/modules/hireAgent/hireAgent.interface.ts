import { Types } from 'mongoose';

export interface IHireAgent {
  agentId: Types.ObjectId[];
  supplierId: Types.ObjectId;
}
