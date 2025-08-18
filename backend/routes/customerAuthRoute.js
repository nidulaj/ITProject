const express = require('express');
const router = express.Router();

const {registerCustomer, loginCustomer, updateUserProfile} = require('../controllers/customerAuthController');

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.put('/profile', updateUserProfile);

module.exports = router;