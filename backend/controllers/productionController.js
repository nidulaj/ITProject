// controllers/productionController.js
const {
  createProductionFromRequest,
  listProductions,
} = require("../models/productionModel");

const startFromRequest = async (req, res) => {
  try {
    const { req_id } = req.params;
    const row = await createProductionFromRequest(Number(req_id));
    return res.status(201).json({ success: true, production: row });
  } catch (err) {
    console.error("startFromRequest error:", err);
    return res.status(400).json({ success: false, error: err.message });
  }
};

const list = async (_req, res) => {
  try {
    const rows = await listProductions();
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("list productions error:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch productions" });
  }
};

module.exports = {
  startFromRequest,
  list,
};
