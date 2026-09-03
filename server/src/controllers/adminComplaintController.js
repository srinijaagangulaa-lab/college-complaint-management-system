const adminComplaintService = require('../services/adminComplaintService');
const assignmentService = require('../services/assignmentService');

const getAll = async (req, res, next) => {
  try {
    const result = await adminComplaintService.getAllComplaints(req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const result = await adminComplaintService.getAdminComplaintById(req.params.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await adminComplaintService.updateComplaint(
      req.params.id,
      req.body,
      req.user
    );
    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const assign = async (req, res, next) => {
  try {
    const complaint = await assignmentService.assignComplaint(
      req.params.id,
      req.body,
      req.user
    );
    res.status(200).json({
      success: true,
      message: 'Complaint assigned successfully',
      data: { complaint },
    });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const comment = await adminComplaintService.addComment(
      req.params.id,
      req.body,
      req.user
    );
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

const resolve = async (req, res, next) => {
  try {
    const result = await adminComplaintService.resolveComplaint(
      req.params.id,
      req.body,
      req.user
    );
    res.status(200).json({
      success: true,
      message: 'Complaint resolved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const close = async (req, res, next) => {
  try {
    const result = await adminComplaintService.closeComplaint(
      req.params.id,
      req.user
    );
    res.status(200).json({
      success: true,
      message: 'Complaint closed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteComplaint = async (req, res, next) => {
  try {
    const result = await adminComplaintService.deleteComplaint(
      req.params.id,
      req.user
    );
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  update,
  assign,
  addComment,
  resolve,
  close,
  deleteComplaint,
};
