const express = require('express');
const { registerAdmin, loginAdmin, getAdminProfile } = require('../controllers/adminController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

// Admin authentication routes
router.post('/register', registerAdmin); // Remove in production or add super-admin protection
router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);

module.exports = router;
