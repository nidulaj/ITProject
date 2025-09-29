const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const paymentController = require("../controllers/paymentController");
const upload = require("../middlewares/uploadMiddleware");
const { staffAuthMiddleware } = require("../middlewares/staffAuthMiddleware");
const { authMiddleware } = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});


router.post("/", authMiddleware, upload.single("payment_proof"), paymentController.addPayment);

router.get("/", staffAuthMiddleware, paymentController.getPayments);

router.put("/status/:id", staffAuthMiddleware, paymentController.updatePaymentStatus);


module.exports = router;
