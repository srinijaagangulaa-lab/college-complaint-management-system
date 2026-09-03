const notificationService = require('../services/notificationService');

const getMyNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.getUserNotifications(req.user._id, req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const markRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markNotificationAsRead(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllNotificationsAsRead(req.user._id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  markRead,
  markAllRead,
};
