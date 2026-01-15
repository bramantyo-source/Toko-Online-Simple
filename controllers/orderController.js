const UserModel = require('../models/userModel');

/**
 * Checkout logic
 * POST /api/checkout
 */
const checkout = (req, res) => {
    try {
        const user = UserModel.findByEmail(req.user.email);
        const { amount, productId } = req.body;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 1. Process Order (Simplify: Just log it)
        // In real app: save to orderModel
        console.log(`[ORDER] User: ${user.email}, Amount: ${amount}, Item: ${productId}`);

        // 2. Reward Logic
        if (user.referredBy) {
            const referrer = UserModel.findByReferralCode(user.referredBy);
            if (referrer) {
                const bonus = amount * 0.02; // 2% reward

                // Update referrer balance
                const currentBalance = referrer.rewardBalance || 0;
                UserModel.updateUser(referrer.email, {
                    rewardBalance: currentBalance + bonus
                });

                console.log(`[REWARD] Sent ${bonus} to ${referrer.email}`);
            }
        }

        res.json({
            success: true,
            message: "Pesanan berhasil dibuat!",
            data: {
                orderId: 'ORD-' + Date.now(),
                amount: amount
            }
        });

    } catch (err) {
        console.error('Checkout error:', err);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

module.exports = {
    checkout
};
