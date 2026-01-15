const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev_key_123';

/**
 * Middleware to authenticate JWT token
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Akses ditolak! Token tidak ditemukan."
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Token tidak valid!"
            });
        }

        // Attach user info to request
        const user = UserModel.findByEmail(decoded.email);
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "User tidak ditemukan!"
            });
        }

        req.user = {
            email: user.email,
            role: user.role || 'ROLE_CUSTOMER'
        };
        next();
    });
};

/**
 * Middleware to authorize based on role
 * Returns 403 Forbidden if user doesn't have required role
 * @param  {...string} allowedRoles - Roles that are allowed to access
 */
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Akses ditolak! Silakan login terlebih dahulu."
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Anda tidak memiliki akses ke halaman ini."
            });
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRole
};
