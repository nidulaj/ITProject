const express = require('express');
const router = express.Router();

const {registerCustomer, loginCustomer, updateUserProfile, selfDeleteUserProfile} = require('../controllers/customerAuthController');

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.put('/profile', updateUserProfile);
router.put('/profile/delete', selfDeleteUserProfile);

module.exports = router;