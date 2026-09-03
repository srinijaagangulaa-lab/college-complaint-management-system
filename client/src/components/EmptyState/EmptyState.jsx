import React from 'react';
import { Inbox, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No complaints found',
  description = 'There are currently no items matching your criteria.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3.5">
        <Icon size={28} />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-400 leading-relaxed">{description}</p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl gradient-brand px-4 py-2 text-xs font-semibold"
        >
          <PlusCircle size={15} />
          <span>{actionText}</span>
        </Link>
      )}

      {actionText && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl gradient-brand px-4 py-2 text-xs font-semibold"
        >
          <PlusCircle size={15} />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
