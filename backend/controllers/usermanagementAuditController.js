const {createLog, getAllLogs} = require("../models/userManagementAuditLogModel");

const createAuditLog = async (req, res) => {
  try {
    const { userId, action, details } = req.body;

    if(userId == null){
      userId = req.user.id;
    }

    const log = await createLog(userId, action, details);

    res.status(201).json({ success: true, log });
  } catch (error) {
    console.error("Error creating audit log:", error);
    res.status(500).json({ success: false, message: "Error creating audit log" });
  }
};

const getAllAuditLogs = async (req, res) => {
  try {
    const logs = await getAllLogs();
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ success: false, message: "Error fetching audit logs" });
  }
};

module.exports = {
  createAuditLog,
  getAllAuditLogs
};
