import express from 'express';
const router = express.Router();
import { auth } from '../../middleware/auth.js';

// Product Model
import Product from '../../models/Product.js';
import Sale from '../../models/Sale.js';

// @route   GET api/products
// @desc    Get All Products
// @access  Private
router.get('/', auth, (req, res) => {
  Product.find({ disabled: false })
    .sort({ createdAt: -1 })
    .then(products => res.json(products));
});

// @route   GET api/products/check-exists
// @desc    Check if a product exists
// @access  Private
router.get('/check-exists', auth, (req, res) => {
  Product.findOne({ name: req.query.name })
    .then(product => {
      if (product) {
        return res.json({ exists: true });
      }
      res.json({ exists: false });
    })
    .catch(err => res.status(500).json({ success: false, error: err }));
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
// @access  Private (Admin or Staff)
router.post('/', auth, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ msg: 'Access denied.' });
  }
  const newProduct = new Product({
    name: req.body.name,
    category: req.body.category,
    brand: req.body.brand,
    supplier: req.body.supplier,
    hsn: req.body.hsn,
    basePrice: req.body.basePrice,
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
// @access  Private (Admin or Staff)
router.put('/:id', auth, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ msg: 'Access denied.' });
  }
  Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(product => res.json(product))
    .catch(err => res.status(404).json({ success: false }));
});

// @route   DELETE api/products/:id
// @desc    Disable A Product
// @access  Private (Admin or Staff)
router.delete('/:id', auth, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ msg: 'Access denied.' });
  }
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
router.post('/sale', auth, async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        if (product.stockQuantity < quantity) {
            return res.status(400).json({ msg: 'Not enough stock' });
        }

        const newSale = new Sale({
            product: productId,
            quantity,
            price: product.sellingPrice
        });

        await newSale.save();

        product.stockQuantity -= quantity;
        await product.save();

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


export default router;