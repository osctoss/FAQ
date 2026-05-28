import { formatQP } from '../utils/helpers';

export default function QPBadge({ qp, size = 'md' }) {
  const isPositive = qp >= 0;
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-lg px-2 py-0.5 ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      } ${
        isPositive
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-600'
      }`}
    >
      {formatQP(qp)} QP
    </span>
  );
}