import React from 'react';
import { PRIORITIES } from '../../utils/constants';
import { AlertCircle, AlertTriangle, Flame, Info } from 'lucide-react';

const ICONS = {
  low: Info,
  medium: AlertCircle,
  high: AlertTriangle,
  critical: Flame,
};

export const PriorityBadge = ({ priority, size = 'md' }) => {
  const currentPriority = PRIORITIES.find((p) => p.value === priority?.toLowerCase()) || {
    label: priority || 'Medium',
    color: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const IconComponent = ICONS[priority?.toLowerCase()] || AlertCircle;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-0.5 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1 gap-1.5',
  };

  const iconSizes = {
    sm: 11,
    md: 13,
    lg: 15,
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium uppercase tracking-wider ${currentPriority.color} ${sizeClasses[size] || sizeClasses.md}`}
    >
      <IconComponent size={iconSizes[size] || 13} className="shrink-0" />
      {currentPriority.label}
    </span>
  );
};

export default PriorityBadge;
