const express = require("express");
const router = express.Router();
const {
  requestIngredients,
  fetchAllReqIngredients,
  deleteRequest,
  updateRequest,
  updateRequestStatus,
} = require("../controllers/reqIngredientsController");

// CREATE
router.post("/", requestIngredients);

// READ ALL
router.get("/", fetchAllReqIngredients);

// DELETE
router.delete("/:req_id", deleteRequest);

// UPDATE
router.put("/:req_id", updateRequest);

//check status update
router.patch("/:req_id/status", updateRequestStatus);

module.exports = router;
