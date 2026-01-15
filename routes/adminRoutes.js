const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Update Role to ROLE_ADMIN
// Non-admin users will receive 403 Forbidden

// Admin dashboard
router.get('/dashboard', authenticateToken, authorizeRole('ROLE_ADMIN'), adminController.getDashboard);

// Additional admin routes can be added here
// router.get('/users', authenticateToken, authorizeRole('ROLE_ADMIN'), adminController.getUsers);

module.exports = router;
