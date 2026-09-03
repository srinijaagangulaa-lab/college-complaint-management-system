const departmentService = require('../services/departmentService');

const getAll = async (req, res, next) => {
  try {
    const activeOnly = req.query.active === 'true';
    const departments = await departmentService.getAllDepartments(activeOnly);
    res.status(200).json({
      success: true,
      data: { departments },
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: { department },
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const department = await departmentService.updateDepartment(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: { department },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  create,
  update,
};
