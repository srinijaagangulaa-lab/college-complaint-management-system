import React from 'react';

export const MetricCard = ({ title, value, icon: Icon, color = 'indigo', subtitle, onClick }) => {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:border-indigo-500/40',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:border-blue-500/40',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:border-purple-500/40',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:border-amber-500/40',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/40',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20 group-hover:border-rose-500/40',
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20 group-hover:border-slate-500/40',
  };

  const bgClasses = colorMap[color] || colorMap.indigo;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border p-5 glass-card transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${bgClasses}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
