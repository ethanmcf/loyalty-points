const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

const checkRateLimit = require("../helpers/rateLimiter");
const createAuthToken = require("../helpers/createAuthToken");
const containsExtraFields = require("../helpers/extraFieldValidation");

const express = require("express");
const router = express.Router();

router.post("/tokens", async (req, res) => {
  // Verify no extra body parameters
  const allowedFields = ["utorid", "password"];
  if (containsExtraFields(allowedFields, req.body)) {
    return res
      .status(400)
      .json({ error: "Bad request - extra fields present" });
  }
  // Verify params exists
  if (!req.body.utorid || !req.body.password) {
    return res
      .status(400)
      .json({ error: "Bad request - must include utorid and password" });
  }
  // Authenticate user exists and passwords match
  const user = await prisma.user.findUnique({
    where: { utorid: req.body.utorid },
  });
  if (!user || user.password !== req.body.password) {
    return res.status(401).json({ error: "Can't authenticate" });
  }

  // Create and update user token
  const { token, expiresAt } = createAuthToken(user);
  await prisma.user.update({
    where: { id: user.id },
    data: { token: token, expiresAt: expiresAt, activated: true },
  });
  return res.status(200).json({ token: token, expiresAt: expiresAt });
});

router.post("/resets/:resetToken", async (req, res) => {
  // Verify qeury param
  if (!req.params.resetToken) {
    res.status(404).json({ error: "Reset token not found" });
  }

  // Verify body fields
  const allowedFields = ["utorid", "password"];
  if (containsExtraFields(allowedFields, req.body)) {
    return res
      .status(400)
      .json({ error: "Bad request - extra fields present" });
  }
  // Verify utorid exists and user exists
  if (!req.body.utorid) {
    return res.status(400).json({ error: "Bad request - must include utorid" });
  }

  // Get owner of passed token
  const tokenOwner = await prisma.user.findFirst({
    where: { resetToken: req.params.resetToken },
  });
  if (!tokenOwner) {
    return res.status(404).json({ error: "Reset token not found" });
  }

  // Verify user exits with utorid
  const user = await prisma.user.findUnique({
    where: { utorid: req.body.utorid },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Verify token belongs to user
  if (tokenOwner.id !== user.id) {
    return res.status(401).json({ error: "Reset token does not match utorid" });
  }

  // Verify password
  // reference: ai.txt (3)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,20}$/;
  if (!req.body.password || !passwordRegex.test(req.body.password)) {
    return res.status(400).json({ error: "Bad request - password not valid" });
  }

  // Verify reset token has not expired
  const now = new Date();
  const resetExpiresAt = new Date(tokenOwner.resetExpiresAt);
  if (isNaN(resetExpiresAt.getTime()) || resetExpiresAt < now) {
    return res.status(410).json({ error: "Reset token expired" });
  }

  // Success - update user password
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: req.body.password,
      lastLogin: now.toISOString(),
    },
  });
  return res.status(200).send();
});

router.post("/resets", async (req, res) => {
  // Verify no extra body parameters
  const allowedFields = ["utorid"];
  if (containsExtraFields(allowedFields, req.body)) {
    return res
      .status(400)
      .json({ error: "Bad request - extra fields present" });
  }
  // Verify params exist
  if (!req.body.utorid) {
    return res.status(400).json({ error: "Bad request - must include utorid" });
  }

  // Verify user exists with utorid
  const user = await prisma.user.findUnique({
    where: { utorid: req.body.utorid },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  // Check rate limit
  if (!checkRateLimit(req)) {
    return res.status(429).json({ error: "Too Many Requests" });
  }
  // Create and update user resetToken
  const resetToken = uuidv4();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour reset token expires
  const expiresAtStr = expiresAt.toISOString();
  await prisma.user.update({
    where: { utorid: req.body.utorid },
    data: {
      resetToken: resetToken,
      resetExpiresAt: expiresAtStr,
    },
  });
  return res
    .status(202)
    .json({ resetToken: resetToken, expiresAt: expiresAtStr });
});

router.post("/register", async (req, res) => {
  // Verify no extra body parameters
  const allowedFields = ["utorid", "name", "email", "password"];
  if (containsExtraFields(allowedFields, req.body)) {
    return res
      .status(400)
      .json({ error: "Bad request - extra fields present" });
  }
  // Verify utorid
  const utoridRegex = /^[a-zA-Z0-9]{7,8}$/;
  if (!req.body.utorid || !utoridRegex.test(req.body.utorid)) {
    return res.status(400).json({ error: "Bad request - utorid not valid" });
  }
  // Check if user already exists with utorid
  const existingUser = await prisma.user.findFirst({
    where: { utorid: req.body.utorid },
  });
  if (existingUser) {
    return res.status(409).json({ error: "Conflict - utorid taken" });
  }
  // Verify email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@mail\.utoronto\.ca$/;
  if (!req.body.email || !emailRegex.test(req.body.email)) {
    return res.status(400).json({ error: "Bad request - email not valid" });
  }
  // Verify user is unique
  const userEmail = await prisma.user.findUnique({
    where: { email: req.body.email },
  });
  if (userEmail) {
    return res.status(409).json({ error: "Conflict - email already in use" });
  }
  // Verify name
  if (!req.body.name || req.body.name.length > 50) {
    return res.status(400).json({ error: "Bad request - name not valid" });
  }

  // Create reset token
  const resetToken = uuidv4();
  // Create new user
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(now.getDate() + 7);
  const newUser = await prisma.user.create({
    data: {
      utorid: req.body.utorid,
      email: req.body.email,
      password: req.body.password,
      role: "regular",
      name: req.body.name,
      points: 0,
      activated: false,
      verified: false,
      suspicious: false,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      token: "tempToken",
      resetToken: resetToken,
      resetExpiresAt: expiresAt.toISOString(),
    },
  });
  // Update user token with user as payload
  const { token, _ } = createAuthToken(newUser);
  const finalUser = await prisma.user.update({
    where: { id: newUser.id },
    data: { token: token },
    select: {
      id: true,
      utorid: true,
      name: true,
      email: true,
      verified: true,
      expiresAt: true,
      resetToken: true,
    },
  });

  return res.status(201).json(finalUser);
});

/* Unsupported Methods */
// tokens
router.all("/tokens", async (req, res) => {
  return res.status(405).json({ error: "Method unsupported" });
});

// resets:resetToken
router.all("/resets/:resetToken", async (req, res) => {
  return res.status(405).json({ error: "Method unsupported" });
});

// resets
router.all("/resets", async (req, res) => {
  return res.status(405).json({ error: "Method unsupported" });
});

module.exports = router;
