// Load environment variables
require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');

const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Import middleware
const { authenticateToken, authorizeRole } = require('./middleware/authMiddleware');
const { generateCsrfToken, validateCsrfToken } = require('./middleware/csrfMiddleware');
const adminController = require('./controllers/adminController');

const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// 1. Security Headers dengan Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// ============================================
// BASIC MIDDLEWARE
// ============================================

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// ============================================
// CSRF PROTECTION
// ============================================

// Endpoint to get CSRF token
app.get('/api/csrf-token', generateCsrfToken);

// Apply CSRF validation to all POST/PUT/DELETE requests
// Note: You can enable this globally by uncommenting:
// app.use('/api', validateCsrfToken);

// ============================================
// ROUTES
// ============================================

// Auth routes: /api/register, /api/login, /api/profile
app.use('/api', authRoutes);

// Order routes: /api/checkout
app.use('/api', orderRoutes);

// Admin routes: /admin/* (protected with role-based auth)
app.use('/admin', adminRoutes);

// Management Orders route (protected - admin only)
app.get('/management-orders', authenticateToken, authorizeRole('admin'), adminController.getManagementOrders);

// ============================================
// CUSTOM 404 ERROR PAGE
// ============================================

// This must be the LAST route - catches all unmatched routes
app.use((req, res) => {
    // For API routes, return JSON
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            message: "Endpoint tidak ditemukan"
        });
    }
    // For other routes, serve custom 404 page
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ============================================
// SERVER START
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
    console.log('🔒 Security features aktif:');
    console.log('   - Password hashing (bcrypt)');
    console.log('   - Password validation (min 8 char + special char)');
    console.log('   - Rate limiting (5 req/15 min)');
    console.log('   - Security headers (Helmet)');
    console.log('   - Input validation');
    console.log('   - Role-based access control (RBAC)');
    console.log('   - CSRF protection ready');
    console.log('   - Custom 404 error page');
    console.log('');
    console.log('📁 MVC Structure:');
    console.log('   - controllers/');
    console.log('   - models/');
    console.log('   - routes/');
    console.log('   - middleware/');
});