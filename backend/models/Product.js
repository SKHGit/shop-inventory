const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String },
  supplier: { type: String },
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  stockQuantity: { type: Number, required: true, default: 0 },
  reorderLevel: { type: Number, default: 0 },
  barcode: { type: String },
  qrCode: { type: String },
  disabled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = Product = mongoose.model('product', ProductSchema);
