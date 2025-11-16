import { Types } from 'mongoose';

export interface IMessage {
  _id?: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  conversationId: Types.ObjectId;
  message?: string;
  file?: string;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}