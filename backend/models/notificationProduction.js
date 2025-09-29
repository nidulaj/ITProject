const { pool } = require('../db/dbConnect');

// Express.js example
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(5); // Fetch latest 5 notifications
    res.json({ data: notifications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});


