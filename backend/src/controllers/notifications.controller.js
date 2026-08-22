import Notification from '../models/Notification.js';

// GET /api/notifications — Get notifications for current user
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { unreadOnly } = req.query;

    // Notifications targeted to this user OR broadcast (targetUserId = null)
    const query = {
      $or: [{ targetUserId: userId }, { targetUserId: null }],
    };

    if (unreadOnly === 'true') {
      query['readBy.userId'] = { $ne: userId };
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);

    // Mark which ones are read by this user
    const enriched = notifications.map((n) => ({
      ...n.toObject(),
      read: n.readBy.some((r) => r.userId?.toString() === userId.toString()),
    }));

    const unreadCount = enriched.filter((n) => !n.read).length;

    res.status(200).json({ success: true, unreadCount, notifications: enriched });
  } catch (error) {
    next(error);
  }
};

// PUT /api/notifications/:id/read
export const markRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { readBy: { userId, readAt: new Date() } },
      },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });
    res.status(200).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// PUT /api/notifications/read-all
export const markAllRead = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const userNotifications = await Notification.find({
      $or: [{ targetUserId: userId }, { targetUserId: null }],
      'readBy.userId': { $ne: userId },
    });

    await Promise.all(
      userNotifications.map((n) =>
        Notification.findByIdAndUpdate(n._id, {
          $addToSet: { readBy: { userId, readAt: new Date() } },
        })
      )
    );

    res.status(200).json({ success: true, message: `Marked ${userNotifications.length} notifications as read.` });
  } catch (error) {
    next(error);
  }
};
