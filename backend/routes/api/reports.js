import express from 'express';
const router = express.Router();
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { auth } from '../../middleware/auth.js';
import Product from '../../models/Product.js';
import Sale from '../../models/Sale.js';

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
// router.get('/lowstock/pdf', auth, async (req, res) => {
//   try {
//     const products = await Product.find({
//       disabled: false,
//       $expr: { $lte: ['$stockQuantity', '$reorderLevel'] }
//     });

//     const doc = new PDFDocument();
//     let filename = 'low_stock_report.pdf';
//     filename = encodeURIComponent(filename);
//     res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
//     res.setHeader('Content-type', 'application/pdf');

//     doc.fontSize(25).text('Low Stock Report', { align: 'center' });

//     products.forEach(product => {
//       doc.fontSize(12).text(
//         `Name: ${product.name}, Stock: ${product.stockQuantity}, Reorder Level: ${product.reorderLevel}`
//       );
//     });

//     doc.pipe(res);
//     doc.end();

//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });


// @route   GET api/reports/sales
// @desc    Generate Excel report of sales
// @access  Private
router.get('/sales', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const sales = await Sale.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).populate('product', 'name category');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales Report');

        worksheet.columns = [
            { header: 'Product Name', key: 'productName', width: 30 },
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Quantity', key: 'quantity', width: 15 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Date', key: 'date', width: 20 }
        ];

        sales.forEach(sale => {
            worksheet.addRow({
                productName: sale.product.name,
                category: sale.product.category,
                quantity: sale.quantity,
                price: sale.price,
                date: sale.date
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'sales_report.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

export default router;