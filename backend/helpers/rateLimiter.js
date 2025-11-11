const coolDownTime = 60 * 1000;
const lastRequest = {};

function checkRateLimit(req) {
  const now = Date.now();
  if (lastRequest[req.ip] && now - lastRequest[req.ip] < coolDownTime) {
    return false;
  }
  lastRequest[req.ip] = now;
  return true;
}

module.exports = checkRateLimit;
