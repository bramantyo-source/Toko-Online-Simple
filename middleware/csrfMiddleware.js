const crypto = require('crypto');

// Store tokens in memory (in production, use Redis or similar)
const csrfTokens = new Map();

// Clean up expired tokens every 30 minutes
setInterval(() => {
    const now = Date.now();
    for (const [token, data] of csrfTokens.entries()) {
        if (now - data.createdAt > 3600000) { // 1 hour expiry
            csrfTokens.delete(token);
        }
    }
}, 1800000);

/**
 * Generate a CSRF token for a session
 */
const generateCsrfToken = (req, res) => {
    const token = crypto.randomBytes(32).toString('hex');
    csrfTokens.set(token, { createdAt: Date.now() });
    res.json({ csrfToken: token });
};

/**
 * Middleware to validate CSRF token
 * Looks for token in 'x-csrf-token' header
 */
const validateCsrfToken = (req, res, next) => {
    // Skip CSRF check for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const token = req.headers['x-csrf-token'];

    if (!token) {
        return res.status(403).json({
            success: false,
            message: "CSRF token tidak ditemukan!"
        });
    }

    if (!csrfTokens.has(token)) {
        return res.status(403).json({
            success: false,
            message: "CSRF token tidak valid!"
        });
    }

    // Token is valid, delete it (single use)
    csrfTokens.delete(token);
    next();
};

module.exports = {
    generateCsrfToken,
    validateCsrfToken
};
