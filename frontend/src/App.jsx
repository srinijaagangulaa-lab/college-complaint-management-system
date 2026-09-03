import { useEffect, useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const complaintDefaults = {
  title: '',
  category: 'Classroom',
  description: '',
  location: '',
  priority: 'medium',
};

const categories = [
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

const statusOptions = [
  'submitted',
  'under_review',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
];

function App() {
  const [token, setToken] = useState(localStorage.getItem('ccms_token') || '');
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ccms_user') || 'null');
    } catch {
      return null;
    }
  });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [message, setMessage] = useState('');
  const [authForm, setAuthForm] = useState({
    name: '',
    email: 'admin@college.edu',
    password: 'Admin@123',
  });
  const [complaintForm, setComplaintForm] = useState(complaintDefaults);

  const stats = {
    total: complaints.length,
    submitted: complaints.filter((item) => item.status === 'submitted').length,
    underReview: complaints.filter((item) => item.status === 'under_review').length,
    inProgress: complaints.filter((item) => item.status === 'in_progress').length,
    resolved: complaints.filter((item) => item.status === 'resolved').length,
    closed: complaints.filter((item) => item.status === 'closed').length,
  };

  const fetchComplaints = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch complaints');

      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    if (!token) return;

    const getProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          logout();
          return;
        }

        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('ccms_user', JSON.stringify(userData));
      } catch (error) {
        logout();
      }
    };

    getProfile();
    fetchComplaints();
  }, [token]);

  const logout = () => {
    localStorage.removeItem('ccms_token');
    localStorage.removeItem('ccms_user');
    setToken('');
    setUser(null);
    setComplaints([]);
    setMessage('');
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
      const payload =
        authMode === 'login'
          ? { email: authForm.email, password: authForm.password }
          : {
              name: authForm.name,
              email: authForm.email,
              password: authForm.password,
            };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.errors?.[0]?.msg || 'Authentication failed');
      }

      localStorage.setItem('ccms_token', data.token);
      localStorage.setItem('ccms_user', JSON.stringify({ ...data, name: data.name || authForm.name }));
      setToken(data.token);
      setUser({ ...data, name: data.name || authForm.name });
      setMessage(authMode === 'login' ? 'Login successful.' : 'Registration successful.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(complaintForm),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.errors?.[0]?.msg || 'Complaint submission failed');
      }

      setComplaintForm(complaintDefaults);
      setMessage('Complaint submitted successfully.');
      fetchComplaints();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateComplaint = async (complaintId, updates) => {
    try {
      const response = await fetch(`${API_URL}/complaints/${complaintId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      setMessage('Complaint updated successfully.');
      fetchComplaints();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const addComment = async (complaintId, commentText, newStatus) => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`${API_URL}/complaints/${complaintId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: commentText,
          newStatus: newStatus || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Comment creation failed');
      }

      setMessage('Comment added successfully.');
      fetchComplaints();
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!user || !token) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="logo-block">
            <span className="logo-badge">CCMS</span>
            <h1>College Complaint Management System</h1>
            <p>Digital complaint tracking for students and administrators.</p>
          </div>

          <div className="auth-toggle">
            <button
              type="button"
              className={authMode === 'login' ? 'active' : ''}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === 'register' ? 'active' : ''}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="auth-form">
            {authMode === 'register' && (
              <label>
                Name
                <input
                  type="text"
                  value={authForm.name}
                  onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
                placeholder="student@college.edu"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={authForm.password}
                onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                placeholder="********"
                required
              />
            </label>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>

          {message && <div className="status-box">{message}</div>}

          <div className="demo-login-box">
            <strong>Demo admin</strong>
            <span>Email: admin@college.edu</span>
            <span>Password: Admin@123</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="brand">CCMS</span>
          <h2>College Complaint Management</h2>
        </div>
        <div className="user-area">
          <span>
            {user.name} ({user.role})
          </span>
          <button type="button" className="secondary-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {message && <div className="status-box">{message}</div>}

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-card">
          <span>Submitted</span>
          <strong>{stats.submitted}</strong>
        </div>
        <div className="stat-card">
          <span>Under review</span>
          <strong>{stats.underReview}</strong>
        </div>
        <div className="stat-card">
          <span>In progress</span>
          <strong>{stats.inProgress}</strong>
        </div>
        <div className="stat-card">
          <span>Resolved</span>
          <strong>{stats.resolved}</strong>
        </div>
        <div className="stat-card">
          <span>Closed</span>
          <strong>{stats.closed}</strong>
        </div>
      </section>

      {user.role === 'student' && (
        <section className="panel">
          <div className="panel-header">
            <h3>Submit a complaint</h3>
          </div>

          <form onSubmit={handleComplaintSubmit} className="complaint-form">
            <label>
              Title
              <input
                type="text"
                value={complaintForm.title}
                onChange={(event) => setComplaintForm({ ...complaintForm, title: event.target.value })}
                required
              />
            </label>

            <label>
              Category
              <select
                value={complaintForm.category}
                onChange={(event) => setComplaintForm({ ...complaintForm, category: event.target.value })}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Priority
              <select
                value={complaintForm.priority}
                onChange={(event) => setComplaintForm({ ...complaintForm, priority: event.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </label>

            <label>
              Location
              <input
                type="text"
                value={complaintForm.location}
                onChange={(event) => setComplaintForm({ ...complaintForm, location: event.target.value })}
                required
              />
            </label>

            <label className="full-width">
              Description
              <textarea
                rows="5"
                value={complaintForm.description}
                onChange={(event) => setComplaintForm({ ...complaintForm, description: event.target.value })}
                required
              />
            </label>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit complaint'}
            </button>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="panel-header">
          <h3>Complaint records</h3>
        </div>

        <div className="complaint-list">
          {complaints.length === 0 && <p>No complaints found yet.</p>}

          {complaints.map((complaint) => (
            <article key={complaint._id} className="complaint-card">
              <div className="complaint-head">
                <div>
                  <span className="id-tag">{complaint.complaintId}</span>
                  <h4>{complaint.title}</h4>
                </div>
                <span className={`priority-pill ${complaint.priority}`}>{complaint.priority}</span>
              </div>

              <div className="meta-grid">
                <span>Category: {complaint.category}</span>
                <span>Status: {complaint.status}</span>
                <span>Location: {complaint.location}</span>
                <span>Student: {complaint.student?.name || 'N/A'}</span>
              </div>

              <p className="description">{complaint.description}</p>

              {user.role === 'admin' && (
                <div className="admin-controls">
                  <select
                    value={complaint.status}
                    onChange={(event) => updateComplaint(complaint._id, { status: event.target.value })}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Department"
                    defaultValue={complaint.assignedDepartment || ''}
                    onBlur={(event) => updateComplaint(complaint._id, { assignedDepartment: event.target.value })}
                  />

                  <input
                    type="text"
                    placeholder="Assigned staff"
                    defaultValue={complaint.assignedStaff || ''}
                    onBlur={(event) => updateComplaint(complaint._id, { assignedStaff: event.target.value })}
                  />

                  <input
                    type="text"
                    placeholder="Resolution details"
                    defaultValue={complaint.resolutionDetails || ''}
                    onBlur={(event) => updateComplaint(complaint._id, { resolutionDetails: event.target.value })}
                  />
                </div>
              )}

              <div className="comment-box">
                <input
                  type="text"
                  placeholder="Add admin comment or status update"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      addComment(complaint._id, event.target.value, complaint.status);
                      event.target.value = '';
                    }
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
