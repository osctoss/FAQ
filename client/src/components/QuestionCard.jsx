import { useState } from 'react';
import { MessageCircle, TrendingUp, AlertCircle, Check } from 'lucide-react';
import { cn, timeAgo } from '../utils/helpers';
import UpvoteButton from './UpvoteButton';

export default function QuestionCard({ question, onUpvote, showAnswers = false, children }) {
  const hasUpvoted = question.upvotedBy?.includes('currentUser');

  return (
    <div className="card card-hover p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {question.isTrending && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" /> Trending
              </span>
            )}
            {question.markedForReview && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3" /> Review
              </span>
            )}
            {question.isAccepted && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3" /> Accepted
              </span>
            )}
            <span className="text-xs text-muted">{timeAgo(question.createdAt)}</span>
          </div>
          <h3 className="font-medium text-primary leading-snug">{question.question}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {question.category}
            </span>
            {question.tags?.map(tag => (
              <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <UpvoteButton
          upvotes={question.upvotes}
          onUpvote={onUpvote}
          hasUpvoted={hasUpvoted}
        />
      </div>
      {children && <div className="border-t border-border pt-3">{children}</div>}
    </div>
  );
}