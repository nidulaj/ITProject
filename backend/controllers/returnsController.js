const { createReturn, listReturns, updateReturn, updateStatus, deleteReturn } = require("../models/returnsModel");

// Create a new return (with image upload)
const create = async (req, res) => {
  try {
    const row = await createReturn(req.body, req.file);  // Pass the uploaded file (req.file) to the model
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// List all returns
const list = async (_req, res) => {
  try {
    const rows = await listReturns();
    res.json({ success: true, data: rows });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

// Update an existing return (with image upload)
const update = async (req, res) => {
  try {
    const row = await updateReturn(req.params.id, req.body, req.file);  // Pass the uploaded file (req.file) to the model
    res.json({ success: true, data: row });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// Update the status of a return (accept/reject/pending)
const patchStatus = async (req, res) => {
  try {
    const row = await updateStatus(req.params.id, req.body.status);
    res.json({ success: true, data: row });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// Delete a return
const remove = async (req, res) => {
  try {
    await deleteReturn(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(404).json({ success: false, error: e.message });
  }
};

module.exports = { create, list, update, patchStatus, remove };
