import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl z-10 text-center">
        <div
          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border mb-4 ${
            isDestructive
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
          }`}
        >
          <AlertTriangle size={24} />
        </div>

        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">{message}</p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-md ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                : 'gradient-brand'
            }`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
