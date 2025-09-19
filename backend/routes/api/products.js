const express = require('express');
const router = express.Router();
const { auth, admin } = require('../../middleware/auth');

// Product Model
const Product = require('../../models/Product');

// @route   GET api/products
// @desc    Get All Products
// @access  Private
router.get('/', auth, (req, res) => {
  Product.find({ disabled: false })
    .sort({ createdAt: -1 })
    .then(products => res.json(products));
});

// @route   GET api/products/:id
// @desc    Get A Product
// @access  Private
router.get('/:id', auth, (req, res) => {
  Product.findById(req.params.id)
    .then(product => res.json(product))
    .catch(err => res.status(404).json({ success: false }));
});

// @route   POST api/products
// @desc    Create A Product
// @access  Admin
router.post('/', [auth, admin], (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    category: req.body.category,
    brand: req.body.brand,
    supplier: req.body.supplier,
    costPrice: req.body.costPrice,
    sellingPrice: req.body.sellingPrice,
    stockQuantity: req.body.stockQuantity,
    reorderLevel: req.body.reorderLevel,
    barcode: req.body.barcode,
    qrCode: req.body.qrCode
  });

  newProduct.save().then(product => res.json(product));
});

// @route   PUT api/products/:id
// @desc    Update A Product
// @access  Admin
router.put('/:id', [auth, admin], (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(product => res.json(product))
    .catch(err => res.status(404).json({ success: false }));
});

// @route   DELETE api/products/:id
// @desc    Disable A Product
// @access  Admin
router.delete('/:id', [auth, admin], (req, res) => {
  Product.findByIdAndUpdate(req.params.id, { disabled: true }, { new: true })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ success: false }));
});

// @route   POST api/products/purchase
// @desc    Record a stock purchase
// @access  Private
router.post('/purchase', auth, (req, res) => {
    const { productId, quantity } = req.body;
    Product.findByIdAndUpdate(productId, { $inc: { stockQuantity: quantity } }, { new: true })
        .then(product => res.json(product))
        .catch(err => res.status(400).json({ success: false, error: err }));
});

// @route   POST api/products/sale
// @desc    Record a sale
// @access  Private
router.post('/sale', auth, (req, res) => {
    const { productId, quantity } = req.body;
    Product.findByIdAndUpdate(productId, { $inc: { stockQuantity: -quantity } }, { new: true })
        .then(product => res.json(product))
        .catch(err => res.status(400).json({ success: false, error: err }));
});


module.exports = router;
