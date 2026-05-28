import { useState } from 'react';
import { ArrowBigUp } from 'lucide-react';
import { cn } from '../utils/helpers';

export default function UpvoteButton({ upvotes, onUpvote, hasUpvoted }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || hasUpvoted) return;
    setLoading(true);
    try {
      await onUpvote();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={hasUpvoted || loading}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
        hasUpvoted
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-surface text-muted border border-border hover:bg-slate-100 hover:text-primary'
      )}
    >
      <ArrowBigUp className={cn('w-4 h-4', hasUpvoted && 'fill-green-600')} />
      <span>{upvotes || 0}</span>
    </button>
  );
}