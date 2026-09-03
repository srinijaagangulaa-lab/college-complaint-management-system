# College Complaint Management System (CCMS)

A full-stack, enterprise-grade web-based **College Complaint Management System (CCMS)** designed to digitally streamline the submission, assignment, tracking, and resolution of campus facility issues.

---

## 🌟 Key Features

- **Role-Based Access Control (RBAC)**: Secure access tailored for **Students** and **Administrators**.
- **Comprehensive Complaint Lifecycle**:
  $$\text{Submitted} \rightarrow \text{Under Review} \rightarrow \text{Assigned} \rightarrow \text{In Progress} \rightarrow \text{Resolved} \rightarrow \text{Closed}$$
- **Multi-Department Routing**: Automated and manual assignment to 10 college departments (IT Support, Hostel Management, Maintenance, Transport, Housekeeping, Laboratory, Library, Electrical/Water Maintenance, etc.).
- **Interactive Timeline & Audit Trail**: Chronological activity tracker logging all status changes, administrative remarks, and resolution notes.
- **Real-Time Updates**: Instant Socket.IO live notifications for status transitions, assignments, and comments without full page refreshes.
- **Administrative Analytics**: Real-time KPI metrics, category breakdowns, priority matrices, and department workload distribution.
- **Attachment Support**: Upload images and documents supporting issue verification.
- **Search & Advanced Filtering**: Filter by keyword, category, status, priority, department, staff, and date ranges.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router v6, Socket.IO Client |
| **Backend** | Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs, express-validator, Multer, Helmet, Morgan, CORS, Socket.IO |
| **Database** | MongoDB & Mongoose (with automated fallback for zero-config testing) |

---

## 📋 Prerequisites

Before running the project locally, ensure you have:
1. **Node.js**: `v18.0.0` or higher (recommended: Node.js LTS)
2. **NPM**: `v9.0.0` or higher
3. **MongoDB**: Local MongoDB instance running on `mongodb://localhost:27017` or MongoDB Atlas URI (Note: The server includes an automated fallback for seamless testing even if local MongoDB service is not started).

---

## 🚀 Step-by-Step Local Setup Guide

### 1. Clone or Open the Repository
Navigate to the project root directory:
```bash
cd project4
```

---

### 2. Backend Setup (`server/`)

1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in `server/` (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   *Default `.env` configuration:*
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/ccms
   JWT_SECRET=ccms_super_secret_jwt_key_college_management_portal_2026
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

4. Seed the Database:
   Populate initial admin accounts, sample student accounts, departments, and realistic sample complaints:
   ```bash
   npm run seed
   ```

5. Start the Backend Server:
   ```bash
   npm run dev
   ```
   Backend API will start at: `http://localhost:5000`  
   Health endpoint: `http://localhost:5000/api/health`

---

### 3. Frontend Setup (`client/`)

1. Open a second terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Frontend Development Server:
   ```bash
   npm run dev
   ```
   Frontend will open at: `http://localhost:5173`

---

## 🔑 Default Demo Credentials

You can use the convenient **One-Click Demo Login** buttons on the login page or enter the credentials below:

### 🛡️ Administrator Account
- **Email**: `admin@college.edu`
- **Password**: `Admin@123`
- **Role**: `admin` (Full administrative privileges, department routing, resolution, metrics)

### 🎓 Student Account
- **Email**: `student@college.edu`
- **Password**: `Student@123`
- **Role**: `student` (Complaint submission, tracking, notification center)

---

## 📡 API Endpoint Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new student account
- `POST /api/auth/login` - Authenticate student or admin
- `GET /api/auth/me` - Get current authenticated user profile
- `POST /api/auth/logout` - Sign out

### 📝 Student Complaints (`/api/complaints`)
- `GET /api/complaints/my` - List student's own submitted complaints
- `POST /api/complaints` - Submit a new complaint (with optional file attachment)
- `GET /api/complaints/:id` - View complaint details & status
- `GET /api/complaints/:id/history` - View complaint audit timeline

### 🏢 Admin Management (`/api/admin/complaints`)
- `GET /api/admin/complaints` - List all complaints (with filters, search & pagination)
- `GET /api/admin/complaints/:id` - Inspect complaint details & comments
- `PUT /api/admin/complaints/:id` - Update priority or status
- `POST /api/admin/complaints/:id/assign` - Assign to department & staff
- `POST /api/admin/complaints/:id/comments` - Add administrative progress remarks
- `POST /api/admin/complaints/:id/resolve` - Record official resolution details
- `POST /api/admin/complaints/:id/close` - Finalize and close complaint
- `DELETE /api/admin/complaints/:id` - Archive or delete complaint

### 📊 Dashboard & Metrics (`/api/dashboard`)
- `GET /api/dashboard/student` - Student complaint KPIs
- `GET /api/dashboard/admin` - Comprehensive campus analytics & breakdown

### 🏛️ Departments (`/api/departments`)
- `GET /api/departments` - List active college departments
- `POST /api/departments` - Create new department (Admin)
- `PUT /api/departments/:id` - Update department information (Admin)

### 🔔 Notifications (`/api/notifications`)
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark single notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

### 🩺 System Health
- `GET /api/health` - Health check status & database connection state

---

## 🧪 Running Automated Tests

Run the test suite from the `server/` directory:
```bash
cd server
npm test
```

---

## 📂 Project Architecture

```
project4/
├── client/                     # Frontend Single Page Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # Reusable UI components (AppShell, Navbar, Sidebar, Badges, etc.)
│   │   ├── pages/              # Views (Landing, Login, Register, Dashboard, Complaints, Admin)
│   │   ├── services/           # Axios API service integrations
│   │   ├── store/              # Auth & Socket.IO React Context state
│   │   ├── styles/             # Tailwind & Design tokens
│   │   └── utils/              # Constants & helper utilities
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Layered REST API (Express + Mongoose + Socket.IO)
│   ├── src/
│   │   ├── config/             # Environment & Database connections
│   │   ├── controllers/        # Thin HTTP request parsers
│   │   ├── middleware/         # Auth, Role, Validation, Upload, Error handling
│   │   ├── models/             # Mongoose schemas (User, Complaint, History, Department, etc.)
│   │   ├── routes/             # Express route definitions
│   │   ├── services/           # Business logic & status transitions
│   │   ├── utils/              # Seeding, ID generator, Socket emitters
│   │   ├── validators/         # express-validator schemas
│   │   ├── app.js              # Express application setup
│   │   └── server.js           # Server & Socket.IO listener
│   ├── tests/                  # Integration tests
│   └── package.json
│
├── specs.md                    # Core project specifications
├── package.json                # Root convenience scripts
└── README.md                   # Local setup documentation
```

---

## 📄 License
ISC License. Built for College Complaint Management System (CCMS).
