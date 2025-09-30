const express = require('express');
const { getNotifications } = require('../utils/notificationUtils'); // Import the utility function
const router = express.Router();

// GET route for notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await getNotifications(); // Fetch and format only pending notifications
    res.json({ data: notifications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

module.exports = router;
