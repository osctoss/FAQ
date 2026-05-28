import Answer from '../models/Answer.model.js';
import { awardQP, deductQP } from '../services/qp.service.js';
import { notifyUser } from '../services/notification.service.js';
import { QP_RULES } from '../../../shared/constants.js';

export async function getAnswer(req, res) {
  try {
    const answer = await Answer.findById(req.params.id).populate('userId', 'name role');
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    res.json(answer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function removeAnswer(req, res) {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    await deductQP(answer.userId, Math.abs(QP_RULES.PENALTY_ANSWER_REMOVED),
      'Answer removed by senior', answer._id);
    await notifyUser(answer.userId, 'student', 'answer_removed',
      `Your answer was removed. ${QP_RULES.PENALTY_ANSWER_REMOVED} QP`, QP_RULES.PENALTY_ANSWER_REMOVED, answer._id);

    await Answer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Answer removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}