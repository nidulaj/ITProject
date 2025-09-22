const cron = require("node-cron");
const { pool } = require("../db/dbConnect");

// Runs every minute
cron.schedule("* * * * *", async () => {
  try {
    await pool.query(`
      UPDATE staff
      SET is_active = true, deactivated_until = NULL
      WHERE deactivated_until IS NOT NULL
        AND deactivated_until <= NOW()
    `);
  } catch (err) {
    console.error("Error reactivating staff:", err);
  }
});
