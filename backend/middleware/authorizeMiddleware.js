/* Checks if jwt token is authenticated and use has specified role */
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;
function authorize(roles) {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, data) => {
      if (err) {
        return res
          .status(401)
          .json({ error: "Unauthorized - token cannot be verified" });
      }
      if (!roles.includes(data.role)) {
        return res.status(403).json({
          error: "Forbidden - user does not have permission to access endpoint",
        });
      }
      req.user = data;
      next();
    });
  };
}

module.exports = authorize;
