const PDFDocument = require('pdfkit');
const { getAllZones } = require('../models/storeModel');

// Helper to format dates safely
const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '-');

const generateZonesPDF = async (req, res) => {
  try {
    const zones = await getAllZones();

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Disposition', 'attachment; filename="zones.pdf"');
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    // Title
    doc.fontSize(18).text('Storage Zones Report', { align: 'center' });
    doc.moveDown(1.5);

    // Column positions
    const tableTop = doc.y;
    const colX = {
      id: 50,
      name: 120,
      capacity: 300,
      used: 380,
      created: 460,
    };

    // Table header
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('ID', colX.id, tableTop);
    doc.text('Zone Name', colX.name, tableTop);
    doc.text('Capacity', colX.capacity, tableTop);
    doc.text('Used', colX.used, tableTop);
    doc.text('Created At', colX.created, tableTop);

    // Draw line under header
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table rows
    doc.font('Helvetica').fontSize(10);
    let y = tableTop + 20;

    zones.forEach((zone) => {
      doc.text(zone.storage_zone_id ?? '-', colX.id, y);
      doc.text(zone.zone_name ?? '-', colX.name, y);
      doc.text(zone.capacity ?? '-', colX.capacity, y);
      doc.text(zone.used_capacity ?? '-', colX.used, y);
      doc.text(formatDate(zone.created_at), colX.created, y);
      y += 20;

      // Row separation line
      doc.moveTo(50, y - 5).lineTo(550, y - 5).strokeColor('#aaaaaa').stroke();
    });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = generateZonesPDF;
