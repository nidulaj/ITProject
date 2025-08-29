const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.cus_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXP });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.cus_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXP });
};

const generateTempToken = (user) => {
    return jwt.sign({ id: user.cus_id }, process.env.TEMP_TOKEN_SECRET, { expiresIn: process.env.TEMP_TOKEN_EXP });
};

const generateEmailVerificationToken = (user) => {
    return jwt.sign({ id: user.cus_id }, process.env.EMAIL_TOKEN_SECRET, { expiresIn: process.env.EMAIL_TOKEN_EXP });
};

module.exports = { generateAccessToken, generateRefreshToken, generateTempToken, generateEmailVerificationToken };