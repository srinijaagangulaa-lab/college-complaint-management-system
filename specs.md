COMPLETE SPECIFICATION - COLLEGE COMPLAINT MANAGEMENT SYSTEM (CCMS)

1. PROJECT OVERVIEW

Build a full-stack web-based College Complaint Management System (CCMS) that allows students to digitally submit, track, and manage complaints related to college facilities and services.

The platform must replace the manual complaint process with a centralized complaint tracking system. Students can submit complaints with a category, description, location, priority, and optional image/file attachment. Administrators can review complaints, assign them to the appropriate department or staff member, update their status, add comments, and record resolution details.

The core complaint lifecycle is:

Student -> Submit Complaint -> Admin Reviews -> Assign Department/Staff
-> Complaint In Progress -> Issue Resolved -> Student Views Resolution -> Closed

The system should provide separate student and admin experiences, persistent complaint data storage, search/filter functionality, basic statistics, and a working deployed application.

2. TECH STACK

Frontend:
- React.js or Next.js
- Tailwind CSS
- Axios or Fetch API
- React Router when using React.js
- Lucide React or another icon library
- Responsive UI components

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- express-validator
- helmet
- morgan
- cors

Optional:
- Socket.IO for real-time complaint status updates
- Cloudinary or equivalent object storage for complaint attachments
- Nodemailer for email notifications
- PWA/mobile-responsive support

The implementation should keep the frontend and backend separated, use environment variables for secrets and configuration, and follow a clean controller-service-model architecture.

3. CORE FEATURES

3.1 Authentication

The authentication system must support:
- Student registration
- Student login
- Admin login
- JWT-based authentication
- Protected routes
- /auth/me profile endpoint
- Role separation between student and admin
- Password hashing with bcrypt
- Logout/session cleanup
- Authentication validation and error handling

Roles:
- student
- admin

3.2 Student Dashboard

The student dashboard must display:
- Total complaints submitted
- Submitted complaints
- Complaints under review
- Complaints in progress
- Resolved complaints
- Closed complaints
- Recent complaints
- Complaint status indicators
- Quick action to submit a new complaint

3.3 Complaint Submission

Students must be able to submit a complaint containing:
- Complaint title
- Complaint category
- Detailed description
- Location of the issue
- Priority
- Optional image/file attachment
- Submission date/time

Supported categories should include:
- Classroom
- Laboratory
- Hostel
- Wi-Fi/Internet
- Infrastructure
- Transportation
- Cleanliness
- Library
- Electricity
- Water/Sanitation
- Other

The system must validate required fields before accepting a complaint.

3.4 Complaint Categories

Every complaint must belong to a category so administrators can identify the responsible department.

The category must be stored with the complaint and available for filtering and reporting.

3.5 Complaint Priority

The system must support:
- Low
- Medium
- High
- Critical

Priority should be visible to administrators and used to help prioritize complaint handling.

3.6 Complaint Status Tracking

The official complaint status lifecycle is:

Submitted -> Under Review -> Assigned -> In Progress -> Resolved -> Closed

Status definitions:
- Submitted: Complaint has been successfully submitted by the student.
- Under Review: Admin has reviewed the complaint and is evaluating the issue.
- Assigned: Complaint has been assigned to a department or staff member.
- In Progress: Responsible staff/department is actively working on the issue.
- Resolved: The issue has been addressed and resolution details have been recorded.
- Closed: Complaint has been finalized and closed after resolution.

Only authorized users should be able to change complaint status.

3.7 Complaint History

Students must be able to view all complaints they previously submitted.

Complaint history should show:
- Complaint ID
- Title
- Category
- Priority
- Current status
- Submission date
- Last updated date

3.8 Complaint Details Page

The complaint details page must display:
- Complaint ID
- Title
- Category
- Description
- Location
- Attachment
- Priority
- Current status
- Assigned department
- Assigned staff
- Admin comments
- Resolution details
- Created date
- Updated date
- Complaint status timeline

