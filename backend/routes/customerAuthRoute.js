const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {registerCustomer, loginCustomer, updateUserProfile, selfDeleteUserProfile, refreshToken, logout } = require('../controllers/customerAuthController');

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.put('/profile', authMiddleware, updateUserProfile);
router.put('/profile/delete', authMiddleware, selfDeleteUserProfile);
router.post('/refresh', authMiddleware, refreshToken);
router.post('/logout', authMiddleware, logout);

module.exports = router;