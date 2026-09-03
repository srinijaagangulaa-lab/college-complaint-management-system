import React from 'react';
import { STATUSES } from '../../utils/constants';
import { CheckCircle2, Clock, PlayCircle, UserCheck, ShieldAlert, XCircle, HelpCircle } from 'lucide-react';

const ICONS = {
  submitted: Clock,
  under_review: ShieldAlert,
  assigned: UserCheck,
  in_progress: PlayCircle,
  resolved: CheckCircle2,
  closed: XCircle,
};

export const StatusBadge = ({ status, size = 'md' }) => {
  const currentStatus = STATUSES.find((s) => s.value === status?.toLowerCase()) || {
    label: status || 'Unknown',
    color: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const IconComponent = ICONS[status?.toLowerCase()] || HelpCircle;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border capitalize tracking-wide ${currentStatus.color} ${sizeClasses[size] || sizeClasses.md}`}
    >
      <IconComponent size={iconSizes[size] || 14} className="shrink-0" />
      {currentStatus.label}
    </span>
  );
};

export default StatusBadge;
