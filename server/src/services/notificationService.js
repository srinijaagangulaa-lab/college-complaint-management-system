const Notification = require('../models/Notification');
const { emitToUser } = require('../utils/socket');

const createNotification = async ({ userId, complaintId, type, title, message }) => {
  try {
    const notification = await Notification.create({
      user: userId,
      complaint: complaintId || null,
      type: type || 'general',
      title,
      message,
    });

    // Emit live socket event to the recipient
    emitToUser(userId.toString(), 'notification', notification);

    return notification;
  } catch (error) {
    console.error('[NotificationService] Error creating notification:', error.message);
    return null;
  }
};

const getUserNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
  const query = { user: userId };
  if (unreadOnly === 'true' || unreadOnly === true) {
    query.isRead = false;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .populate('complaint', 'complaintId title status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Notification.countDocuments(query),
    Notification.countDocuments({ user: userId, isRead: false }),
  ]);

  return {
    notifications,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
    unreadCount,
  };
};

const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({ _id: notificationId, user: userId });
  if (!notification) {
    const error = new Error('Notification not found');
    error.statusCode = 404;
    throw error;
  }

  notification.isRead = true;
  await notification.save();
  return notification;
};

const markAllNotificationsAsRead = async (userId) => {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
  return { success: true, message: 'All notifications marked as read' };
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
