import { getQP, getQPHistory } from '../services/qp.service.js';
import User from '../models/User.model.js';

export async function getMyScore(req, res) {
  try {
    const qp = await getQP(req.user._id);
    res.json(qp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getHistory(req, res) {
  try {
    const history = await getQPHistory(req.user._id);
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getLeaderboard(req, res) {
  try {
    const users = await User.find({ status: 'active' })
      .select('name username role qp')
      .sort({ qp: -1 })
      .limit(50);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}