3.9 Admin Dashboard

The admin dashboard must provide:
- Total complaints
- New complaints
- Complaints under review
- Assigned complaints
- Complaints in progress
- Resolved complaints
- Closed complaints
- High/critical priority complaints
- Recent complaint activity
- Basic complaint statistics

3.10 Admin Complaint Management

Admins must be able to:
- View all complaints
- Open complaint details
- Review complaint information
- Change complaint priority
- Assign department
- Assign responsible staff
- Add comments
- Update complaint status
- Add resolution details
- Search complaints
- Filter complaints
- Sort complaints
- Delete or archive complaints when authorized

3.11 Department/Staff Assignment

Admins must be able to assign each complaint to:
- A responsible department
- A responsible staff member

Suggested departments:
- Administration
- IT Support
- Hostel Management
- Maintenance
- Transport
- Housekeeping/Cleanliness
- Laboratory
- Library
- Electrical/Water Maintenance
- Other

Assignment information must be stored with the complaint.

3.12 Admin Comments and Updates

Admins/staff must be able to add progress comments to complaints.

Each update should store:
- Comment text
- Author
- Date/time
- Related complaint
- Optional status change

Students should be able to view appropriate complaint updates.

3.13 Resolution Details

When a complaint is resolved, the administrator must be able to record:
- Resolution description
- Resolved by
- Resolution date
- Supporting attachment, if applicable

A complaint should not be marked Resolved without appropriate resolution information.

3.14 Search and Filter

The system must support complaint search/filtering by:
- Complaint ID
- Title
- Category
- Status
- Priority
- Department
- Assigned staff
- Date range

Students should only be able to search/view their own complaints.

Admins should be able to search across complaints they are authorized to manage.

3.15 Complaint Statistics

The system must provide basic statistics such as:
- Total complaints
- Complaints by status
- Complaints by category
- Complaints by priority
- Complaints by department
- Resolved vs unresolved complaints

4. BONUS / OPTIONAL FEATURES

The following features are optional and should be implemented only after the core system is working:

- Email notifications
- Real-time status notifications
- Admin analytics dashboard
- Department-wise statistics
- Complaint resolution time tracking
- Student feedback after resolution
- Complaint resolution rating
- Duplicate complaint detection
- AI-based complaint categorization
- AI-generated complaint summaries
- Image-based issue classification
- Automatic escalation for unresolved complaints
- Mobile-responsive/PWA interface

5. AI-ASSISTED FEATURES (OPTIONAL)

If AI functionality is included, it should assist the complaint management process rather than replace the normal workflow.

Optional AI features:
- AI complaint category prediction
- AI priority suggestion
- AI-generated complaint summary
- Duplicate complaint detection
- AI-based department recommendation
- Image-based identification of visible infrastructure issues
- Automatic escalation recommendation

AI-generated decisions must be reviewable by an administrator before they are treated as final decisions.

6. DATABASE COLLECTIONS

6.1 Users

Stores authenticated users.

Fields:
- _id
- name
- email
- passwordHash
- role (student | admin)
- studentId (for students, when applicable)
- department
- phone
- lastLogin
- createdAt
- updatedAt

Passwords must never be stored in plain text.

6.2 Complaints

Stores all submitted complaints.

Fields:
- _id
- complaintId
- student reference
- title
- category
- description
- location
- attachment
- priority (low | medium | high | critical)
- status (submitted | under_review | assigned | in_progress | resolved | closed)
- assignedDepartment
- assignedStaff reference
- resolutionDetails
- resolvedBy reference
- resolvedAt
- closedAt
- createdAt
- updatedAt

6.3 ComplaintComments

Stores comments and progress updates.

Fields:
- _id
- complaint reference
- author reference
- comment
- previousStatus
- newStatus
- createdAt

6.4 Departments

Stores college departments responsible for complaints.

Fields:
- _id
- name
- description
- departmentCode
- active
- createdAt
- updatedAt

6.5 Notifications

