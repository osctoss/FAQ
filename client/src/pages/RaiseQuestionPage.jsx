import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import rtqService from '../services/rtq.service';
import ragService from '../services/rag.service';
import { FAQ_CATEGORIES } from '../utils/constants';

export default function RaiseQuestionPage() {
  const [form, setForm] = useState({ question: '', category: '', tags: '' });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'question') setPreview(null);
  };

  const handleEvaluate = async () => {
    if (!form.question) return;
    try {
      const result = await ragService.evaluateQuestion({ question: form.question });
      setPreview(result);
    } catch (err) {
      setError('Failed to evaluate question');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await rtqService.submitQuestion({ ...form, tags });
      if (res.status === 'REJECT') {
        setPreview(res);
        setError(`Question rejected: ${res.reason}. ${res.penalty} QP penalty applied.`);
      } else {
        navigate('/rtq');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Raise a Question</h1>
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {preview?.status === 'REJECT' && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
              <strong>Rejected:</strong> {preview.reason}
            </div>
          )}
          {preview?.status === 'FAQ_MATCH' && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
              <strong>Found similar FAQ:</strong> {preview.matchedQuestion}
              <br />
              <span className="text-xs">Similarity: {(preview.similarity * 100).toFixed(1)}% — your question may be a duplicate.</span>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Your Question</label>
            <textarea
              name="question"
              value={form.question}
              onChange={handleChange}
              className="input resize-none"
              rows={4}
              placeholder="Describe your question clearly..."
              required
            />
            <button
              type="button"
              onClick={handleEvaluate}
              className="mt-2 text-sm text-primary font-medium hover:underline"
              disabled={!form.question}
            >
              🔍 Check for duplicates first
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select a category</option>
              {FAQ_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="input"
              placeholder="javascript, async, promise"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Submitting...' : 'Submit Question'}
            </button>
            <button type="button" onClick={() => navigate('/rtq')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}