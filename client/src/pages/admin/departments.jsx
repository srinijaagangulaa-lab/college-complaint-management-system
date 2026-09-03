import React, { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment } from '../../services/departmentService';
import LoadingState from '../../components/LoadingState/LoadingState';
import { Building2, Plus, Edit2, CheckCircle2, X, AlertCircle } from 'lucide-react';

export const AdminDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', departmentCode: '', description: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await getDepartments();
      setDepartments(res.data.departments || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openCreateModal = () => {
    setEditingDept(null);
    setFormData({ name: '', departmentCode: '', description: '' });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      departmentCode: dept.departmentCode,
      description: dept.description || '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingDept) {
        await updateDepartment(editingDept._id, formData);
      } else {
        await createDepartment(formData);
      }
      setIsModalOpen(false);
      await fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save department');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (dept) => {
    try {
      await updateDepartment(dept._id, { active: !dept.active });
      await fetchDepartments();
    } catch (err) {
      console.error('Error toggling department active status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 size={24} className="text-purple-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">Department Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure college departments and responsible routing teams
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 rounded-xl gradient-brand px-4 py-2 text-xs font-semibold"
        >
          <Plus size={15} />
          <span>Add New Department</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState message="Loading college departments..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 glass-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-mono text-xs font-bold text-purple-400">
                    {dept.departmentCode}
                  </span>
                  <button
                    onClick={() => toggleActive(dept)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${
                      dept.active
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {dept.active ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-semibold text-white">{dept.name}</h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {dept.description || 'No specific description provided.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
                <span className="text-slate-500">
                  {dept.staffMembers?.length || 0} Staff Assigned
                </span>
                <button
                  onClick={() => openEditModal(dept)}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white">
                {editingDept ? 'Edit Department' : 'Create Department'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Department Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Computer Center & Labs"
                  className="w-full glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Department Code <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={formData.departmentCode}
                  onChange={(e) => setFormData({ ...formData, departmentCode: e.target.value })}
                  placeholder="e.g., CCL"
                  className="w-full glass-input text-xs uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Responsibilities and campus coverage..."
                  className="w-full glass-input text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl gradient-brand text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 size={14} />
                  <span>{submitting ? 'Saving...' : 'Save Department'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartmentsPage;
