const UserModel = require('../models/userModel');

/**
 * Admin Dashboard - Get all users (admin only)
 */
const getDashboard = (req, res) => {
    try {
        const users = UserModel.readUsers();

        // Return users without passwords (NEVER expose passwords!)
        const safeUsers = users.map(u => ({
            email: u.email,
            role: u.role || 'ROLE_CUSTOMER',
            myReferralCode: u.myReferralCode || '-',
            rewardBalance: u.rewardBalance || 0,
            createdAt: u.createdAt
        }));

        res.json({
            success: true,
            message: "Admin Dashboard",
            data: {
                totalUsers: safeUsers.length,
                users: safeUsers
            }
        });
    } catch (err) {
        console.error('Admin dashboard error:', err);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

/**
 * Management Orders - Placeholder for order management (admin only)
 */
const getManagementOrders = (req, res) => {
    res.json({
        success: true,
        message: "Management Orders Page",
        data: {
            orders: [],
            note: "Fitur pesanan akan dikembangkan lebih lanjut"
        }
    });
};

module.exports = {
    getDashboard,
    getManagementOrders
};
