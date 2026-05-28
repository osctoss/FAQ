import User from '../models/User.model.js';
import QPTransaction from '../models/QPTransaction.model.js';
import { QP_THRESHOLDS } from '../../../shared/constants.js';

async function recordTransaction(userId, type, amount, reason, referenceId = null) {
  await QPTransaction.create({ userId, type, amount, reason, referenceId });
  await User.findByIdAndUpdate(userId, { $inc: { qp: amount } });
  const updated = await User.findById(userId);
  return updated.qp;
}

export async function awardQP(userId, amount, reason, referenceId = null) {
  return await recordTransaction(userId, 'earn', Math.abs(amount), reason, referenceId);
}

export async function deductQP(userId, amount, reason, referenceId = null) {
  return await recordTransaction(userId, 'deduct', -Math.abs(amount), reason, referenceId);
}

export async function getQP(userId) {
  const user = await User.findById(userId);
  return user ? user.qp : 0;
}

export async function getQPHistory(userId) {
  return await QPTransaction.find({ userId }).sort({ createdAt: -1 }).limit(50);
}

export async function checkAutoPromotion(userId) {
  const user = await User.findById(userId);
  if (!user || user.role !== 'student') return null;
  if (user.qp >= QP_THRESHOLDS.AUTO_PROMOTE_MODERATOR) {
    return { eligible: true, currentQP: user.qp, threshold: QP_THRESHOLDS.AUTO_PROMOTE_MODERATOR };
  }
  return { eligible: false, currentQP: user.qp, threshold: QP_THRESHOLDS.AUTO_PROMOTE_MODERATOR };
}