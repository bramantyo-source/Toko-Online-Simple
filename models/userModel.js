const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'data', 'users.json');

/**
 * Read all users from the JSON database
 * @returns {Array} Array of user objects
 */
const readUsers = () => {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH));
    } catch (err) {
        return [];
    }
};

/**
 * Write users array to the JSON database
 * @param {Array} users - Array of user objects
 */
const writeUsers = (users) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
};

/**
 * Find a user by email
 * @param {string} email - User email
 * @returns {Object|undefined} User object or undefined
 */
const findByEmail = (email) => {
    const users = readUsers();
    return users.find(u => u.email === email);
};

/**
 * Find a user by referral code
 * @param {string} code - Referral code
 * @returns {Object|undefined} User object or undefined
 */
const findByReferralCode = (code) => {
    const users = readUsers();
    return users.find(u => u.myReferralCode === code);
};

/**
 * Generate a unique 6-character referral code
 */
const generateReferralCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // 3 bytes = 6 hex chars
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Object} Created user
 */
const createUser = (userData) => {
    const users = readUsers();

    // Ensure unique referral code
    let refCode = generateReferralCode();
    while (users.find(u => u.myReferralCode === refCode)) {
        refCode = generateReferralCode();
    }

    const newUser = {
        email: userData.email,
        password: userData.password,
        role: userData.role || 'ROLE_CUSTOMER', // Default role updated
        myReferralCode: refCode,
        referredBy: userData.referredBy || null,
        rewardBalance: 0,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeUsers(users);
    return newUser;
};

/**
 * Update user data
 * @param {string} email - Email of user to update
 * @param {Object} updates - Fields to update
 */
const updateUser = (email, updates) => {
    const users = readUsers();
    const index = users.findIndex(u => u.email === email);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        writeUsers(users);
        return users[index];
    }
    return null;
};

module.exports = {
    readUsers,
    writeUsers,
    findByEmail,
    findByReferralCode,
    createUser,
    updateUser
};
