const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "No access token provided" });
  }

    try {
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user;
        next();
    } catch (error) {
        console.error("Invalid access token:", error);
        return res.status(403).json({ message: "Invalid access token" });
  }
}

function tempMiddleware(req, res, next) {
  const token = req.cookies.tempToken;

  if (!token) {
    return res.status(401).json({ message: "No temp token provided" });
  }

    try {
        const user = jwt.verify(token, process.env.TEMP_TOKEN_SECRET);
        req.user = user;
        next();
    } catch (error) {
        console.error("Invalid temp token:", error);
        return res.status(403).json({ message: "Invalid temp token" });
  }
}

module.exports = { authMiddleware, tempMiddleware };
