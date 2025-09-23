const express = require("express");
const router = express.Router();
const multer = require("multer");
const paymentController = require("../controllers/paymentController");
const upload = require("../middlewares/uploadMiddleware");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});


router.post("/", upload.single("payment_proof"), paymentController.addPayment);

router.get("/", paymentController.getPayments);

router.put("/status/:id", paymentController.updatePaymentStatus);

module.exports = router;

