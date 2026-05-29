/**
 * Embedding Service
 * =================
 *
 * HOW SEMANTIC SIMILARITY WORKS:
 * -----------------------------
 * 1. Each text (question, answer, FAQ body) is converted into a 384-dimensional
 *    vector using TF-IDF character n-grams (1-3 chars). This is called an "embedding".
 *
 * 2. The embedding captures the semantic "shape" of the text:
 *    - Similar texts (same words, same topics) produce similar vectors
 *    - Different vectors point in different directions in the 384-dim space
 *
 * 3. Cosine similarity measures how aligned two vectors are:
 *    - 1.0 = identical direction (perfect match)
 *    - 0.0 = orthogonal (unrelated)
 *    - < 0 = opposite direction (very dissimilar)
 *
 * 4. Qdrant stores these vectors and performs ANN search to find the most
 *    similar vectors to a given query vector — O(log n) instead of O(n).
 *
 * 5. The RAG engine uses these similarity scores to decide:
 *    - F1: FAQ similarity > 80% → REJECT (duplicate FAQ)
 *    - F2 + R1: FAQ 50-80% AND RTQ > 60% → REJECT (similar RTQ exists)
 *    - etc.
 *
 * MONGODB VS QDRANT STORAGE:
 * --------------------------
 * - MongoDB stores the raw application documents (FAQ, RTQ) with full fields
 * - Qdrant stores ONLY the embedding vector + minimal payload (mongoId, text)
 * - This separation keeps Qdrant lean and fast for similarity search
 * - The mongoId payload lets us look up the full MongoDB document after a match
 *
 * CHUNK 2: Corpus-aware embeddings.
 * - FAQ operations use embedder with corpusName='faq'
 * - RTQ operations use embedder with corpusName='rtq'
 * - Each corpus has isolated IDF vocabulary — no cross-contamination.
 */

import embedder from '../../../../rag-engine/embedding/embedder.js';
import logger from '../../utils/logger.js';

export const CORPUS_FAQ = 'faq';
export const CORPUS_RTQ = 'rtq';

export function preprocessText(text) {
  if (!text || typeof text !== 'string') return '';
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function buildFAQText(faq) {
  return [faq.question, faq.answer, faq.category, ...(faq.tags || [])].join(' ');
}

export function buildRTQText(rtq) {
  return [rtq.question, rtq.category, ...(rtq.tags || [])].join(' ');
}

export function generateEmbedding(text, corpusName = null) {
  const clean = preprocessText(text);
  if (!clean) return new Array(384).fill(0);
  const embedding = embedder.embedSingle(clean, corpusName);

  if (!embedding || embedding.length === 0) {
    logger.warn('[Embedding] Generated empty embedding for text:', clean.substring(0, 50));
    return new Array(384).fill(0);
  }

  return embedding;
}

export function generateMultipleEmbeddings(texts, corpusName = null) {
  if (!texts || texts.length === 0) return [];
  return texts.map(t => generateEmbedding(t, corpusName));
}

export function rebuildCorpus(corpusName, texts) {
  if (!texts || texts.length === 0) {
    logger.warn(`[Embedding] rebuildCorpus(${corpusName}) called with empty texts — IDF vocabulary not updated`);
    return;
  }
  const cleanTexts = texts.map(preprocessText).filter(Boolean);
  embedder.rebuildVocabulary(corpusName, cleanTexts);
  logger.info(`[Embedding] IDF vocabulary rebuilt for corpus '${corpusName}' from ${cleanTexts.length} documents`);
}

export function getEmbedder() {
  return embedder;
}