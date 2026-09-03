export const CATEGORIES = [
  'Classroom',
  'Laboratory',
  'Hostel',
  'Wi-Fi/Internet',
  'Infrastructure',
  'Transportation',
  'Cleanliness',
  'Library',
  'Electricity',
  'Water/Sanitation',
  'Other',
];

export const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { value: 'high', label: 'High', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  { value: 'critical', label: 'Critical', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
];

export const STATUSES = [
  { value: 'submitted', label: 'Submitted', color: 'bg-slate-500/15 text-slate-300 border-slate-600/40', step: 1 },
  { value: 'under_review', label: 'Under Review', color: 'bg-blue-500/15 text-blue-400 border-blue-500/40', step: 2 },
  { value: 'assigned', label: 'Assigned', color: 'bg-purple-500/15 text-purple-400 border-purple-500/40', step: 3 },
  { value: 'in_progress', label: 'In Progress', color: 'bg-amber-500/15 text-amber-400 border-amber-500/40', step: 4 },
  { value: 'resolved', label: 'Resolved', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40', step: 5 },
  { value: 'closed', label: 'Closed', color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/40', step: 6 },
];

export const DEPARTMENTS = [
  'Administration',
  'IT Support',
  'Hostel Management',
  'Maintenance',
  'Transport',
  'Housekeeping/Cleanliness',
  'Laboratory',
  'Library',
  'Electrical/Water Maintenance',
  'Other',
];
