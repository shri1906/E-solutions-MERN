const express = require('express');
const {
  createRazorpayOrder,
  verifyPayment,
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

// Public routes
router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-payment', verifyPayment);
router.post('/', createOrder);
router.get('/:id', getOrderById);

// Protected routes (Admin only)
router.get('/', protect, getOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
