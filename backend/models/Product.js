import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String },
  supplier: { type: String },
  hsn: { type: String },
  basePrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  stockQuantity: { type: Number, required: true, default: 0 },
  reorderLevel: { type: Number, default: 0 },
  barcode: { type: String },
  qrCode: { type: String },
  disabled: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.model('product', ProductSchema);
export default Product;