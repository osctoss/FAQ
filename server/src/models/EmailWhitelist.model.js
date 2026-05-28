/**
 * EmailWhitelist Model
 * ====================
 *
 * Stores emails that are allowed to sign up on the platform.
 *
 * WHY A SEPARATE COLLECTION:
 * -------------------------
 * This is NOT the same as RoleRequest. RoleRequest handles re-access for blocked users.
 * EmailWhitelist handles the initial signup gate — only whitelisted emails can register.
 *
 * Admin controls this list. When an email is added here, the holder can sign up.
 * When removed, they cannot register (existing users are unaffected).
 */

import mongoose from 'mongoose';

const emailWhitelistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note: {
    type: String,
    default: null
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

emailWhitelistSchema.index({ addedBy: 1 });

export default mongoose.model('EmailWhitelist', emailWhitelistSchema);