const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

/*
|--------------------------------------------------------------------------
| GET /api/notifications
| Get notifications for the logged-in user
|--------------------------------------------------------------------------
*/
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    return res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    console.error('GET NOTIFICATIONS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| PUT /api/notifications/:id/read
| Mark a single notification as read
|--------------------------------------------------------------------------
*/
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: { notification },
    });
  } catch (error) {
    console.error('MARK NOTIFICATION READ ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| PUT /api/notifications/read-all
| Mark all notifications as read
|--------------------------------------------------------------------------
*/
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('MARK ALL NOTIFICATIONS READ ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update notifications',
      error: error.message,
    });
  }
});

module.exports = router;
