import FAQ from '../models/FAQ.model.js';
import { awardQP } from '../services/qp.service.js';
import { notifyUser } from '../services/notification.service.js';
import { FAQ_CATEGORIES } from '../utils/constants.js';

export async function listFAQs(req, res) {
  try {
    const { category, sort = 'upvotes' } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const faqs = await FAQ.find(filter)
      .populate('createdBy', 'name role')
      .sort({ [sort]: -1, createdAt: -1 });

    // Group by category
    const grouped = faqs.reduce((acc, faq) => {
      if (!acc[faq.category]) acc[faq.category] = [];
      acc[faq.category].push(faq);
      return acc;
    }, {});

    res.json({ faqs, grouped, categories: FAQ_CATEGORIES });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getFAQ(req, res) {
  try {
    const faq = await FAQ.findById(req.params.id).populate('createdBy', 'name role');
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json(faq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function createFAQ(req, res) {
  try {
    const { question, answer, category, tags } = req.body;
    if (!question || !answer || !category) {
      return res.status(400).json({ message: 'question, answer, category are required' });
    }

    const faq = await FAQ.create({
      question, answer, category, tags: tags || [],
      createdBy: req.user._id
    });

    await awardQP(req.user._id, 15, 'Created new FAQ manually', faq._id);
    await notifyUser(req.user._id, req.user.role, 'faq_created', 'Your new FAQ was created. +15 QP', 15, faq._id);

    res.status(201).json(faq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updateFAQ(req, res) {
  try {
    const { question, answer, category, tags, isTrending, markedForReview } = req.body;
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (category) faq.category = category;
    if (tags) faq.tags = tags;
    if (isTrending !== undefined) faq.isTrending = isTrending;
    if (markedForReview !== undefined) faq.markedForReview = markedForReview;
    faq.updatedAt = new Date();

    await faq.save();
    res.json(faq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteFAQ(req, res) {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function upvoteFAQ(req, res) {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    const userId = req.user._id;
    const alreadyUpvoted = faq.upvotedBy.some(id => id.toString() === userId.toString());

    if (alreadyUpvoted) {
      faq.upvotedBy = faq.upvotedBy.filter(id => id.toString() !== userId.toString());
      faq.upvotes = Math.max(0, faq.upvotes - 1);
    } else {
      faq.upvotedBy.push(userId);
      faq.upvotes += 1;
    }

    await faq.save();
    res.json({ upvotes: faq.upvotes, upvoted: !alreadyUpvoted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getCategories(req, res) {
  res.json(FAQ_CATEGORIES);
}