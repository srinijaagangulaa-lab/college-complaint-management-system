const complaintService = require('../services/complaintService');

const create = async (req, res, next) => {
  try {
    const complaint = await complaintService.createComplaint(
      req.user._id,
      req.body,
      req.file
    );
    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: { complaint },
    });
  } catch (error) {
    next(error);
  }
};

const getMyComplaints = async (req, res, next) => {
  try {
    const result = await complaintService.getStudentComplaints(
      req.user._id,
      req.query
    );
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
    const result = await complaintService.getComplaintById(
      req.params.id,
      req.user
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const history = await complaintService.getComplaintHistory(
      req.params.id,
      req.user
    );
    res.status(200).json({
      success: true,
      data: { history },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getMyComplaints,
  getById,
  getHistory,
};