Stores notification events.

Fields:
- _id
- user reference
- complaint reference
- type
- title
- message
- isRead
- createdAt

6.6 ComplaintHistory

Stores important complaint lifecycle changes for auditing.

Fields:
- _id
- complaint reference
- changedBy reference
- action
- previousStatus
- newStatus
- metadata
- createdAt

7. API ENDPOINTS

7.1 Health and Authentication

GET /api/health
- Provides backend service health information.

POST /api/auth/register
- Registers a new student account.
- Validates input.
- Prevents duplicate accounts.
- Hashes the password.
- Creates the user account.

POST /api/auth/login
- Authenticates a student or admin.
- Verifies credentials.
- Issues a JWT.
- Updates last login information.

GET /api/auth/me
- Returns the authenticated user's profile.
- Requires JWT authentication.

POST /api/auth/logout
- Clears client-side authentication state.
- Invalidates server-side session/token strategy when applicable.

7.2 Student Complaint APIs

GET /api/complaints/my
- Returns complaints submitted by the authenticated student.
- Supports filtering, sorting, and pagination.

POST /api/complaints
- Creates a new complaint.
- Validates complaint fields.
- Associates the complaint with the authenticated student.
- Sets the initial status to Submitted.

GET /api/complaints/:id
- Returns complaint details.
- Students can access only their own complaints.
- Admins can access authorized complaints.

GET /api/complaints/:id/history
- Returns the complaint status and activity history.

7.3 Admin Complaint APIs

GET /api/admin/complaints
- Lists complaints available to administrators.
- Supports search, filtering, sorting, and pagination.

GET /api/admin/complaints/:id
- Returns detailed complaint information.

PUT /api/admin/complaints/:id
- Updates complaint information.
- Supports priority, assignment, status, comments, and resolution updates.

POST /api/admin/complaints/:id/assign
- Assigns a complaint to a department and/or staff member.

POST /api/admin/complaints/:id/comments
- Adds an administrative progress comment.

POST /api/admin/complaints/:id/resolve
- Records resolution details.
- Changes status to Resolved.

POST /api/admin/complaints/:id/close
- Closes a resolved complaint.

DELETE /api/admin/complaints/:id
- Deletes or archives a complaint when authorized.

7.4 Dashboard APIs

GET /api/dashboard/student
- Returns student-specific complaint metrics.

GET /api/dashboard/admin
- Returns admin complaint metrics and statistics.

7.5 Department APIs

GET /api/departments
- Lists active departments.

POST /api/departments
- Creates a department for authorized administrators.

PUT /api/departments/:id
- Updates department information.

7.6 Notification APIs

GET /api/notifications
- Lists notifications for the authenticated user.

PUT /api/notifications/:id/read
- Marks a notification as read.

PUT /api/notifications/read-all
- Marks all available notifications as read.

8. FRONTEND PAGES

The frontend should provide the following pages:

/ 
- Landing page
- College Complaint Management System introduction
- Explanation of complaint tracking workflow
- Feature overview
- Login/Register CTA
- Responsive layout

/login
- Student/admin login
- Email/ID and password fields
- Validation
- Loading state
- Authentication error handling
- Redirect after successful login

/register
- Student registration
- Name
- Student ID
- Email
- Password
- Confirm password
- Department
- Validation
- Registration error handling

/dashboard
- Role-aware dashboard
- Student or admin metrics
- Recent complaints
- Status summaries
- Quick actions

/complaints/new
- Complaint submission form
- Category selection
- Description
- Location
- Priority
- Attachment upload
- Form validation
- Submit and cancel actions

/complaints
- Student complaint history
- Search/filter
- Status badges
- Complaint summary cards/table
- Pagination

/complaints/[id]
- Complaint details
- Complaint timeline
- Status
- Assignment information
- Comments
- Resolution details
- Attachment preview/download where applicable

/admin/complaints
- Admin complaint management
- Search
- Filters
- Sorting
- Pagination
- Priority indicators
- Status indicators
- Assignment controls

