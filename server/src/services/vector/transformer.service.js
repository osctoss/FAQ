/**
 * Transformer Embedding Service
 * ==============================
 *
 * CHUNK 7: Optional transformer-based semantic embeddings.
 *
 * HOW IT WORKS:
 * --------------
 * Transformer models (e.g., sentence-transformers) produce dense 384-dim
 * vectors that capture semantic meaning, not just lexical matching.
 *
 * Example: "I forgot my password" and "I can't log in" are semantically
 * similar even though they share few character n-grams. A transformer
 * places them close in vector space.
 *
 * CURRENT STATUS: Fallback mode active.
 * - Requires npm install @xenova/transformers
 * - When installed: use TransformerEmbedder class
 * - When not installed: falls back to the existing TF-IDF embedder
 *
 * USAGE:
 * ------
 * 1. npm install @xenova/transformers
 * 2. Replace FAISS/Cosine with TransformerEmbedder
 * 3. Call embedder.initialize() once at server startup
 * 4. Call embedder.embed(text) for 384-dim semantic vectors
 *
 * MODELS:
 * -------
 * Recommended models (all produce 384-dim vectors):
 *   - 'Xenova/all-MiniLM-L6-v2' (fast, ~80MB)
 *   - 'Xenova/all-mpnet-base-v2' (better quality, ~420MB)
 *   - 'Xenova/bge-small-en-v1.5' (good balance, ~130MB)
 *
 * TO ENABLE:
 * -----------
 * In server/src/services/vector/embedding.service.js, change:
 *   import embedder from '../../../../rag-engine/embedding/embedder.js';
 *   to:
 *   import { getEmbedder } from './transformer.service.js';
 *   and call: const embedder = await getEmbedder(corpusName);
 */

import embedder from '../../../../rag-engine/embedding/embedder.js';
import logger from '../../utils/logger.js';

export const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';
export const EMBEDDING_DIM = 384;

let _transformerEmbedder = null;
let _initPromise = null;

class TransformerEmbedder {
  constructor() {
    this.pipeline = null;
    this.initialized = false;
    this.modelName = EMBEDDING_MODEL;
    this.dimension = EMBEDDING_DIM;
  }

  /**
   * Initialize the transformer pipeline.
   * Downloads model on first run (~80MB).
   */
  async initialize() {
    if (this.initialized) return;
    try {
      const { pipeline } = await import('@xenova/transformers');
      this.pipeline = await pipeline('feature-extraction', this.modelName);
      this.initialized = true;
      logger.info(`[Transformer] Loaded model: ${this.modelName}`);
    } catch (err) {
      logger.error('[Transformer] Failed to load model:', err.message);
      throw err;
    }
  }

  /**
   * Embed a single text into a 384-dim dense vector.
   */
  async embed(text) {
    if (!this.initialized) throw new Error('[Transformer] Not initialized — call initialize() first');
    if (!text || typeof text !== 'string') return new Array(this.dimension).fill(0);

    try {
      const result = await this.pipeline(text, {
        pooling: 'mean',
        normalize: true,
      });

      const vector = Array.from(result.data);

      if (vector.length === 0) {
        logger.warn('[Transformer] Empty embedding for text:', text.substring(0, 50));
        return new Array(this.dimension).fill(0);
      }

      // Pad or truncate to 384
      while (vector.length < this.dimension) vector.push(0);
      if (vector.length > this.dimension) vector.length = this.dimension;

      return vector;
    } catch (err) {
      logger.error('[Transformer] Embed failed:', err.message);
      return new Array(this.dimension).fill(0);
    }
  }

  /**
   * Batch embed multiple texts.
   */
  async embedBatch(texts) {
    if (!texts || texts.length === 0) return [];
    return Promise.all(texts.map(t => this.embed(t)));
  }
}

/**
 * Get (or create) the singleton transformer embedder instance.
 * Resolves immediately if already initialized, otherwise waits.
 */
export async function getTransformerEmbedder() {
  if (_transformerEmbedder && _transformerEmbedder.initialized) {
    return _transformerEmbedder;
  }

  if (!_initPromise) {
    _initPromise = (async () => {
      const te = new TransformerEmbedder();
      try {
        await te.initialize();
        _transformerEmbedder = te;
      } catch (err) {
        logger.warn('[Transformer] Falling back to TF-IDF embedder — install @xenova/transformers for semantic embeddings');
        _initPromise = null;
      }
    })();
  }

  await _initPromise;
  return _transformerEmbedder;
}

/**
 * Check if transformer embeddings are available and loaded.
 */
export function isTransformerAvailable() {
  return _transformerEmbedder !== null && _transformerEmbedder.initialized;
}

/**
 * Pre-warm the model by embedding a dummy sentence.
 * Call during server startup to avoid first-request delay.
 */
export async function warmUpTransformer() {
  if (!isTransformerAvailable()) return;
  try {
    await _transformerEmbedder.embed('warmup');
    logger.info('[Transformer] Warm-up complete');
  } catch (err) {
    logger.warn('[Transformer] Warm-up failed:', err.message);
  }
}

export default {
  getTransformerEmbedder,
  isTransformerAvailable,
  warmUpTransformer,
  TransformerEmbedder,
};