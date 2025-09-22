// backend/controllers/customizedOrderController.js
const { listAll, createOne, updateOne, updateStatus, deleteOne } =
  require("../models/customizedOrderModel");
  const {sendOrderStatusEmail} = require('../utils/emailService');  // Import the new email service


const list = async (_req, res) => {
  try { const rows = await listAll(); res.json({ success: true, data: rows }); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
};

const create = async (req, res) => {
  try { const row = await createOne(req.body); res.status(201).json({ success: true, data: row }); }
  catch (e) { res.status(400).json({ success: false, error: e.message }); }
};

const update = async (req, res) => {
  try { const row = await updateOne(req.params.id, req.body); res.json({ success: true, data: row }); }
  catch (e) { res.status(400).json({ success: false, error: e.message }); }
};

const patchStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    // Update order status in the database
    const row = await updateStatus(orderId, status);

    // Send email to the customer with order status update
    sendOrderStatusEmail(row.email, orderId, status);

    // Respond with the updated order data
    res.json({ success: true, data: row });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};


const remove = async (req, res) => {
  try { await deleteOne(req.params.id); res.json({ success: true }); }
  catch (e) { res.status(404).json({ success: false, error: e.message }); }
};

module.exports = { list, create, update, patchStatus, remove };
