import React from 'react';
import { CATEGORIES, PRIORITIES, STATUSES, DEPARTMENTS } from '../../utils/constants';
import { Search, RotateCcw, Filter } from 'lucide-react';

export const FilterBar = ({
  filters,
  onFilterChange,
  onReset,
  showDepartment = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 glass-card space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Search by ID, title, keyword or location..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filters.category || 'all'}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="bg-slate-950/80 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status || 'all'}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="bg-slate-950/80 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
        >
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority || 'all'}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          className="bg-slate-950/80 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
        >
          <option value="all">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label} Priority
            </option>
          ))}
        </select>

        {/* Department Filter (Admin) */}
        {showDepartment && (
          <select
            value={filters.department || 'all'}
            onChange={(e) => onFilterChange('department', e.target.value)}
            className="bg-slate-950/80 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset filters"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
