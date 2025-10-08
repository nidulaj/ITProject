const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const paymentController = require("../controllers/paymentController");
const upload = require("../middlewares/uploadMiddleware");
const { staffAuthMiddleware } = require("../middlewares/staffAuthMiddleware");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { pool } = require("../db/dbConnect");

const PDFDocument = require("pdfkit");

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

router.get("/download/pdf", staffAuthMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM payments ORDER BY payment_id DESC");
    const payments = result.rows;

    
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=payment_records.pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Payment Records Report", { align: "center" });
    doc.moveDown(2);

    payments.forEach((p, i) => {
      doc
        .fontSize(14)
        .text(`Payment #${i + 1}`, { underline: true })
        .moveDown(0.3);
      doc.fontSize(12).text(`Order ID: ${p.order_id}`);
      doc.text(`Customer: ${p.customer_name}`);
      doc.text(`Amount: Rs. ${p.amount}`);
      doc.text(`Date: ${new Date(p.payment_date).toLocaleDateString()}`);
      doc.text(`Status: ${p.payment_status}`);
      doc.moveDown(1);
    });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send("Error generating PDF");
  }
});

module.exports = router;