/admin/complaints/[id]
- Full admin complaint details
- Status management
- Department/staff assignment
- Comments
- Resolution details
- Complaint history

/admin/dashboard
- Complaint analytics
- Status statistics
- Category statistics
- Priority statistics
- Department statistics
- Recent complaint activity

/notifications
- User notifications
- Read/unread state
- Complaint-related alerts

/settings
- User profile
- Account information
- Notification preferences
- Password/security options
- Logout

9. BACKEND ARCHITECTURE

The backend should follow a layered architecture.

Routes layer:
- Defines HTTP routes.
- Applies authentication and role middleware.
- Applies request validation.

Controllers layer:
- Handles request parsing.
- Calls services.
- Shapes API responses.
- Must not directly access MongoDB.

Services layer:
- Owns business logic.
- Complaint creation
- Complaint retrieval
- Assignment
- Status transitions
- Comment handling
- Resolution processing
- Notification creation
- Dashboard statistics

Models layer:
- Defines Mongoose schemas.
- Users
- Complaints
- ComplaintComments
- Departments
- Notifications
- ComplaintHistory

Middleware layer:
- JWT authentication
- Role authorization
- Request validation
- Error handling
- File upload validation

Optional Real-Time layer:
- Socket.IO events for complaint status changes and notifications.

10. COMPLAINT STATUS RULES

The normal status transition should be:

Submitted
  -> Under Review
  -> Assigned
  -> In Progress
  -> Resolved
  -> Closed

Rules:
- New complaints start as Submitted.
- Admin review moves a complaint to Under Review.
- Assignment moves it to Assigned.
- Work beginning moves it to In Progress.
- A completed solution moves it to Resolved.
- Final confirmation moves it to Closed.
- Invalid status transitions should be rejected by the backend.
- Every status change should create a ComplaintHistory record.
- Every important status change should optionally create a notification.

11. ROLE AND PERMISSION REQUIREMENTS

Student:
- Register/login
- Submit complaints
- View own complaints
- View complaint status
- View complaint history
- View appropriate admin comments/updates
- View resolution details
- Receive notifications
- Provide feedback after resolution if the optional feature is enabled

Admin:
- Login
- View complaints
- Search/filter complaints
- Review complaints
- Assign department/staff
- Change priority
- Add comments
- Change status
- Record resolution
- Close complaints
- View statistics
- Manage departments
- Manage notifications

The backend must enforce these permissions. Hiding a frontend button is not sufficient for authorization.

12. UI AND UX REQUIREMENTS

The UI must use a clean, simple college administration dashboard aesthetic.

Requirements:
- Fully responsive design
- Student-friendly complaint submission form
- Admin dashboard with clear metrics
- Clear status badges
- Priority indicators
- Complaint timeline
- Search and filter controls
- Loading states
- Skeleton loaders where appropriate
- Empty states
- Success/error messages
- Form validation messages
- Confirmation dialogs for destructive actions
- Accessible buttons and form controls
- Mobile-friendly complaint submission and tracking

Suggested reusable components:
- AppShell
- Navbar
- Sidebar
- MetricCard
- ComplaintCard
- ComplaintTable
- StatusBadge
- PriorityBadge
- ComplaintForm
- ComplaintTimeline
- AssignmentPanel
- CommentBox
- FilterBar
- NotificationDrawer
- LoadingState
- EmptyState
- ConfirmationModal

13. SECURITY REQUIREMENTS

The application must:
- Hash passwords using bcrypt.
- Never store plaintext passwords.
- Sign and verify JWTs using JWT_SECRET.
- Store all secrets in environment variables.
- Use helmet for HTTP security headers.
- Configure CORS for the frontend origin.
- Validate request bodies using express-validator.
- Enforce role-based authorization on protected endpoints.
- Validate uploaded file type and size.
- Never expose password hashes through API responses.
- Never log passwords, JWT secrets, or sensitive credentials.
- Sanitize user-generated content where required.
- Prevent students from accessing other students' complaints.
- Prevent unauthorized users from changing complaint status or resolution data.
- Use secure production configuration.

