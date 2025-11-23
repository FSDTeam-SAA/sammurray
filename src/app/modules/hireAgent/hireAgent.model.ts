import mongoose from 'mongoose';

const hireAgentSchema = new mongoose.Schema(
  {
    agentId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const HireAgent = mongoose.model('HireAgent', hireAgentSchema);

export default HireAgent;
