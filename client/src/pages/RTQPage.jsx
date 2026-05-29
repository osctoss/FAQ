import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import rtqService from '../services/rtq.service';
import { useAuth } from '../context/AuthContext';
import { useQP } from '../context/QPContext';
import { timeAgo } from '../utils/helpers';
import QPBadge from '../components/QPBadge';

export default function RTQPage() {
  const [rtqs, setRtqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [answerForms, setAnswerForms] = useState({});
  const [answerLoading, setAnswerLoading] = useState({});
  const { user } = useAuth();
  const { refreshQP } = useQP();

  const loadRTQs = async () => {
    setLoading(true);
    try {
      const data = await rtqService.list({ sort: 'upvotes' });
      setRtqs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRTQs(); }, []);

  const handleSubmitAnswer = async (rtqId) => {
    const answerText = answerForms[rtqId];
    if (!answerText?.trim()) return;
    setAnswerLoading(prev => ({ ...prev, [rtqId]: true }));
    const optimisticAnswer = {
      _id: `temp-${Date.now()}`,
      answer: answerText,
      userId: { name: user.name },
      upvotes: 0,
      upvotedBy: [],
      createdAt: new Date().toISOString(),
    };
    setRtqs(prev => prev.map(r =>
      r._id === rtqId ? { ...r, answers: [...(r.answers || []), optimisticAnswer] } : r
    ));
    setAnswerForms(prev => ({ ...prev, [rtqId]: '' }));
    try {
      await rtqService.addAnswer(rtqId, { answer: answerText });
    } catch (err) {
      setRtqs(prev => prev.map(r =>
        r._id === rtqId ? { ...r, answers: r.answers.filter(a => a._id !== optimisticAnswer._id) } : r
      ));
      alert(err.message || 'Failed to submit answer');
    } finally {
      setAnswerLoading(prev => ({ ...prev, [rtqId]: false }));
    }
  };

  const handleUpvoteAnswer = async (rtqId, answerId) => {
    if (answerId.startsWith('temp-')) return;
    const rtq = rtqs.find(r => r._id === rtqId);
    const ans = rtq?.answers?.find(a => a._id === answerId);
    if (!rtq || !ans) return;
    const hasUpvoted = ans.upvotedBy?.some(id => id === user?._id || id._id === user?._id);
    setRtqs(prev => prev.map(r => {
      if (r._id !== rtqId) return r;
      return {
        ...r,
        answers: r.answers.map(a => {
          if (a._id !== answerId) return a;
          return {
            ...a,
            upvotes: hasUpvoted ? a.upvotes - 1 : a.upvotes + 1,
            upvotedBy: hasUpvoted
              ? a.upvotedBy.filter(id => id !== user?._id && id._id !== user?._id)
              : [...(a.upvotedBy || []), user?._id],
          };
        }),
      };
    }));
    try {
      await rtqService.upvoteAnswer(answerId);
    } catch (err) {
      loadRTQs();
    }
  };

  const filtered = rtqs.filter(r => {
    const matchSearch = !search || r.question.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filter || (
      filter === 'unresolved' ? r.status === 'open' && !r.isAccepted :
      filter === 'resolved' ? r.status === 'resolved' || r.isAccepted :
      filter === 'partial' ? r.answers?.length > 0 && !r.isAccepted : true
    );
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Raise to Clarify (RTQ)</h1>
          <p className="text-muted text-sm mt-1">Questions pending clarification</p>
        </div>
        <Link to="/raise-question" className="btn-primary">+ Ask a Question</Link>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search RTQs..."
          className="input flex-1"
        />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input w-auto">
          <option value="">All</option>
          <option value="unresolved">Unresolved</option>
          <option value="resolved">Resolved</option>
          <option value="partial">Has Answers</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted">Loading RTQs...</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(rtq => {
            const isExpanded = expandedId === rtq._id;
            return (
              <div key={rtq._id} className="card p-5">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-1">
                      <h3 className="font-semibold text-primary">{rtq.question}</h3>
                      {rtq.isAccepted && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">Resolved</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted mb-3">
                      <span>{rtq.category}</span>
                      <span>•</span>
                      <span>{rtq.answers?.length || 0} answers</span>
                      <span>•</span>
                      <span>By {rtq.postedBy?.name}</span>
                      <span>•</span>
                      <span>{timeAgo(rtq.createdAt)}</span>
                    </div>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : rtq._id)}
                      className="text-sm text-primary font-medium hover:underline"
                    >
                      {isExpanded ? 'Hide answers ↑' : `${rtq.answers?.length || 0} answers ↓`}
                    </button>

                    {isExpanded && (
                      <div className="mt-4 space-y-4">
                        {rtq.answers?.map(ans => (
                          <div key={ans._id} className="pl-4 border-l-2 border-border">
                            <p className="text-sm text-primary mb-2">{ans.answer}</p>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleUpvoteAnswer(rtq._id, ans._id)}
                                className={`text-xs px-2 py-1 rounded border ${ans.upvotedBy?.some(id => id === user?._id || id._id === user?._id)
                                  ? 'bg-primary text-white border-primary'
                                  : 'border-border text-muted hover:border-primary'}`}
                              >
                                ↑ {ans.upvotes}
                              </button>
                              <span className="text-xs text-muted">{ans.userId?.name || 'Unknown'}</span>
                              {ans.isApproved && <span className="text-xs text-green-600 font-medium">✓ Approved</span>}
                            </div>
                          </div>
                        ))}

                        {user && (
                          <div className="mt-4 flex gap-2">
                            <textarea
                              value={answerForms[rtq._id] || ''}
                              onChange={e => setAnswerForms(prev => ({ ...prev, [rtq._id]: e.target.value }))}
                              placeholder="Write your answer..."
                              className="input flex-1 resize-none"
                              rows={3}
                            />
                            <button
                              onClick={() => handleSubmitAnswer(rtq._id)}
                              disabled={answerLoading[rtq._id] || !answerForms[rtq._id]?.trim()}
                              className="btn-primary self-end"
                            >
                              {answerLoading[rtq._id] ? '...' : 'Submit'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted">No RTQs found.</div>
          )}
        </div>
      )}
    </div>
  );
}