14. VALIDATION REQUIREMENTS

Complaint title:
- Required
- Must have a reasonable length

Category:
- Required
- Must match a supported category

Description:
- Required
- Must contain sufficient detail

Location:
- Required

Priority:
- Required
- Must be Low, Medium, High, or Critical

Attachment:
- Optional
- File type and size must be validated

Status:
- Must be one of the supported statuses.

15. NOTIFICATION REQUIREMENTS

When enabled, notifications should be generated for events such as:
- Complaint submitted
- Complaint reviewed
- Complaint assigned
- Complaint status changed
- Admin comment added
- Complaint resolved
- Complaint closed
- Complaint escalated

Notifications should be associated with both the user and complaint.

16. OPTIONAL REAL-TIME REQUIREMENTS

If Socket.IO is implemented:
- Emit an event when a complaint is created.
- Emit an event when status changes.
- Emit an event when a complaint is assigned.
- Emit an event when an admin adds a comment.
- Emit an event when a complaint is resolved or closed.
- Update the student/admin interface without requiring a full page refresh.

17. FOLDER STRUCTURE

Frontend:

client/
  src/
    components/
      AppShell/
      Navbar/
      Sidebar/
      ComplaintForm/
      ComplaintCard/
      ComplaintTable/
      ComplaintTimeline/
      StatusBadge/
      PriorityBadge/
      NotificationDrawer/
      MetricCard/
    pages/
      index
      login
      register
      dashboard
      complaints/
      admin/
      notifications
      settings
    store/
      authStore
      complaintStore
    services/
      api
    utils/
    styles/

Backend:

server/
  src/
    config/
      env.js
      db.js
    models/
      User.js
      Complaint.js
      ComplaintComment.js
      Department.js
      Notification.js
      ComplaintHistory.js
    routes/
      authRoutes.js
      complaintRoutes.js
      adminComplaintRoutes.js
      dashboardRoutes.js
      departmentRoutes.js
      notificationRoutes.js
    controllers/
      authController.js
      complaintController.js
      adminComplaintController.js
      dashboardController.js
      departmentController.js
      notificationController.js
    services/
      authService.js
      complaintService.js
      assignmentService.js
      notificationService.js
      dashboardService.js
    middleware/
      authMiddleware.js
      roleMiddleware.js
      validationMiddleware.js
      errorHandler.js
    validators/
    utils/
    app.js
    server.js

18. DEVELOPMENT PHASES

Phase 1 - Project Initialization and Authentication

Implement:
- Frontend project setup
- Backend Express setup
- MongoDB connection
- Environment configuration
- User model
- Registration
- Login
- JWT authentication
- bcrypt password hashing
- Protected routes
- Role middleware
- Basic AppShell

Expected result:
Students and admins can securely log in and access role-specific areas.

Phase 2 - Complaint Submission and Student Dashboard

Implement:
- Complaint model
- Complaint creation API
- Complaint submission form
- Categories
- Priority
- Location
- Attachment support
- Student dashboard
- Student complaint history
- Complaint details page

Expected result:
A student can submit a complaint and track it from the student interface.

Phase 3 - Admin Complaint Management

Implement:
- Admin dashboard
- Admin complaint list
- Complaint search/filter
- Complaint details
- Department management
- Staff assignment
- Priority management
- Admin comments
- Status management

Expected result:
An admin can review and manage the complete complaint lifecycle.

Phase 4 - Resolution and Audit Trail

Implement:
- Resolution details
- Resolve complaint API
- Close complaint API
- ComplaintHistory collection
- Complaint timeline
- Status transition validation
- Audit information

Expected result:
Every complaint has a traceable lifecycle from submission to closure.

Phase 5 - Notifications and Statistics

