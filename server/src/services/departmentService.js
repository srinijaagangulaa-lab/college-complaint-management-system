const Department = require('../models/Department');

const getAllDepartments = async (activeOnly = false) => {
  const query = activeOnly ? { active: true } : {};
  return await Department.find(query).populate('staffMembers', 'name email department').sort({ name: 1 });
};

const createDepartment = async (departmentData) => {
  const { name, description, departmentCode, staffMembers } = departmentData;

  const existingDept = await Department.findOne({
    $or: [{ name: name.trim() }, { departmentCode: departmentCode.trim().toUpperCase() }],
  });

  if (existingDept) {
    const error = new Error('Department with this name or code already exists');
    error.statusCode = 400;
    throw error;
  }

  return await Department.create({
    name: name.trim(),
    description: description || '',
    departmentCode: departmentCode.trim().toUpperCase(),
    staffMembers: staffMembers || [],
  });
};

const updateDepartment = async (departmentId, updateData) => {
  const department = await Department.findById(departmentId);
  if (!department) {
    const error = new Error('Department not found');
    error.statusCode = 404;
    throw error;
  }

  if (updateData.name) department.name = updateData.name.trim();
  if (updateData.description !== undefined) department.description = updateData.description;
  if (updateData.departmentCode) department.departmentCode = updateData.departmentCode.trim().toUpperCase();
  if (updateData.active !== undefined) department.active = updateData.active;
  if (updateData.staffMembers) department.staffMembers = updateData.staffMembers;

  await department.save();
  return department;
};

module.exports = {
  getAllDepartments,
  createDepartment,
  updateDepartment,
};
