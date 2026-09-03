const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// In-Memory Database State
const dbState = {
  isInMemory: false,
  users: [],
  complaints: [],
  comments: [],
  departments: [],
  notifications: [],
  history: [],
};

// Generate MongoDB-compatible ObjectId string
const generateId = () => new mongoose.Types.ObjectId().toString();

const seedMemoryData = async () => {
  // Already seeded
  if (dbState.users.length > 0) {
    return;
  }

  console.log(
    '[MemoryDB] Auto-seeding in-memory database with demo accounts & sample complaints...'
  );

  // Password hashes
  const salt = await bcrypt.genSalt(10);

  const adminHash = await bcrypt.hash('Admin@123', salt);
  const studentHash = await bcrypt.hash('Student@123', salt);
  const staffHash = await bcrypt.hash('Staff@123', salt);

  // IDs
  const adminId = generateId();
  const staffITId = generateId();
  const student1Id = generateId();
  const student2Id = generateId();

  const now = new Date();

  // ============================================================
  // USERS
  // ============================================================

  dbState.users = [
    {
      _id: adminId,
      name: 'Dr. Sarah Jenkins',
      email: 'admin@college.edu',
      passwordHash: adminHash,
      role: 'admin',
      department: 'Administration',
      phone: '+1-555-0100',
      lastLogin: now,
      createdAt: now,
      updatedAt: now,
    },

    {
      _id: staffITId,
      name: 'Alex Rivera',
      email: 'alex.it@college.edu',
      passwordHash: staffHash,
      role: 'admin',
      department: 'IT Support',
      phone: '+1-555-0101',
      lastLogin: now,
      createdAt: now,
      updatedAt: now,
    },

    {
      _id: student1Id,
      name: 'Jane Doe',
      email: 'student@college.edu',
      passwordHash: studentHash,
      role: 'student',
      studentId: 'STU-2024-001',
      department: 'Computer Science',
      phone: '+1-555-0199',
      lastLogin: now,
      createdAt: now,
      updatedAt: now,
    },

    {
      _id: student2Id,
      name: 'David Chen',
      email: 'david.chen@college.edu',
      passwordHash: studentHash,
      role: 'student',
      studentId: 'STU-2024-042',
      department: 'Mechanical Engineering',
      phone: '+1-555-0188',
      lastLogin: now,
      createdAt: now,
      updatedAt: now,
    },
  ];

  // ============================================================
  // DEPARTMENTS
  // ============================================================

  dbState.departments = [
    {
      _id: generateId(),
      name: 'Administration',
      departmentCode: 'ADM',
      description: 'Central College Administration',
      active: true,
      staffMembers: [adminId],
    },

    {
      _id: generateId(),
      name: 'IT Support',
      departmentCode: 'ITS',
      description: 'Campus Networking, Wi-Fi, and Computing Facilities',
      active: true,
      staffMembers: [staffITId],
    },

    {
      _id: generateId(),
      name: 'Hostel Management',
      departmentCode: 'HST',
      description: 'Hostel Rooms, Facilities, and Mess',
      active: true,
      staffMembers: [],
    },

    {
      _id: generateId(),
      name: 'Maintenance',
      departmentCode: 'MNT',
      description: 'Civil and General Infrastructure Repairs',
      active: true,
      staffMembers: [],
    },

    {
      _id: generateId(),
      name: 'Transport',
      departmentCode: 'TRN',
      description: 'College Buses and Campus Transit',
      active: true,
      staffMembers: [],
    },

    {
      _id: generateId(),
      name: 'Housekeeping/Cleanliness',
      departmentCode: 'HSK',
      description: 'Sanitation, Cleaning, and Waste Management',
      active: true,
      staffMembers: [],
    },

    {
      _id: generateId(),
      name: 'Laboratory',
      departmentCode: 'LAB',
      description: 'Equipment, Chemicals, and Lab Instruments',
      active: true,
      staffMembers: [],
    },

    {
      _id: generateId(),
      name: 'Library',
      departmentCode: 'LIB',
      description: 'Books, Study Halls, and Digital Catalog Access',
      active: true,
      staffMembers: [],
    },

    {
      _id: generateId(),
      name: 'Electrical/Water Maintenance',
      departmentCode: 'EWM',
      description: 'Power Outages, RO Water, Plumbing',
      active: true,
      staffMembers: [],
    },

    {
      _id: generateId(),
      name: 'Other',
      departmentCode: 'OTH',
      description: 'General Complaints and Miscellaneous',
      active: true,
      staffMembers: [],
    },
  ];

  // ============================================================
  // COMPLAINT IDs
  // ============================================================

  const c1Id = generateId();
  const c2Id = generateId();
  const c3Id = generateId();
  const c4Id = generateId();

  // ============================================================
  // COMPLAINTS
  // IMPORTANT:
  // Use submittedBy instead of student.
  // This matches your MongoDB Complaint schema.
  // ============================================================

  dbState.complaints = [
    {
      _id: c1Id,

      complaintId: 'CMP-2026-0001',

      submittedBy: student1Id,

      title: 'Wi-Fi not working in Block B 3rd Floor',

      category: 'Wi-Fi/Internet',

      description:
        'The Wi-Fi access point on Block B third floor has been disconnecting frequently since yesterday. Students in room 302-308 are unable to connect.',

      location: 'Block B, 3rd Floor Corridor',

      priority: 'high',

      status: 'in_progress',

      assignedDepartment: 'IT Support',

      assignedStaff: staffITId,

      createdAt: new Date(Date.now() - 48 * 3600 * 1000),

      updatedAt: new Date(Date.now() - 12 * 3600 * 1000),
    },

    {
      _id: c2Id,

      complaintId: 'CMP-2026-0002',

      submittedBy: student1Id,

      title: 'Projector flickering in CS Seminar Hall',

      category: 'Classroom',

      description:
        'The ceiling projector HDMI port disconnects and display flickers during lectures.',

      location: 'CS Seminar Hall (Room 105)',

      priority: 'medium',

      status: 'under_review',

      assignedDepartment: null,

      assignedStaff: null,

      createdAt: new Date(Date.now() - 36 * 3600 * 1000),

      updatedAt: new Date(Date.now() - 24 * 3600 * 1000),
    },

    {
      _id: c3Id,

      complaintId: 'CMP-2026-0003',

      submittedBy: student1Id,

      title: 'Water cooler leaking near Hostel Dining Hall',

      category: 'Water/Sanitation',

      description:
        'Continuous water leakage from the RO water dispenser causing slippery floor.',

      location: 'Hostel Block 1 Ground Floor',

      priority: 'critical',

      status: 'resolved',

      assignedDepartment: 'Electrical/Water Maintenance',

      assignedStaff: null,

      resolvedBy: adminId,

      resolvedAt: new Date(Date.now() - 20 * 3600 * 1000),

      resolutionDetails: {
        description:
          'Replaced faulty inlet valve and tightened the pipeline gasket. Tested with zero leaks.',

        resolvedAt: new Date(Date.now() - 20 * 3600 * 1000),

        resolvedBy: adminId,
      },

      createdAt: new Date(Date.now() - 30 * 3600 * 1000),

      updatedAt: new Date(Date.now() - 20 * 3600 * 1000),
    },

    {
      _id: c4Id,

      complaintId: 'CMP-2026-0004',

      submittedBy: student2Id,

      title: 'Broken AC unit in Robotics Lab',

      category: 'Laboratory',

      description:
        'AC unit #2 is making loud rattling noise and not blowing cold air.',

      location: 'Robotics Lab, Tech Complex Room 204',

      priority: 'medium',

      status: 'assigned',

      assignedDepartment: 'Maintenance',

      assignedStaff: null,

      createdAt: new Date(Date.now() - 10 * 3600 * 1000),

      updatedAt: new Date(Date.now() - 2 * 3600 * 1000),
    },
  ];

  // ============================================================
  // COMPLAINT COMMENTS
  // ============================================================

  dbState.comments = [
    {
      _id: generateId(),

      complaint: c1Id,

      author: staffITId,

      comment:
        'Network technician has been dispatched with replacement AP hardware.',

      previousStatus: 'assigned',

      newStatus: 'in_progress',

      isInternal: false,

      createdAt: new Date(Date.now() - 12 * 3600 * 1000),
    },
  ];

  // ============================================================
  // COMPLAINT HISTORY
  // ============================================================

  dbState.history = [
    {
      _id: generateId(),

      complaint: c1Id,

      changedBy: student1Id,

      action: 'created',

      previousStatus: null,

      newStatus: 'submitted',

      metadata: {
        title: 'Wi-Fi not working in Block B 3rd Floor',
      },

      createdAt: new Date(Date.now() - 48 * 3600 * 1000),
    },

    {
      _id: generateId(),

      complaint: c1Id,

      changedBy: adminId,

      action: 'assigned',

      previousStatus: 'submitted',

      newStatus: 'assigned',

      metadata: {
        department: 'IT Support',
        staffName: 'Alex Rivera',
      },

      createdAt: new Date(Date.now() - 24 * 3600 * 1000),
    },

    {
      _id: generateId(),

      complaint: c1Id,

      changedBy: staffITId,

      action: 'status_change',

      previousStatus: 'assigned',

      newStatus: 'in_progress',

      metadata: {
        note: 'Work started',
      },

      createdAt: new Date(Date.now() - 12 * 3600 * 1000),
    },
  ];

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  dbState.notifications = [
    {
      _id: generateId(),

      user: student1Id,

      complaint: c1Id,

      type: 'status_updated',

      title: 'Complaint Update: In Progress',

      message:
        'Technician dispatched for complaint #CMP-2026-0001.',

      isRead: false,

      createdAt: new Date(Date.now() - 12 * 3600 * 1000),
    },
  ];

  // ============================================================
  // DONE
  // ============================================================

  console.log(
    '[MemoryDB] In-Memory database initialized successfully.'
  );

  console.log('[MemoryDB] Ready for instant Demo Login:');

  console.log(
    '   Admin:   admin@college.edu / Admin@123'
  );

  console.log(
    '   Student: student@college.edu / Student@123'
  );
};

module.exports = {
  dbState,
  generateId,
  seedMemoryData,
};