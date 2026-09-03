import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyComplaints } from '../../services/complaintService';

import ComplaintCard from '../../components/ComplaintCard/ComplaintCard';
import ComplaintTable from '../../components/ComplaintTable/ComplaintTable';
import FilterBar from '../../components/FilterBar/FilterBar';
import LoadingState from '../../components/LoadingState/LoadingState';
import EmptyState from '../../components/EmptyState/EmptyState';

import {
  PlusCircle,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const DEFAULT_FILTERS = {
  search: '',
  category: 'all',
  status: 'all',
  priority: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
};

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 9,
  total: 0,
  pages: 1,
};

export const ComplaintsListPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // ---------------------------------------------------------
  // FETCH MY COMPLAINTS
  // ---------------------------------------------------------
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('========================================');
      console.log('FETCHING MY COMPLAINTS');
      console.log('FILTERS:', filters);
      console.log('========================================');

      const response = await getMyComplaints(filters);

      console.log('RAW COMPLAINT RESPONSE:', response);

      /*
       * Backend may return either:
       *
       * {
       *   data: {
       *     complaints: [],
       *     pagination: {}
       *   }
       * }
       *
       * OR:
       *
       * {
       *   complaints: [],
       *   pagination: {}
       * }
       *
       * Handle both formats.
       */

      const responseData = response?.data || response || {};

      const complaintsData = Array.isArray(responseData?.complaints)
        ? responseData.complaints
        : [];

      const paginationData = responseData?.pagination || DEFAULT_PAGINATION;

      console.log('COMPLAINTS RECEIVED:', complaintsData);
      console.log('COMPLAINT COUNT:', complaintsData.length);
      console.log('PAGINATION:', paginationData);

      setComplaints(complaintsData);

      setPagination({
        page: Number(paginationData.page) || 1,
        limit: Number(paginationData.limit) || 9,
        total: Number(paginationData.total) || complaintsData.length,
        pages: Number(paginationData.pages) || 1,
      });
    } catch (err) {
      console.error('========================================');
      console.error('ERROR FETCHING COMPLAINTS');
      console.error(err);
      console.error('========================================');

      setComplaints([]);
      setPagination(DEFAULT_PAGINATION);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load your complaints.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // FETCH WHEN FILTERS CHANGE
  // ---------------------------------------------------------
  useEffect(() => {
    fetchComplaints();
  }, [
    filters.search,
    filters.category,
    filters.status,
    filters.priority,
    filters.sortBy,
    filters.sortOrder,
    filters.page,
  ]);

  // ---------------------------------------------------------
  // FILTER CHANGE
  // ---------------------------------------------------------
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  // ---------------------------------------------------------
  // RESET FILTERS
  // ---------------------------------------------------------
  const handleResetFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
    });
  };

  // ---------------------------------------------------------
  // PAGE CHANGE
  // ---------------------------------------------------------
  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= pagination.pages
    ) {
      setFilters((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  // ---------------------------------------------------------
  // SORT
  // ---------------------------------------------------------
  const handleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === 'asc'
          ? 'desc'
          : 'asc',
      page: 1,
    }));
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            My Complaints History
          </h1>

          <p className="text-xs text-slate-400">
            View, search, and track all complaints you have submitted
            to college administration
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* VIEW TOGGLE */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/80 p-1">

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'grid'
                  ? 'bg-indigo-600/30 text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
                }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>

            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'table'
                  ? 'bg-indigo-600/30 text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
                }`}
              title="Table View"
            >
              <List size={16} />
            </button>

          </div>

          {/* NEW COMPLAINT */}
          <Link
            to="/complaints/new"
            className="inline-flex items-center gap-1.5 rounded-xl gradient-brand px-4 py-2 text-xs font-semibold"
          >
            <PlusCircle size={15} />
            <span>New Complaint</span>
          </Link>

        </div>
      </div>

      {/* FILTER BAR */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* ERROR */}
      {error && !loading && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4">
          <p className="text-sm font-semibold text-rose-400">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchComplaints}
            className="mt-3 rounded-lg bg-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/30"
          >
            Try Again
          </button>
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <LoadingState message="Loading your submitted complaints..." />
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description={
            error
              ? 'There was a problem loading your complaints.'
              : 'No complaints match your search or filter options. Try resetting filters or submit a new ticket.'
          }
          actionText="Submit New Complaint"
          actionLink="/complaints/new"
        />
      ) : viewMode === 'grid' ? (

        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complaints.map((complaint, index) => (
            <ComplaintCard
              key={
                complaint._id ||
                complaint.complaintId ||
                `complaint-${index}`
              }
              complaint={complaint}
            />
          ))}
        </div>

      ) : (

        /* TABLE VIEW */
        <ComplaintTable
          complaints={complaints}
          isAdmin={false}
          currentSort={filters}
          onSort={handleSort}
        />

      )}

      {/* PAGINATION */}
      {!loading && pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs text-slate-400">

          <span>
            Showing page{' '}
            <strong className="text-white">
              {pagination.page}
            </strong>{' '}
            of{' '}
            <strong className="text-white">
              {pagination.pages}
            </strong>{' '}
            ({pagination.total} total)
          </span>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                handlePageChange(pagination.page - 1)
              }
              disabled={pagination.page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handlePageChange(pagination.page + 1)
              }
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

export default ComplaintsListPage;