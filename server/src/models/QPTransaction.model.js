import mongoose from 'mongoose';

const qpTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['earn', 'deduct'], required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('QPTransaction', qpTransactionSchema);