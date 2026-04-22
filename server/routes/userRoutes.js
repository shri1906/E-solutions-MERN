const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserOrders
} = require('../controllers/userController.js');
const { protectUser } = require('../middleware/userAuth.js');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protectUser, getUserProfile);
router.put('/profile', protectUser, updateUserProfile);
router.get('/orders', protectUser, getUserOrders);

module.exports = router;
