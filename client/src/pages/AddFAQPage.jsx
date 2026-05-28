import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import faqService from '../services/faq.service';
import { FAQ_CATEGORIES } from '../utils/constants';

export default function AddFAQPage() {
  const [form, setForm] = useState({ question: '', answer: '', category: '', tags: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.question || !form.answer || !form.category) {
      setError('Question, answer, and category are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      await faqService.create({ ...form, tags });
      navigate('/faq');
    } catch (err) {
      setError(err.message || 'Failed to create FAQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Add New FAQ</h1>
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Question</label>
            <textarea
              name="question"
              value={form.question}
              onChange={handleChange}
              className="input resize-none"
              rows={3}
              placeholder="What question are you answering?"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Answer</label>
            <textarea
              name="answer"
              value={form.answer}
              onChange={handleChange}
              className="input resize-none"
              rows={5}
              placeholder="The detailed answer..."
              required
            />
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
              placeholder="react, hooks, state"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create FAQ'}
            </button>
            <button type="button" onClick={() => navigate('/faq')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}