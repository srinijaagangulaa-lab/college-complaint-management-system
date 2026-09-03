import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Upload,
  X,
} from 'lucide-react';

const CATEGORIES = [
  'Classroom',
  'Laboratory',
  'Library',
  'Hostel',
  'Transport',
  'Canteen',
  'Infrastructure',
  'Internet',
  'Other',
];

const PRIORITIES = [
  {
    value: 'low',
    label: 'Low',
    color: 'border-green-500/50 bg-green-500/10 text-green-400',
  },
  {
    value: 'medium',
    label: 'Medium',
    color: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
  },
  {
    value: 'high',
    label: 'High',
    color: 'border-orange-500/50 bg-orange-500/10 text-orange-400',
  },
  {
    value: 'critical',
    label: 'Critical',
    color: 'border-red-500/50 bg-red-500/10 text-red-400',
  },
];

const ComplaintForm = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  // IMPORTANT:
  // These names MUST match the backend field names.
  const [formData, setFormData] = useState({
    title: '',
    category: 'Classroom',
    priority: 'medium',
    location: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // ---------------------------------------------------------
  // HANDLE INPUT CHANGE
  // ---------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log('INPUT CHANGED:', name, value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // ---------------------------------------------------------
  // HANDLE FILE
  // ---------------------------------------------------------
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // 10 MB limit
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: 'File size must be less than 10MB',
      }));

      e.target.value = '';
      return;
    }

    setErrors((prev) => ({
      ...prev,
      file: '',
    }));

    setFile(selectedFile);

    // Image preview
    if (selectedFile.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }
  };

  // ---------------------------------------------------------
  // REMOVE FILE
  // ---------------------------------------------------------
  const handleRemoveFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    setFile(null);
    setFilePreview(null);
  };

  // ---------------------------------------------------------
  // VALIDATION
  // ---------------------------------------------------------
  const validate = () => {
    const newErrors = {};

    // VERY IMPORTANT:
    // Convert values to strings and trim them here.
    const title = String(formData.title || '').trim();
    const category = String(formData.category || '').trim();
    const location = String(formData.location || '').trim();
    const description = String(formData.description || '').trim();
    const priority = String(formData.priority || '').trim();

    console.log('========== VALIDATING FORM ==========');
    console.log('title:', title);
    console.log('category:', category);
    console.log('priority:', priority);
    console.log('location:', location);
    console.log('description:', description);
    console.log('=====================================');

    if (!title) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.length > 150) {
      newErrors.title = 'Title must not exceed 150 characters';
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    if (!priority) {
      newErrors.priority = 'Priority is required';
    }

    if (!location) {
      newErrors.location = 'Location is required';
    }

    if (!description) {
      newErrors.description = 'Description is required';
    } else if (description.length < 10) {
      newErrors.description =
        'Description must be at least 10 characters';
    } else if (description.length > 2000) {
      newErrors.description =
        'Description must not exceed 2000 characters';
    }

    setErrors(newErrors);

    console.log('VALIDATION ERRORS:', newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------------------------------------
  // SUBMIT
  // ---------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('========== SUBMIT CLICKED ==========');
    console.log('Current formData:', formData);

    // Validate using current state
    if (!validate()) {
      console.log('FORM VALIDATION FAILED');
      return;
    }

    console.log('FORM VALIDATION PASSED');

    const data = new FormData();

    // IMPORTANT:
    // These EXACT names must match backend.
    data.append('title', String(formData.title).trim());
    data.append('category', String(formData.category).trim());
    data.append('priority', String(formData.priority).trim());
    data.append('location', String(formData.location).trim());
    data.append('description', String(formData.description).trim());

    if (file) {
      data.append('attachment', file);
    }

    console.log('========== FORMDATA ==========');

    for (const [key, value] of data.entries()) {
      console.log(
        key,
        value instanceof File ? value.name : value
      );
    }

    console.log('==============================');

    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ERROR MESSAGE */}
      {Object.keys(errors).length > 0 && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4">
          <div className="flex items-center gap-3 text-rose-400">
            <AlertCircle size={20} />

            <div>
              <p className="font-semibold">
                {errors.title ||
                  errors.category ||
                  errors.location ||
                  errors.description ||
                  errors.priority ||
                  errors.file ||
                  'Please correct the errors below'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* TITLE */}
      {/* -------------------------------------------------- */}

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Complaint Title{' '}
          <span className="text-rose-400">*</span>
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Wi-Fi disconnected on 3rd floor Lab B"
          className="w-full glass-input"
          maxLength={150}
        />

        {errors.title && (
          <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.title}
          </p>
        )}
      </div>

      {/* -------------------------------------------------- */}
      {/* CATEGORY + PRIORITY */}
      {/* -------------------------------------------------- */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* CATEGORY */}

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Category{' '}
            <span className="text-rose-400">*</span>
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full glass-input"
          >
            {CATEGORIES.map((cat) => (
              <option
                key={cat}
                value={cat}
                className="bg-slate-900 text-white"
              >
                {cat}
              </option>
            ))}
          </select>

          {errors.category && (
            <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.category}
            </p>
          )}
        </div>

        {/* PRIORITY */}

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Priority Level{' '}
            <span className="text-rose-400">*</span>
          </label>

          <div className="grid grid-cols-4 gap-2">
            {PRIORITIES.map((p) => {
              const isSelected =
                formData.priority === p.value;

              return (
                <button
                  type="button"
                  key={p.value}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      priority: p.value,
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      priority: '',
                    }));
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold uppercase tracking-wider border text-center transition-all ${isSelected
                    ? `${p.color} ring-2 ring-indigo-500/50 shadow-md`
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {errors.priority && (
            <p className="mt-1.5 text-xs text-rose-400">
              {errors.priority}
            </p>
          )}
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* LOCATION */}
      {/* -------------------------------------------------- */}

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Specific Location / Room{' '}
          <span className="text-rose-400">*</span>
        </label>

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Block C, Room 204, East Wing"
          className="w-full glass-input"
        />

        {errors.location && (
          <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.location}
          </p>
        )}
      </div>

      {/* -------------------------------------------------- */}
      {/* DESCRIPTION */}
      {/* -------------------------------------------------- */}

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Detailed Description{' '}
          <span className="text-rose-400">*</span>
        </label>

        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Please explain the issue in detail, how long it has been occurring, and any impact..."
          className="w-full glass-input"
          maxLength={2000}
        />

        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Minimum 10 characters
          </span>

          <span>
            {formData.description.length} characters
          </span>
        </div>

        {errors.description && (
          <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.description}
          </p>
        )}
      </div>

      {/* -------------------------------------------------- */}
      {/* ATTACHMENT */}
      {/* -------------------------------------------------- */}

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Attachment (Optional Image or Document)
        </label>

        {!file ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 bg-slate-900/40 cursor-pointer transition-all">
            <Upload
              size={28}
              className="text-indigo-400 mb-2"
            />

            <p className="text-xs font-semibold text-slate-200">
              Click to upload an image or document
            </p>

            <p className="text-[11px] text-slate-500 mt-1">
              PNG, JPG, WEBP, PDF up to 10MB
            </p>

            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx,.txt"
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/80">
            <div className="flex items-center gap-3">

              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="h-12 w-12 rounded-lg object-cover border border-slate-700"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
                  <FileText size={24} />
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-white truncate max-w-xs">
                  {file.name}
                </p>

                <p className="text-[11px] text-slate-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {errors.file && (
          <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.file}
          </p>
        )}
      </div>

      {/* -------------------------------------------------- */}
      {/* BUTTONS */}
      {/* -------------------------------------------------- */}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl gradient-brand text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />

              <span>
                Submitting...
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />

              <span>
                Submit Complaint
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ComplaintForm;