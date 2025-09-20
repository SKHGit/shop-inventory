const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SaleSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Sale = mongoose.model('sale', SaleSchema);
