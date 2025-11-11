/* Creates auth token with correct payload */
require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET_KEY = "lkasjf:I:lkjslkja23la9a:"; //process.env.JWT_SECRET;

function createAuthToken(payload, expiresInDays = 7) {
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: `${expiresInDays}d`,
  });
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(now.getDate() + expiresInDays);
  return { token: token, expiresAt: expiresAt.toISOString() };
}
module.exports = createAuthToken;
