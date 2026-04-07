const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Product name must be at least 3 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    minlength: [10, 'Product description must be at least 10 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be a positive number']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  inventory: {
    type: Number,
    required: [true, 'Inventory quantity is required'],
    min: [0, 'Inventory cannot be negative'],
    default: 0
  },
  images: {
    type: [String],
    default: []
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index on createdAt for sorting newest first
productSchema.index({ createdAt: -1 });

// Text indexes on name and description for search
productSchema.index({ name: 'text', description: 'text' });

// Index on category for filtering
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);
