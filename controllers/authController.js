const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/userModel');

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev_key_123';

/**
 * Validation rules for registration
 */
const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Format email tidak valid')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password minimal 8 karakter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password harus mengandung minimal 1 karakter spesial')
];

/**
 * Validation rules for login
 */
const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Format email tidak valid')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password tidak boleh kosong')
];

/**
 * Register a new user
 */
const register = async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
    }

    const { email, password } = req.body;

    // Capture referral code from cookie
    // Cookie-parser middleware is needed in server.js to use req.cookies
    const partnerCode = req.cookies ? req.cookies['partner_code'] : null;

    try {
        // Check if email already exists
        if (UserModel.findByEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Email sudah terdaftar!"
            });
        }

        // Validate Referral Code if present
        let validReferredBy = null;
        if (partnerCode) {
            const referrer = UserModel.findByReferralCode(partnerCode);
            if (referrer) {
                validReferredBy = partnerCode;
            }
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

        // Create user with new ROLE_CUSTOMER
        const newUser = UserModel.createUser({
            email,
            password: hashedPassword,
            role: 'ROLE_CUSTOMER',
            referredBy: validReferredBy
        });

        res.json({
            success: true,
            message: "Berhasil daftar! Silakan login."
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Login user
 */
const login = async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        });
    }

    const { email, password } = req.body;

    try {
        const user = UserModel.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah!"
            });
        }

        // Verify password with bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            // Generate JWT Token with role
            const role = user.role || 'ROLE_CUSTOMER'; // Migration fallback
            const token = jwt.sign(
                { email: user.email, role: role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: "Login berhasil!",
                token,
                user: {
                    email: user.email,
                    role: role,
                    joinedAt: user.createdAt,
                    myReferralCode: user.myReferralCode || '-',
                    rewardBalance: user.rewardBalance || 0
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Email atau password salah!"
            });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Get user profile (protected route)
 */
const getProfile = (req, res) => {
    try {
        const user = UserModel.findByEmail(req.user.email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        // Return user data
        res.json({
            success: true,
            user: {
                email: user.email,
                role: user.role || 'ROLE_CUSTOMER',
                joinedAt: user.createdAt,
                myReferralCode: user.myReferralCode || '-',
                rewardBalance: user.rewardBalance || 0,
                referredBy: user.referredBy || '-'
            }
        });
    } catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

module.exports = {
    registerValidation,
    loginValidation,
    register,
    login,
    getProfile
};