Implement:
- Notification collection
- Notification APIs
- Complaint event notifications
- Student/admin notification views
- Basic dashboard statistics
- Category/priority/status statistics

Expected result:
Users receive useful complaint updates and administrators can understand complaint trends.

Phase 6 - Optional Real-Time and AI Features

Implement only after all core features work:
- Socket.IO real-time updates
- Email notifications
- Resolution time tracking
- Student feedback/rating
- Duplicate complaint detection
- AI categorization
- AI summary generation
- AI department recommendation
- Automatic escalation

Expected result:
The system becomes more automated and intelligent without compromising the core complaint workflow.

19. TESTING REQUIREMENTS

The implementation must test:
- Student registration
- Admin login
- Invalid login
- Duplicate registration
- Complaint creation
- Missing complaint fields
- Complaint category validation
- Priority validation
- Complaint ownership
- Admin complaint access
- Department assignment
- Status transitions
- Invalid status transitions
- Admin comments
- Resolution
- Complaint closure
- Search/filter
- Notifications
- Unauthorized API access
- File upload validation

20. DEPLOYMENT REQUIREMENTS

The final system must be deployable as a working full-stack application.

Required production configuration:
- Frontend deployment
- Backend deployment
- MongoDB database
- Environment variables
- Secure JWT secret
- CORS configuration
- File storage configuration when attachments are enabled
- Production error handling
- Health endpoint

GET /api/health must provide a simple service health response for deployment monitoring.

21. FINAL EXPECTED OUTCOME

The completed College Complaint Management System must allow a student to:

1. Register/login.
2. Submit a complaint.
3. Select a complaint category.
4. Describe the issue.
5. Specify the location.
6. Set a priority.
7. Attach an image/file when needed.
8. Track the complaint status.
9. View complaint history.
10. View administrator updates and resolution details.

The completed system must allow an administrator to:

1. Login securely.
2. View all complaints.
3. Review submitted complaints.
4. Assign complaints to departments/staff.
5. Set or update priority.
6. Add comments and progress updates.
7. Change complaint status.
8. Record resolution details.
9. Close resolved complaints.
10. Search and filter complaints.
11. View complaint statistics.
12. Maintain an auditable complaint history.

The final application should feel like a simple, modern, reliable college service portal that replaces paper-based/manual complaint handling with a centralized digital workflow.

22. CODEX / AI CODING AGENT IMPLEMENTATION INSTRUCTIONS

The AI coding agent must build the application phase by phase.

Implementation rules:
- Follow the folder structure strictly.
- Keep controllers thin.
- Put business logic inside services.
- Never call MongoDB directly from controllers.
- Enforce authentication and role authorization on the backend.
- Never trust frontend-only permission checks.
- Validate every request body.
- Use environment variables for all secrets.
- Never store plaintext passwords.
- Never expose sensitive credentials in API responses or logs.
- Maintain complaint ownership checks.
- Validate all complaint status transitions.
- Create ComplaintHistory records for important lifecycle changes.
- Keep notification creation inside the service layer.
- Keep optional AI features separate from the core complaint workflow.
- Do not make AI functionality a dependency for basic complaint submission or tracking.
- Return consistent API response structures.
- Handle errors centrally.
- Report the list of files created or changed at the end of every development phase.

23. CORE ACCEPTANCE CRITERIA

The project is considered complete when:

- A student can register and log in.
- An admin can log in.
- A student can successfully submit a complaint.
- The complaint is stored in MongoDB.
- The complaint receives the Submitted status automatically.
- The student can view the complaint.
- The admin can view the complaint.
- The admin can review and assign the complaint.
- The admin can update its status through the defined lifecycle.
- The student can see status updates.
- The admin can record resolution details.
- The complaint can be closed.
- Complaint history is preserved.
- Search and filtering work.
- Dashboard statistics work.
- Unauthorized users cannot access protected complaint data.
- The frontend and backend communicate successfully.
- The application can be deployed and accessed as a working web application.

END OF SPECIFICATION
