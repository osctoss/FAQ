import Question from '../models/Question.model.js';
import { awardQP } from '../services/qp.service.js';
import { notifyUser } from '../services/notification.service.js';

export async function createQuestion(req, res) {
  try {
    const { question, category, tags } = req.body;
    if (!question || !category) {
      return res.status(400).json({ message: 'question and category are required' });
    }

    const q = await Question.create({
      userId: req.user._id,
      question,
      category,
      tags: tags || []
    });

    res.status(201).json(q);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getUserQuestions(req, res) {
  try {
    const userId = req.params.userId || req.user._id;
    const questions = await Question.find({ userId })
      .populate('answers')
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    if (question.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    question.status = status;
    question.updatedAt = new Date();
    await question.save();
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function markResolved(req, res) {
  try {
    const { status, resolvedWithAnswerId } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    if (question.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    question.status = status || 'resolved';
    question.updatedAt = new Date();
    if (resolvedWithAnswerId) {
      question.answers.push(resolvedWithAnswerId);
    }
    await question.save();
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}