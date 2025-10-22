// controllers/productionController.js
const {
  createProductionFromRequest,
  listProductions,
  updateProductionStatusModel,
} = require("../models/productionModel");

// Create production from an accepted request
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

// List all productions
const list = async (_req, res) => {
  try {
    const rows = await listProductions();
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("list productions error:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch productions" });
  }
};

// Mark a production as delivered
const markProductionDelivered = async (req, res) => {
  const { batch_id } = req.params;

  try {
    const success = await updateProductionStatusModel(batch_id, 'delivered');

    if (!success) {
      return res.status(404).json({ success: false, error: "Production not found" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Error marking production as delivered:", err);
    return res.status(500).json({ success: false, error: "Failed to mark delivered" });
  }
};

module.exports = {
  startFromRequest,
  list,
  markProductionDelivered,
};
