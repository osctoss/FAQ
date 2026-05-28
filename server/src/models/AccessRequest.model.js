/**
 * AccessRequest Model
 * ==================
 *
 * Stores signup requests from emails NOT in the whitelist.
 *
 * FLOW:
 * -----
 * User tries to signup → email not in whitelist → blocked
 * User clicks "Request Approval" → AccessRequest created (pending)
 * Admin views pending requests → approves or rejects
 *
 * ON APPROVAL:
 *   → Email is added to EmailWhitelist
 *   → AccessRequest marked as 'approved'
 *   → User can now sign up normally
 *
 * ON REJECTION:
 *   → AccessRequest marked as 'rejected'
 *   → Email NOT added to whitelist
 *   → User cannot sign up
 *
 * WHY NOT REUSE RoleRequest:
 * --------------------------
 * RoleRequest is for BLOCKED existing users requesting re-access.
 * AccessRequest is for NEW users requesting initial signup permission.
 * These are different concerns — keeping them separate maintains clarity.
 */

import mongoose from 'mongoose';

const accessRequestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminNote: {
    type: String,
    default: null
  }
});

accessRequestSchema.index({ status: 1, requestedAt: -1 });

export default mongoose.model('AccessRequest', accessRequestSchema);