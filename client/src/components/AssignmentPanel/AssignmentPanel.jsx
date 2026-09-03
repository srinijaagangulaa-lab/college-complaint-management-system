import React, { useState, useEffect } from 'react';
import { getDepartments } from '../../services/departmentService';
import { DEPARTMENTS } from '../../utils/constants';
import { Building, User, X, CheckCircle2, AlertCircle } from 'lucide-react';

export const AssignmentPanel = ({
  isOpen,
  onClose,
  onAssign,
  currentDepartment,
  currentStaffId,
  loading = false,
}) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(currentDepartment || '');
  const [selectedStaffId, setSelectedStaffId] = useState(currentStaffId || '');
  const [staffOptions, setStaffOptions] = useState([]);

  useEffect(() => {
    const fetchDeptList = async () => {
      try {
        const res = await getDepartments();
        if (res.data?.departments?.length > 0) {
          setDepartments(res.data.departments);
        } else {
          setDepartments(DEPARTMENTS.map((d) => ({ name: d, departmentCode: d.substring(0, 3).toUpperCase(), staffMembers: [] })));
        }
      } catch (err) {
        setDepartments(DEPARTMENTS.map((d) => ({ name: d, departmentCode: d.substring(0, 3).toUpperCase(), staffMembers: [] })));
      }
    };

    if (isOpen) {
      setSelectedDept(currentDepartment || '');
      setSelectedStaffId(currentStaffId || '');
      fetchDeptList();
    }
  }, [isOpen, currentDepartment, currentStaffId]);

  useEffect(() => {
    const deptObj = departments.find((d) => d.name === selectedDept);
    if (deptObj && deptObj.staffMembers && deptObj.staffMembers.length > 0) {
      setStaffOptions(deptObj.staffMembers);
    } else {
      setStaffOptions([]);
    }
  }, [selectedDept, departments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDept) return;
    onAssign({
      department: selectedDept,
      staffId: selectedStaffId || null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Building className="text-indigo-400" size={20} />
            <h3 className="text-base font-semibold text-white">Assign Complaint</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Department Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Responsible Department <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full glass-input"
              required
            >
              <option value="" disabled className="bg-slate-900">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.name} value={dept.name} className="bg-slate-900">
                  {dept.name} ({dept.departmentCode || 'DEPT'})
                </option>
              ))}
            </select>
          </div>

          {/* Optional Staff Selection */}
          {staffOptions.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Assign Specific Staff Member
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full glass-input"
              >
                <option value="" className="bg-slate-900">Department Pool (Unassigned Staff)</option>
                {staffOptions.map((staff) => (
                  <option key={staff._id} value={staff._id} className="bg-slate-900">
                    {staff.name} ({staff.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
            <p>
              Assigning this complaint will automatically update its status to{' '}
              <strong className="text-purple-400">Assigned</strong> and notify the student.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedDept}
              className="px-5 py-2 rounded-xl gradient-brand text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 size={14} />
              <span>{loading ? 'Assigning...' : 'Confirm Assignment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentPanel;
