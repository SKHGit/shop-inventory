const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { auth } = require('../../middleware/auth');
const Product = require('../../models/Product');

// @route   GET api/reports/stock/excel
// @desc    Generate Excel report of stock levels
// @access  Private
router.get('/stock/excel', auth, async (req, res) => {
  try {
    const products = await Product.find({ disabled: false });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Stock Levels');

    worksheet.columns = [
      { header: 'ID', key: '_id', width: 30 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Stock Quantity', key: 'stockQuantity', width: 15 },
      { header: 'Reorder Level', key: 'reorderLevel', width: 15 },
    ];

    products.forEach(product => {
      worksheet.addRow(product);
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'stock_levels.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/reports/lowstock/pdf
// @desc    Generate PDF report of low stock items
// @access  Private
router.get('/lowstock/pdf', auth, async (req, res) => {
  try {
    const products = await Product.find({
      disabled: false,
      $expr: { $lte: ['$stockQuantity', '$reorderLevel'] }
    });

    const doc = new PDFDocument();
    let filename = 'low_stock_report.pdf';
    filename = encodeURIComponent(filename);
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    doc.fontSize(25).text('Low Stock Report', { align: 'center' });

    products.forEach(product => {
      doc.fontSize(12).text(
        `Name: ${product.name}, Stock: ${product.stockQuantity}, Reorder Level: ${product.reorderLevel}`
      );
    });

    doc.pipe(res);
    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
