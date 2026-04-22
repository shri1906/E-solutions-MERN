const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductAvailability
} = require('../controllers/productController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (Admin only)
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.patch('/:id/availability', protect, toggleProductAvailability);

module.exports = router;
