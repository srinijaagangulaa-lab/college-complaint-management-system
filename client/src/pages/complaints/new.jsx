import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  X,
  AlertCircle,
  FileText,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import api from '../../services/api';

const CATEGORIES = [
  'Classroom',
  'Laboratory',
  'Hostel',
  'Wi-Fi / Internet',
  'Infrastructure',
  'Transportation',
  'Cleanliness',
  'Library',
  'Electricity',
  'Water Supply',
  'Security',
  'Other',
];

const PRIORITIES = [
  { value: 'low', label: 'LOW' },
  { value: 'medium', label: 'MEDIUM' },
  { value: 'high', label: 'HIGH' },
  { value: 'critical', label: 'CRITICAL' },
];

const NewComplaint = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Classroom',
    priority: 'medium',
    location: '',
    description: '',
  });

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdComplaint, setCreatedComplaint] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }));

    setServerError('');
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setErrors((previous) => ({
      ...previous,
      file: '',
    }));

    // Maximum 10 MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        file: 'File size must be less than 10 MB.',
      }));
      return;
    }

    // Allowed types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setErrors((previous) => ({
        ...previous,
        file: 'Only images, PDF, DOC and DOCX files are allowed.',
      }));
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    setFile(null);
    setFilePreview(null);

    const input = document.getElementById('complaint-attachment');

    if (input) {
      input.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must contain at least 3 characters.';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description =
        'Description must contain at least 10 characters.';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('ccms_token');

      if (!token) {
        navigate('/login');
        return;
      }

      /*
       * IMPORTANT:
       * We use FormData because attachment upload is supported.
       */
      const data = new FormData();

      data.append('title', formData.title.trim());
      data.append('category', formData.category);
      data.append('priority', formData.priority);
      data.append('location', formData.location.trim());
      data.append('description', formData.description.trim());

      if (file) {
        data.append('attachment', file);
      }

      /*
       * IMPORTANT:
       * Use the configured Axios API instance.
       * It automatically uses:
       * https://college-complaint-backend-h286.onrender.com/api
       */
      const response = await api.post('/complaints', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const complaint =
        response?.data?.complaint ||
        response?.data?.data ||
        response?.data;

      setCreatedComplaint(complaint);
      setSuccess(true);

    } catch (error) {
      console.error('Complaint submission error:', error);

      if (error.response?.status === 401) {
        localStorage.removeItem('ccms_token');
        localStorage.removeItem('ccms_user');

        navigate('/login');
        return;
      }

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Unable to submit complaint. Please try again.';

      setServerError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/complaints');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle2
                size={36}
                className="text-emerald-400"
              />
            </div>

            <h1 className="text-3xl font-bold mb-3">
              Complaint Submitted Successfully
            </h1>

            <p className="text-slate-300 mb-6">
              Your complaint has been registered and is now available
              for tracking.
            </p>

            {createdComplaint?.complaintId && (
              <div className="mb-7 rounded-xl border border-slate-700 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400 mb-1">
                  Complaint ID
                </p>

                <p className="text-2xl font-bold text-indigo-400">
                  {createdComplaint.complaintId}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate('/complaints')}
                className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500 transition"
              >
                View My Complaints
              </button>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold hover:bg-slate-800 transition"
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={handleCancel}
            className="h-12 w-12 flex items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1 className="text-3xl font-bold">
              Submit New Complaint
            </h1>

            <p className="text-slate-400 mt-1">
              Provide complete details and location to help administration
              dispatch the right department.
            </p>
          </div>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-7 flex items-center gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 px-5 py-4 text-rose-300">
            <AlertCircle size={20} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-[#0d1424] p-7 md:p-10"
        >
          {/* Title */}
          <div className="mb-7">
            <label className="block text-sm font-semibold uppercase tracking-wide text-slate-300 mb-2">
              Complaint Title <span className="text-rose-400">*</span>
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Projector in classroom is not working"
              maxLength={150}
              className={`w-full rounded-xl border ${errors.title
                ? 'border-rose-500'
                : 'border-slate-700'
                } bg-[#111a2d] px-5 py-4 text-white outline-none transition focus:border-indigo-500`}
            />

            {errors.title && (
              <p className="mt-2 flex items-center gap-1 text-sm text-rose-400">
                <AlertCircle size={14} />
                {errors.title}
              </p>
            )}
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wide text-slate-300 mb-2">
                Category <span className="text-rose-400">*</span>
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-[#111a2d] px-5 py-4 text-white outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="bg-slate-900"
                  >
                    {category}
                  </option>
                ))}
              </select>

              {errors.category && (
                <p className="mt-2 text-sm text-rose-400">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wide text-slate-300 mb-2">
                Priority Level <span className="text-rose-400">*</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRIORITIES.map((priority) => {
                  const selected =
                    formData.priority === priority.value;

                  return (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() =>
                        setFormData((previous) => ({
                          ...previous,
                          priority: priority.value,
                        }))
                      }
                      className={`rounded-xl border px-3 py-3 text-xs font-bold transition ${selected
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                        : 'border-slate-700 bg-[#111a2d] text-slate-400 hover:border-slate-500'
                        }`}
                    >
                      {priority.label}
                    </button>
                  );
                })}
              </div>

              {errors.priority && (
                <p className="mt-2 text-sm text-rose-400">
                  {errors.priority}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="mb-7">
            <label className="block text-sm font-semibold uppercase tracking-wide text-slate-300 mb-2">
              Specific Location / Room{' '}
              <span className="text-rose-400">*</span>
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Block 3, Room 203, West Wing"
              className={`w-full rounded-xl border ${errors.location
                ? 'border-rose-500'
                : 'border-slate-700'
                } bg-[#111a2d] px-5 py-4 text-white outline-none focus:border-indigo-500`}
            />

            {errors.location && (
              <p className="mt-2 flex items-center gap-1 text-sm text-rose-400">
                <AlertCircle size={14} />
                {errors.location}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-7">
            <label className="block text-sm font-semibold uppercase tracking-wide text-slate-300 mb-2">
              Detailed Description{' '}
              <span className="text-rose-400">*</span>
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={7}
              maxLength={2000}
              placeholder="Explain the problem clearly..."
              className={`w-full resize-none rounded-xl border ${errors.description
                ? 'border-rose-500'
                : 'border-slate-700'
                } bg-[#111a2d] px-5 py-4 text-white outline-none focus:border-indigo-500`}
            />

            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>Minimum 10 characters</span>
              <span>
                {formData.description.length}/2000
              </span>
            </div>

            {errors.description && (
              <p className="mt-2 flex items-center gap-1 text-sm text-rose-400">
                <AlertCircle size={14} />
                {errors.description}
              </p>
            )}
          </div>

          {/* Attachment */}
          <div className="mb-8">
            <label className="block text-sm font-semibold uppercase tracking-wide text-slate-300 mb-2">
              Attachment{' '}
              <span className="text-slate-500">
                (Optional Image or Document)
              </span>
            </label>

            <input
              id="complaint-attachment"
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            {!file ? (
              <label
                htmlFor="complaint-attachment"
                className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-indigo-500/60 bg-indigo-500/5 hover:bg-indigo-500/10 transition"
              >
                <Upload
                  size={32}
                  className="mb-3 text-indigo-400"
                />

                <p className="font-semibold">
                  Click to upload an image or document
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Maximum file size: 10 MB
                </p>
              </label>
            ) : (
              <div className="rounded-xl border border-slate-700 bg-[#111a2d] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Attachment preview"
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-500/10">
                        <FileText
                          size={28}
                          className="text-indigo-400"
                        />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {file.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

            {errors.file && (
              <p className="mt-2 flex items-center gap-1 text-sm text-rose-400">
                <AlertCircle size={14} />
                {errors.file}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-slate-800 pt-7">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white hover:bg-indigo-500 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Submitting...
                </>
              ) : (
                <>
                  <Plus size={19} />
                  Submit Complaint
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaint;