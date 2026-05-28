import User from '../models/User.model.js';
import { notifyUser } from '../services/notification.service.js';

export async function getPendingUsers(req, res) {
  try {
    const users = await User.find({ status: 'pending' }).select('-password -emailOtp -emailOtpExpires');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function approveUser(req, res) {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = 'active';
    await user.save();

    await notifyUser(userId, user.role, 'account_approved', 'Your account has been approved!', 0);
    res.json({ message: 'User approved', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function assignRole(req, res) {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) return res.status(400).json({ message: 'userId and role are required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    user.updatedAt = new Date();
    await user.save();

    await notifyUser(userId, role, 'role_changed', `Your role has been changed to ${role}`, 0);
    res.json({ message: 'Role assigned', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function rejectUser(req, res) {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = 'blocked';
    await user.save();
    res.json({ message: 'User rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}