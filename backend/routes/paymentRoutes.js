const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Add a payment
router.post("/", paymentController.addPayment);

// Get all payments
router.get("/", paymentController.getPayments);

// Delete a payment by id
router.delete("/:id", paymentController.removePayment);

module.exports = router;
