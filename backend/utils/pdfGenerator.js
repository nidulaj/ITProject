const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateReturnPDF = (returnsData) => {
  const doc = new PDFDocument();

  // Stream the PDF to a file (or send it directly to the response in Express)
  const filePath = `./public/returns/${returnsData.id}_return.pdf`;
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Add document header
  doc.fontSize(18).text('Return Details', { align: 'center' });

  // Add return data
  doc.fontSize(12).text(`Return ID: ${returnsData.id}`);
  doc.text(`Product: ${returnsData.product}`);
  doc.text(`Customer: ${returnsData.customer}`);
  doc.text(`Phone: ${returnsData.phone}`);
  doc.text(`Reason: ${returnsData.reason}`);
  if (returnsData.image_url) {
    doc.text(`Image URL: ${returnsData.image_url}`);
  }
  doc.text(`Status: ${returnsData.status}`);

  // Finalize the PDF file
  doc.end();

  return filePath; // Return the file path for downloading or sending to the client
};

module.exports = generateReturnPDF;
