const express = require('express');
const Department = require('../models/Department');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const DEFAULT_DEPARTMENTS = [
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

/*
|--------------------------------------------------------------------------
| GET /api/departments
| List active college departments
|--------------------------------------------------------------------------
*/
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (active === 'true' || active === true) {
      filter.active = true;
    }

    let departments = await Department.find(filter).sort({ name: 1 });

    // Seed default departments if database is empty
    if (departments.length === 0) {
      for (const dept of DEFAULT_DEPARTMENTS) {
        await Department.findOneAndUpdate(
          { departmentCode: dept.departmentCode },
          { $setOnInsert: dept },
          { upsert: true, new: true }
        );
      }
      departments = await Department.find(filter).sort({ name: 1 });
    }

    return res.status(200).json({
      success: true,
      count: departments.length,
      data: { departments },
    });
  } catch (error) {
    console.error('GET DEPARTMENTS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/departments
| Create new department (Admin only)
|--------------------------------------------------------------------------
*/
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, departmentCode, description } = req.body;

    if (!name || !departmentCode) {
      return res.status(400).json({
        success: false,
        message: 'Department name and code are required',
      });
    }

    const existing = await Department.findOne({
      $or: [{ name: name.trim() }, { departmentCode: departmentCode.trim().toUpperCase() }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Department with this name or code already exists',
      });
    }

    const department = await Department.create({
      name: name.trim(),
      departmentCode: departmentCode.trim().toUpperCase(),
      description: description ? description.trim() : '',
    });

    return res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: { department },
    });
  } catch (error) {
    console.error('CREATE DEPARTMENT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create department',
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| PUT /api/departments/:id
| Update department (Admin only)
|--------------------------------------------------------------------------
*/
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, departmentCode, description, active } = req.body;

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    if (name) department.name = name.trim();
    if (departmentCode) department.departmentCode = departmentCode.trim().toUpperCase();
    if (description !== undefined) department.description = description.trim();
    if (active !== undefined) department.active = Boolean(active);

    await department.save();

    return res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: { department },
    });
  } catch (error) {
    console.error('UPDATE DEPARTMENT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update department',
      error: error.message,
    });
  }
});

module.exports = router;
