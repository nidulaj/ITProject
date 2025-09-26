const express = require("express");
const router = express.Router();
const multer = require("multer");
const paymentController = require("../controllers/paymentController");
const upload = require("../middlewares/uploadMiddleware");
const { staffAuthMiddleware } = require("../middlewares/staffAuthMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});


router.post("/", staffAuthMiddleware, upload.single("payment_proof"), paymentController.addPayment);

router.get("/", staffAuthMiddleware, paymentController.getPayments);

router.put("/status/:id", staffAuthMiddleware, paymentController.updatePaymentStatus);




module.exports = router;

