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

// module.exports = router;
const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const { pool } = require("../db/dbConnect");

// Helper: safely format dates
const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

// GET /api/ingredientReport?search=term
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    // Base query
    let query = `
      SELECT i.ingredient_id, ic.ingredient_code, ic.name AS icode_name,
             i.quantity, i.expiry_date, i.storage_zone_id, i.created_at
      FROM ingredients i
      JOIN icode ic ON i.icode_id = ic.ingredient_id
    `;
    const params = [];

    // Filter by search term (code or name)
    if (search) {
      query += ` WHERE LOWER(ic.ingredient_code) LIKE $1 OR LOWER(ic.name) LIKE $2`;
      params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    query += ` ORDER BY i.ingredient_id`;

    const result = await pool.query(query, params);

    // PDF headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=ingredients_report.pdf");

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    doc.pipe(res);

    // Title
    doc.fontSize(18).text("Ingredient Report", { align: "center" });
    if (search) doc.fontSize(12).text(`Filtered by: "${search}"`, { align: "center" });
    doc.moveDown(1);

    // Table columns
    const tableTop = doc.y;
    const itemX = {
      id: 50,
      code: 90,
      name: 160,
      qty: 300,
      expiry: 350,
      zone: 420,
      created: 480,
    };

    // Draw header
    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("ID", itemX.id, tableTop);
    doc.text("ICode", itemX.code, tableTop);
    doc.text("Name", itemX.name, tableTop);
    doc.text("Qty", itemX.qty, tableTop);
    doc.text("Expiry", itemX.expiry, tableTop);
    doc.text("Zone", itemX.zone, tableTop);
    doc.text("Created", itemX.created, tableTop);
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Rows
    doc.font("Helvetica").fontSize(10);
    let y = tableTop + 20;

    result.rows.forEach((ing) => {
      doc.text(ing.ingredient_id ?? "-", itemX.id, y);
      doc.text(ing.ingredient_code ?? "-", itemX.code, y);
      doc.text(ing.icode_name ?? "-", itemX.name, y);
      doc.text(ing.quantity != null ? String(ing.quantity) : "-", itemX.qty, y);
      doc.text(formatDate(ing.expiry_date), itemX.expiry, y);
      doc.text(ing.storage_zone_id ?? "-", itemX.zone, y);
      doc.text(formatDate(ing.created_at), itemX.created, y);
      y += 20;

      doc.moveTo(50, y - 5).lineTo(550, y - 5).strokeColor("#aaaaaa").stroke();
    });

    if (result.rows.length === 0) {
      doc.moveDown().text("No results found for the search term.", { align: "center" });
    }

    doc.end();
  } catch (err) {
    console.error("Error generating report:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Error generating report" });
    }
  }
});

module.exports = router;
