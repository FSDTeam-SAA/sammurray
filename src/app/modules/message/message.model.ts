import mongoose, { Schema } from 'mongoose';
import { IMessage } from './message.interface';

const messageSchema = new Schema<IMessage>(
  {
    senderId: { 
      type: mongoose.Schema.ObjectId, 
      ref: 'User', 
      required: true 
    },
    receiverId: { 
      type: mongoose.Schema.ObjectId, 
      ref: 'User', 
      required: true 
    },
    conversationId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    message: { 
      type: String,
      trim: true 
    },
    file: { 
      type: String 
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


const Message = mongoose.model<IMessage>('Message', messageSchema);
export default Message;