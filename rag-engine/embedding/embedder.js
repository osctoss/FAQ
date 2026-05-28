/**
 * Simple embedding engine using TF-IDF on character n-grams.
 * Production: swap with OpenAI embeddings or sentence-transformers.
 */

export class Embedder {
  constructor({ dimension = 384, nGramRange = [1, 3] } = {}) {
    this.dimension = dimension;
    this.nGramRange = nGramRange;
  }

  _tokenize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  }

  _getNGrams(tokens) {
    const ngrams = [];
    for (let n = this.nGramRange[0]; n <= this.nGramRange[1]; n++) {
      for (let i = 0; i <= tokens.length - n; i++) {
        ngrams.push(tokens.slice(i, i + n).join(' '));
      }
    }
    return ngrams;
  }

  _computeTFIDF(texts) {
    const documents = texts.map(t => {
      const tokens = this._tokenize(t);
      return { tokens, ngrams: this._getNGrams(tokens) };
    });

    const N = documents.length;
    const df = {};
    for (const doc of documents) {
      const unique = new Set(doc.ngrams);
      for (const ng of unique) {
        df[ng] = (df[ng] || 0) + 1;
      }
    }

    const idf = {};
    for (const ng in df) {
      idf[ng] = Math.log((N + 1) / (df[ng] + 1)) + 1;
    }

    return documents.map(doc => {
      const tf = {};
      for (const ng of doc.ngrams) {
        tf[ng] = (tf[ng] || 0) + 1;
      }
      const maxTf = Math.max(...Object.values(tf), 1);
      const vec = new Array(this.dimension).fill(0);
      let idx = 0;
      for (const ng in tf) {
        const tfNorm = tf[ng] / maxTf;
        const idfVal = idf[ng] || 0;
        const weight = tfNorm * idfVal;
        if (idx < this.dimension) {
          vec[idx++] = weight;
        }
      }
      const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
      return mag > 0 ? vec.map(v => v / mag) : vec;
    });
  }

  embed(texts) {
    if (!Array.isArray(texts)) texts = [texts];
    const vectors = this._computeTFIDF(texts);
    return vectors.length === 1 ? vectors[0] : vectors;
  }

  embedSingle(text) {
    return this.embed(text);
  }
}

export default new Embedder({ dimension: 384 });