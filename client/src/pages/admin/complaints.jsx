import React, { useState, useEffect } from 'react';
import { getAllComplaints } from '../../services/adminService';
import ComplaintTable from '../../components/ComplaintTable/ComplaintTable';
import ComplaintCard from '../../components/ComplaintCard/ComplaintCard';
import FilterBar from '../../components/FilterBar/FilterBar';
import LoadingState from '../../components/LoadingState/LoadingState';
import EmptyState from '../../components/EmptyState/EmptyState';
import { LayoutGrid, List, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

export const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // default table for admin
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    priority: 'all',
    department: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await getAllComplaints(filters);
      setComplaints(res.data.complaints || []);
      setPagination(res.data.pagination || { page: 1, limit: 12, total: 0, pages: 1 });
    } catch (error) {
      console.error('Error fetching admin complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      status: 'all',
      priority: 'all',
      department: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={24} className="text-purple-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">Complaint Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review, route, prioritize, and resolve complaints submitted across all departments
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/80 p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-600/30 text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-600/30 text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar with Department Dropdown */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        showDepartment={true}
      />

      {/* Content */}
      {loading ? (
        <LoadingState message="Loading administrative complaints..." />
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description="There are currently no complaints matching the selected search or filter criteria."
          actionText="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : viewMode === 'table' ? (
        <ComplaintTable
          complaints={complaints}
          isAdmin={true}
          onSort={(field) => {
            setFilters((prev) => ({
              ...prev,
              sortBy: field,
              sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
            }));
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complaints.map((c) => (
            <ComplaintCard key={c._id} complaint={c} isAdmin={true} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs text-slate-400">
          <span>
            Showing page <strong className="text-white">{pagination.page}</strong> of{' '}
            <strong className="text-white">{pagination.pages}</strong> ({pagination.total} total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintsPage;
