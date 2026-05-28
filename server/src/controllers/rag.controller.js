import { evaluateQuestion } from '../../../rag-engine/decision-engine/decision.tree.js';
import embedder from '../../../rag-engine/embedding/embedder.js';

export async function evaluate(req, res) {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: 'question is required' });

    const result = await evaluateQuestion(question);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function rebuildVectors(req, res) {
  try {
    // Lazy import to avoid circular deps
    const { default: faqVectorDB } = await import('../../../rag-engine/vectorDB/faq-vector.js');
    const { default: rtqVectorDB } = await import('../../../rag-engine/vectorDB/rtq-vector.js');

    const faqResult = await faqVectorDB.rebuildIndex();
    const rtqResult = await rtqVectorDB.rebuildIndex();

    res.json({ message: 'Vectors rebuilt', faqs: faqResult.count, rtqs: rtqResult.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}