const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Hardware', 'Software', 'Services', 'Networking', 'Security', 'Other']
  },
  image: {
    type: String,
    default: '/placeholder-product.jpg'
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
