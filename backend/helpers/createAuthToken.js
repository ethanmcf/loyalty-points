/* Creates auth token with correct payload */
const dotenv = require("dotenv");

// load shared root env
dotenv.config({ path: "../.env" });

const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

function createAuthToken(user, expiresInDays = 7) {
  const payload = {
    id: user.id,
    utorid: user.utorid,
    name: user.name,
    role: user.role,
  };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: `${expiresInDays}d`,
  });
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(now.getDate() + expiresInDays);
  return { token: token, expiresAt: expiresAt.toISOString() };
}
module.exports = createAuthToken;
