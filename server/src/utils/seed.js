const mongoose = require('mongoose');
const User = require('../models/User');
const Department = require('../models/Department');
const Complaint = require('../models/Complaint');
const ComplaintComment = require('../models/ComplaintComment');
const ComplaintHistory = require('../models/ComplaintHistory');
const Notification = require('../models/Notification');
const { connectDB, closeDB } = require('../config/db');

const seedDatabase = async (shouldExit = true) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Complaint.deleteMany({}),
      ComplaintComment.deleteMany({}),
      ComplaintHistory.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('[Seed] Creating users...');
    const adminPasswordHash = await User.hashPassword('Admin@123');
    const studentPasswordHash = await User.hashPassword('Student@123');
    const staffPasswordHash = await User.hashPassword('Staff@123');

    const admin = await User.create({
      name: 'Dr. Sarah Jenkins',
      email: 'admin@college.edu',
      passwordHash: adminPasswordHash,
      role: 'admin',
      department: 'Administration',
      phone: '+1-555-0100',
    });

    const staffIT = await User.create({
      name: 'Alex Rivera',
      email: 'alex.it@college.edu',
      passwordHash: staffPasswordHash,
      role: 'admin',
      department: 'IT Support',
      phone: '+1-555-0101',
    });

    const staffHostel = await User.create({
      name: 'Marcus Vance',
      email: 'marcus.hostel@college.edu',
      passwordHash: staffPasswordHash,
      role: 'admin',
      department: 'Hostel Management',
      phone: '+1-555-0102',
    });

    const student1 = await User.create({
      name: 'Jane Doe',
      email: 'student@college.edu',
      passwordHash: studentPasswordHash,
      role: 'student',
      studentId: 'STU-2024-001',
      department: 'Computer Science',
      phone: '+1-555-0199',
    });

    const student2 = await User.create({
      name: 'David Chen',
      email: 'david.chen@college.edu',
      passwordHash: studentPasswordHash,
      role: 'student',
      studentId: 'STU-2024-042',
      department: 'Mechanical Engineering',
      phone: '+1-555-0188',
    });

    console.log('[Seed] Creating departments...');
    const departmentsData = [
      { name: 'Administration', departmentCode: 'ADM', description: 'Central College Administration' },
      { name: 'IT Support', departmentCode: 'ITS', description: 'Campus Networking, Wi-Fi, and Computing Facilities', staffMembers: [staffIT._id] },
      { name: 'Hostel Management', departmentCode: 'HST', description: 'Hostel Rooms, Facilities, and Mess', staffMembers: [staffHostel._id] },
      { name: 'Maintenance', departmentCode: 'MNT', description: 'Civil and General Infrastructure Repairs' },
      { name: 'Transport', departmentCode: 'TRN', description: 'College Buses and Campus Transit' },
      { name: 'Housekeeping/Cleanliness', departmentCode: 'HSK', description: 'Sanitation, Cleaning, and Waste Management' },
      { name: 'Laboratory', departmentCode: 'LAB', description: 'Equipment, Chemicals, and Lab Instruments' },
      { name: 'Library', departmentCode: 'LIB', description: 'Books, Study Halls, and Digital Catalog Access' },
      { name: 'Electrical/Water Maintenance', departmentCode: 'EWM', description: 'Power Outages, RO Water, Plumbing' },
      { name: 'Other', departmentCode: 'OTH', description: 'General Complaints and Miscellaneous' },
    ];

    await Department.insertMany(departmentsData);

    console.log('[Seed] Creating sample complaints...');
    const sampleComplaints = [
      {
        complaintId: 'CMP-2026-0001',
        student: student1._id,
        title: 'Wi-Fi not working in Block B 3rd Floor',
        category: 'Wi-Fi/Internet',
        description: 'The Wi-Fi access point on Block B third floor has been disconnecting frequently since yesterday. Students in room 302-308 are unable to connect.',
        location: 'Block B, 3rd Floor Corridor',
        priority: 'high',
        status: 'in_progress',
        assignedDepartment: 'IT Support',
        assignedStaff: staffIT._id,
      },
      {
        complaintId: 'CMP-2026-0002',
        student: student1._id,
        title: 'Projector flickering in CS Seminar Hall',
        category: 'Classroom',
        description: 'The ceiling projector HDMI port disconnects and display flickers during lectures.',
        location: 'CS Seminar Hall (Room 105)',
        priority: 'medium',
        status: 'under_review',
      },
      {
        complaintId: 'CMP-2026-0003',
        student: student1._id,
        title: 'Water cooler leaking near Hostel Dining Hall',
        category: 'Water/Sanitation',
        description: 'Continuous water leakage from the RO water dispenser causing slippery floor.',
        location: 'Hostel Block 1 Ground Floor',
        priority: 'critical',
        status: 'resolved',
        assignedDepartment: 'Electrical/Water Maintenance',
        resolvedBy: admin._id,
        resolvedAt: new Date(Date.now() - 24 * 3600 * 1000),
        resolutionDetails: {
          description: 'Replaced faulty inlet valve and tightened the pipeline gasket. Tested for 2 hours with zero leaks.',
          resolvedAt: new Date(Date.now() - 24 * 3600 * 1000),
          resolvedBy: admin._id,
        },
      },
      {
        complaintId: 'CMP-2026-0004',
        student: student2._id,
        title: 'Broken AC unit in Robotics Lab',
        category: 'Laboratory',
        description: 'AC unit #2 is making loud rattling noise and not blowing cold air.',
        location: 'Robotics Lab, Tech Complex Room 204',
        priority: 'medium',
        status: 'assigned',
        assignedDepartment: 'Maintenance',
      },
      {
        complaintId: 'CMP-2026-0005',
        student: student2._id,
        title: 'Streetlight out near North Gate parking',
        category: 'Electricity',
        description: 'Pole #14 lamp is dark at night making the pathway hazardous.',
        location: 'North Gate Perimeter Road',
        priority: 'low',
        status: 'submitted',
      },
    ];

    for (const item of sampleComplaints) {
      const createdComplaint = await Complaint.create(item);

      // Create history
      await ComplaintHistory.create({
        complaint: createdComplaint._id,
        changedBy: createdComplaint.student,
        action: 'created',
        previousStatus: null,
        newStatus: 'submitted',
        metadata: { title: createdComplaint.title, category: createdComplaint.category },
      });

      if (createdComplaint.status !== 'submitted') {
        await ComplaintHistory.create({
          complaint: createdComplaint._id,
          changedBy: admin._id,
          action: 'status_change',
          previousStatus: 'submitted',
          newStatus: createdComplaint.status,
          metadata: { note: `Status updated to ${createdComplaint.status}` },
        });
      }

      if (createdComplaint.status === 'in_progress') {
        await ComplaintComment.create({
          complaint: createdComplaint._id,
          author: staffIT._id,
          comment: 'Network technician has been dispatched with replacement AP hardware.',
          previousStatus: 'assigned',
          newStatus: 'in_progress',
        });
      }
    }

    // Create a sample notification for student
    await Notification.create({
      user: student1._id,
      title: 'Welcome to CCMS',
      message: 'Your College Complaint Management System account is active.',
      type: 'general',
      isRead: false,
    });

    console.log('[Seed] Database seeded successfully!');
    console.log('[Seed] Default credentials:');
    console.log('   Admin:   admin@college.edu   / Admin@123');
    console.log('   Student: student@college.edu / Student@123');

    if (shouldExit) {
      await closeDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    if (shouldExit) {
      process.exit(1);
    }
  }
};

// Allow direct execution: node src/utils/seed.js
if (require.main === module) {
  seedDatabase(true);
}

module.exports = seedDatabase;
