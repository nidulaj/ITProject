const {
  createReqIngredients,
  getAllReqIngredients,
  deleteReqIngredients,
  updateReqIngredients,
  updateReqStatus,
} = require("../models/reqIngredientsModel");

// CREATE
const requestIngredients = async (req, res) => {
  try {
    const { recipe_no, quantity } = req.body;
    const reqData = await createReqIngredients(recipe_no, quantity);
    res.status(201).json({ message: "Request created", data: reqData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// READ ALL
const fetchAllReqIngredients = async (req, res) => {
  try {
    const allRequests = await getAllReqIngredients();
    res.status(200).json({ data: allRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// DELETE
const deleteRequest = async (req, res) => {
  try {
    const { req_id } = req.params;
    await deleteReqIngredients(req_id);
    res.status(200).json({ message: "Request deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete request" });
  }
};

// UPDATE quantity (now validates)
const updateRequest = async (req, res) => {
  try {
    const { req_id } = req.params;
    const { quantity } = req.body;

    // guard: body must include quantity as a positive int
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ error: "quantity must be a positive integer" });
    }

    const updated = await updateReqIngredients(req_id, qty);
    res.status(200).json({ message: "Request updated", data: updated });
  } catch (err) {
    console.error("updateRequest error:", err);
    res.status(500).json({ error: "Failed to update request" });
  }
};

//status update check
// NEW: UPDATE status (e.g., pending -> accept)
const updateRequestStatus = async (req, res) => {
  try {
    const { req_id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: "status is required" });

    const updated = await updateReqStatus(req_id, status);
    res.status(200).json({ message: "Status updated", data: updated });
  } catch (err) {
    console.error("updateRequestStatus error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};



module.exports = {
  requestIngredients,
  fetchAllReqIngredients,
  deleteRequest,
  updateRequest,
  updateRequestStatus,
};
