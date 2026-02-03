const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function(req, res, next) {
  // 1. Get the token from the header
  const token = req.header("token");

  // 2. Check if no token exists
  if (!token) {
    return res.status(403).json("Not Authorized");
  }

  // 3. Verify the token
  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verify.user; // Adds the user_id to the request
    next();
  } catch (err) {
    res.status(401).json("Token is not valid");
  }
};