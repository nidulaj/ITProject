const jwt = require('jsonwebtoken');

function staffAuthMiddleware(req, res, next) {
  const token = req.cookies.accessToken || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const staff = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!staff.role) {
      return res.status(403).json({ message: "Not a staff token" });
    }
    req.user = staff; // { id, role }
    next();
  } catch (error) {
    console.error("Invalid staff access token:", error);
    return res.status(403).json({ message: "Invalid access token" });
  }
}

function staffTempMiddleware(req, res, next) {
  const token = req.cookies.tempToken;

  if (!token) {
    return res.status(401).json({ message: "No temp token provided" });
  }

  try {
    const staff = jwt.verify(token, process.env.TEMP_TOKEN_SECRET);
    if (!staff.role) {
      return res.status(403).json({ message: "Not a staff temp token" });
    }
    req.user = staff;
    next();
  } catch (error) {
    console.error("Invalid staff temp token:", error);
    return res.status(403).json({ message: "Invalid temp token" });
  }
}

module.exports = {
  staffAuthMiddleware,
  staffTempMiddleware,
};
