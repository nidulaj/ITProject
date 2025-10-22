const model = require("../models/icodeModel");

const addIcode = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    const icode = await model.createIcode(name);
    res.status(201).json(icode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getIcodes = async (req, res) => {
  try {
    const icodes = await model.getAllIcodes();
    res.json(icodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateIcode = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updated = await model.updateIcode(id, name);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteIcode = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await model.deleteIcode(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addIcode,
  getIcodes,
  updateIcode,
  deleteIcode,
};
