const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);