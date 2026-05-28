import { cosineSimilarity } from '../similarity/cosine.similarity.js';
import { RAG_THRESHOLDS } from '../../shared/constants.js';
import faqVectorDB from '../vectorDB/faq-vector.js';
import rtqVectorDB from '../vectorDB/rtq-vector.js';
import embedder from '../embedding/embedder.js';

export async function evaluateQuestion(questionText) {
  const questionEmbedding = embedder.embedSingle(questionText);

  // STEP 1: FAQ Matching
  const topFAQs = await faqVectorDB.findMostSimilar(questionEmbedding, { limit: 10 });
  const bestFAQ = topFAQs[0];
  const faqScore = bestFAQ ? bestFAQ.score : 0;

  // F1: FAQ > 80%
  if (faqScore > RAG_THRESHOLDS.FAQ_F1) {
    await faqVectorDB.upvoteFAQ(bestFAQ.faq._id);
    return {
      status: 'REJECT',
      penalty: -5,
      upvoteFAQ: bestFAQ.faq._id,
      matchedFAQ: { _id: bestFAQ.faq._id, question: bestFAQ.faq.question },
      faqScore,
      reason: 'F1: Strong FAQ match (>80%)'
    };
  }

  // STEP 2: RTQ Matching
  const topRTQs = await rtqVectorDB.findMostSimilar(questionEmbedding, { limit: 10 });
  const bestRTQ = topRTQs[0];
  const rtqScore = bestRTQ ? bestRTQ.score : 0;

  // F2: 50% < FAQ <= 80%
  if (faqScore > RAG_THRESHOLDS.FAQ_F2_MIN && faqScore <= RAG_THRESHOLDS.FAQ_F1) {
    if (rtqScore > RAG_THRESHOLDS.RTQ_R1) {
      await faqVectorDB.upvoteFAQ(bestFAQ.faq._id);
      await rtqVectorDB.upvoteRTQ(bestRTQ.rtq._id);
      return {
        status: 'REJECT',
        penalty: -5,
        upvoteFAQ: bestFAQ.faq._id,
        upvoteRTQ: bestRTQ.rtq._id,
        matchedFAQ: { _id: bestFAQ.faq._id, question: bestFAQ.faq.question },
        matchedRTQ: { _id: bestRTQ.rtq._id, question: bestRTQ.rtq.question },
        faqScore,
        rtqScore,
        reason: 'F2+R1: FAQ medium match + RTQ high match'
      };
    }
    if (rtqScore > RAG_THRESHOLDS.RTQ_R2_MIN && rtqScore <= RAG_THRESHOLDS.RTQ_R1) {
      return {
        status: 'REJECT',
        penalty: 0,
        matchedFAQ: { _id: bestFAQ.faq._id, question: bestFAQ.faq.question },
        matchedRTQ: { _id: bestRTQ.rtq._id, question: bestRTQ.rtq.question },
        faqScore,
        rtqScore,
        reason: 'F2+R2: FAQ medium match + RTQ medium match (no penalty)'
      };
    }
    return {
      status: 'ACCEPT',
      target: 'RTQ',
      matchedFAQ: { _id: bestFAQ.faq._id, question: bestFAQ.faq.question },
      faqScore,
      rtqScore,
      reason: 'F2+R3: FAQ medium match + RTQ low match -> Accept to RTQ'
    };
  }

  // F3: FAQ <= 50%
  if (faqScore <= RAG_THRESHOLDS.FAQ_F2_MIN) {
    if (rtqScore > RAG_THRESHOLDS.RTQ_R1) {
      await rtqVectorDB.upvoteRTQ(bestRTQ.rtq._id);
      return {
        status: 'REJECT',
        penalty: 0,
        upvoteRTQ: bestRTQ.rtq._id,
        matchedRTQ: { _id: bestRTQ.rtq._id, question: bestRTQ.rtq.question },
        faqScore,
        rtqScore,
        reason: 'F3+R1: FAQ low match + RTQ high match (no penalty)'
      };
    }
    return {
      status: 'ACCEPT',
      target: 'RTQ',
      faqScore,
      rtqScore,
      reason: 'F3+R2/R3: Low FAQ match -> Accept to RTQ'
    };
  }

  return {
    status: 'ACCEPT',
    target: 'RTQ',
    faqScore,
    rtqScore,
    reason: 'Fallback: Accept to RTQ'
  };
}