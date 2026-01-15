const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Protected Route: Only authenticated users can checkout
router.post('/checkout', authenticateToken, orderController.checkout);

module.exports = router;
