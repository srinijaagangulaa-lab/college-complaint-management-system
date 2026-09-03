const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dns = require('dns');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const adminComplaintRoutes = require('./routes/adminComplaints');
const dashboardRoutes = require('./routes/dashboard');
const departmentRoutes = require('./routes/departments');
const notificationRoutes = require('./routes/notifications');
const User = require('./models/User');
const Department = require('./models/Department');

dotenv.config();
dns.setServers(['8.8.8.8', '1.1.1.1']);
const app = express();

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
// Logging
app.use(morgan('dev'));

// Root health route
app.get('/', (req, res) => {
  res.json({
    message: 'College Complaint Management System API is running',
  });
});

// API health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CCMS backend is running',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin/complaints', adminComplaintRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/notifications', notificationRoutes);

// Database connection
const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      const memoryServer = await MongoMemoryServer.create();
      mongoUri = memoryServer.getUri();

      console.log('Using MongoDB Memory Server');
    }

    await mongoose.connect(mongoUri);

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Create default admin user
const seedAdminUser = async () => {
  // Create admin account
  const existingAdmin = await User.findOne({
    email: 'admin@college.edu'
  });

  if (!existingAdmin) {
    await User.create({
      name: 'College Admin',
      email: 'admin@college.edu',
      password: 'Admin@123',
      role: 'admin',
      phone: '0000000000',
      department: 'Administration',
    });

    console.log(
      'Default admin user created: admin@college.edu / Admin@123'
    );
  }

  // Create student demo account
  const existingStudent = await User.findOne({
    email: 'student@college.edu'
  });

  if (!existingStudent) {
    await User.create({
      name: 'Demo Student',
      email: 'student@college.edu',
      password: 'Student@123',
      role: 'student',
      studentId: 'STU-DEMO-001',
      department: 'Computer Science',
      phone: '9999999999',
    });

    console.log(
      'Demo student user created: student@college.edu / Student@123'
    );
  }

  // Seed default departments if none exist
  const deptCount = await Department.countDocuments({});
  if (deptCount === 0) {
    const defaultDepts = [
      { name: 'IT Support', departmentCode: 'IT', description: 'Campus computer labs, network, internet access, and digital portals' },
      { name: 'Hostel Management', departmentCode: 'HOSTEL', description: 'Hostel rooms, mess, laundry, and student accommodation' },
      { name: 'Maintenance', departmentCode: 'MAINT', description: 'General building repairs, infrastructure, civil maintenance' },
      { name: 'Transport', departmentCode: 'TRANS', description: 'College buses, student shuttle routes, and parking facilities' },
      { name: 'Housekeeping', departmentCode: 'CLEAN', description: 'Classroom cleanliness, washroom sanitization, and waste disposal' },
      { name: 'Laboratory', departmentCode: 'LAB', description: 'Lab apparatus, chemical stores, computers, and experimental equipment' },
      { name: 'Library', departmentCode: 'LIB', description: 'Books, journal access, reading rooms, and quiet study areas' },
      { name: 'Electrical & Water', departmentCode: 'ELEC', description: 'Power supply, fans, ACs, lighting, and drinking water facilities' },
      { name: 'Administration', departmentCode: 'ADMIN', description: 'College office, fee counters, ID cards, certificates' },
      { name: 'Other', departmentCode: 'OTHER', description: 'General campus facilities and miscellaneous inquiries' },
    ];
    await Department.insertMany(defaultDepts);
    console.log('Default departments seeded successfully');
  }
};

// Start server
const startServer = async () => {
  await connectDB();

  await seedAdminUser();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;