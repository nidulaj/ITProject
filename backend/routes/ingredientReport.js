// const express = require("express");
// const router = express.Router();
// const PDFDocument = require("pdfkit");
// const { pool } = require("../db/dbConnect");

// // Helper: safely format dates
// const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

// // GET /api/ingredientReport
// router.get("/", async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT i.ingredient_id, ic.ingredient_code, ic.name AS icode_name,
//              i.quantity, i.expiry_date, i.storage_zone_id, i.created_at
//       FROM ingredients i
//       JOIN icode ic ON i.icode_id = ic.ingredient_id
//       ORDER BY i.ingredient_id
//     `);

//     // PDF headers
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=ingredients_report.pdf"
//     );

//     const doc = new PDFDocument({ margin: 30, size: "A4" });
//     doc.pipe(res);

//     // Title
//     doc.fontSize(18).text("Ingredient Report", { align: "center" });
//     doc.moveDown(1);

//     // Table columns
//     const tableTop = doc.y;
//     const itemX = {
//       id: 50,
//       code: 90,
//       name: 160,
//       qty: 300,
//       expiry: 350,
//       zone: 420,
//       created: 480,
//     };

//     // Draw table header
//     doc.fontSize(12).font("Helvetica-Bold");
//     doc.text("ID", itemX.id, tableTop);
//     doc.text("ICode", itemX.code, tableTop);
//     doc.text("Name", itemX.name, tableTop);
//     doc.text("Qty", itemX.qty, tableTop);
//     doc.text("Expiry", itemX.expiry, tableTop);
//     doc.text("Zone", itemX.zone, tableTop);
//     doc.text("Created", itemX.created, tableTop);

//     // Draw line under header
//     doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

//     // Table rows
//     doc.font("Helvetica").fontSize(10);
//     let y = tableTop + 20;

//     result.rows.forEach((ing) => {
//       doc.text(ing.ingredient_id ?? "-", itemX.id, y);
//       doc.text(ing.ingredient_code ?? "-", itemX.code, y);
//       doc.text(ing.icode_name ?? "-", itemX.name, y);
//       doc.text(ing.quantity != null ? String(ing.quantity) : "-", itemX.qty, y);
//       doc.text(formatDate(ing.expiry_date), itemX.expiry, y);
//       doc.text(ing.storage_zone_id ?? "-", itemX.zone, y);
//       doc.text(formatDate(ing.created_at), itemX.created, y);
//       y += 20;

//       // Add a line after each row
//       doc.moveTo(50, y - 5).lineTo(550, y - 5).strokeColor("#aaaaaa").stroke();
//     });

//     doc.end();
//   } catch (err) {
//     console.error("Error generating report:", err);
//     if (!res.headersSent) {
//       res.status(500).json({ error: "Error generating report" });
//     }
//   }
// });
const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const { pool } = require("../db/dbConnect");

// ============================
// Date formatting helpers
// ============================

// For "Generated on" line
const formatReportDateTime = (d) => {
  const date = new Date(d);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// For table columns (short format)
const formatDate = (d) => {
  if (!d) return "-";
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    // Query with optional search filter
    let query = `
      SELECT i.ingredient_id, ic.ingredient_code, ic.name AS icode_name,
             i.quantity, i.expiry_date, i.storage_zone_id, i.created_at
      FROM ingredients i
      JOIN icode ic ON i.icode_id = ic.ingredient_id
    `;
    const params = [];

    if (search) {
      query += ` WHERE LOWER(ic.ingredient_code) LIKE $1 OR LOWER(ic.name) LIKE $2`;
      params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    query += ` ORDER BY i.ingredient_id`;
    const result = await pool.query(query, params);

    // Setup PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=smart_dairy_ingredients_report.pdf");

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    doc.pipe(res);

    // ============================
    //  SMART DAIRY HEADER
    // ============================
    doc.rect(0, 0, doc.page.width, 80)
      .fill("#003366"); // Navy header bar

    doc.fillColor("#ffffff")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("Smart Dairy", 50, 25, { align: "left" });

    doc.fontSize(14)
      .text("Ingredient Report", 0, 30, { align: "right", width: doc.page.width - 50 });

    // Date and search filter info
    doc.fontSize(10)
      .text(`Generated on: ${formatReportDateTime(new Date())}`, 50, 60)
      .text(search ? `Filtered by: "${search}"` : "", 0, 60, { align: "right" });

    // Reset color for table
    doc.fillColor("#000000");
    doc.moveDown(2);

    // ============================
    // TABLE HEADER
    // ============================
    const tableTop = 120;
    const colX = {
      id: 50,
      code: 90,
      name: 160,
      qty: 300,
      expiry: 360,
      zone: 440,
      created: 520,
    };

    // Header background
    doc.rect(40, tableTop - 10, 520, 25).fill("#e0f0ff");
    doc.fillColor("#003366").font("Helvetica-Bold").fontSize(11);

    // Header text
    doc.text("ID", colX.id, tableTop, { width: 30, align: "center" });
    doc.text("ICode", colX.code, tableTop, { width: 60, align: "center" });
    doc.text("Name", colX.name, tableTop, { width: 130, align: "center" });
    doc.text("Qty", colX.qty, tableTop, { width: 50, align: "center" });
    doc.text("Expiry", colX.expiry, tableTop, { width: 70, align: "center" });
    doc.text("Zone", colX.zone, tableTop, { width: 60, align: "center" });
    doc.text("Created", colX.created, tableTop, { width: 80, align: "center" });

    doc.moveTo(40, tableTop + 15).lineTo(560, tableTop + 15).strokeColor("#003366").stroke();

    // ============================
    // TABLE BODY
    // ============================
    let y = tableTop + 25;
    const rowHeight = 20;
    let alternate = false;

    doc.font("Helvetica").fontSize(10);

    result.rows.forEach((ing) => {
      // Alternate background color
      if (alternate) {
        doc.rect(40, y - 5, 520, rowHeight).fill("#f7faff");
      }
      alternate = !alternate;

      doc.fillColor("#000000");
      doc.text(String(ing.ingredient_id ?? "-"), colX.id, y, { width: 30, align: "center" });
      doc.text(ing.ingredient_code ?? "-", colX.code, y, { width: 60, align: "center" });
      doc.text(ing.icode_name ?? "-", colX.name, y, { width: 130, align: "center" });
      doc.text(String(ing.quantity ?? "-"), colX.qty, y, { width: 50, align: "center" });
      doc.text(formatDate(ing.expiry_date), colX.expiry, y, { width: 70, align: "center" });
      doc.text(String(ing.storage_zone_id ?? "-"), colX.zone, y, { width: 60, align: "center" });
      doc.text(formatDate(ing.created_at), colX.created, y, { width: 80, align: "center" });
      y += rowHeight;
    });

    if (result.rows.length === 0) {
      doc.moveDown(2)
        .font("Helvetica-Oblique")
        .fontSize(12)
        .fillColor("#555555")
        .text("No ingredients found for this filter.", { align: "center" });
    }

    // ============================
    // FOOTER
    // ============================
    doc.rect(0, doc.page.height - 50, doc.page.width, 50)
      .fill("#003366");

    doc.fillColor("#ffffff")
      .font("Helvetica")
      .fontSize(10)
      .text("© 2025 Smart Dairy | Automated Ingredient Management System",
            0, doc.page.height - 35, { align: "center", width: doc.page.width });

    doc.end();
  } catch (err) {
    console.error("Error generating report:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Error generating report" });
    }
  }
});

module.exports = router;
