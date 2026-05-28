import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { config } from '../config/env.js';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function signupUser({ name, username, email, password }) {
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    if (existing.email === email) return { error: 'Email already registered' };
    return { error: 'Username already taken' };
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + config.OTP_EXPIRY_MINUTES * 60 * 1000);

  const user = await User.create({
    name, username, email, password,
    emailOtp: otp,
    emailOtpExpires: otpExpiry
  });

  console.log(`[OTP] For ${email}: ${otp}`);
  return { userId: user._id, otp };
}

export async function verifyOTP(userId, otp) {
  const user = await User.findById(userId);
  if (!user) return { error: 'User not found' };
  if (user.status === 'active') return { error: 'Already verified' };
  if (user.emailOtp !== otp || new Date() > user.emailOtpExpires) {
    return { error: 'Invalid or expired OTP' };
  }

  user.status = 'active';
  user.emailOtp = undefined;
  user.emailOtpExpires = undefined;
  await user.save();
  return { user };
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) return { error: 'Invalid credentials' };
  if (user.status !== 'active') return { error: 'Account not active. Please verify your email.' };

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return { error: 'Invalid credentials' };

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
  return { token, user };
}

export async function getMe(userId) {
  return await User.findById(userId);
}