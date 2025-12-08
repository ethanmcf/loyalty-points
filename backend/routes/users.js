const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

const upload = require("../middleware/storageMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const createAuthToken = require("../helpers/createAuthToken");
const containsExtraFields = require("../helpers/extraFieldValidation");

const express = require("express");
const router = express.Router();

router.patch(
  "/me/password",
  authorize(["regular", "cashier", "manager", "superuser"]),
  async (req, res) => {
    // Verify no extra body parameters
    const allowdFields = ["old", "new"];
    if (containsExtraFields(allowdFields, req.body)) {
      return res
        .status(400)
        .json({ error: "Bad request - extra fields present" });
    }
    // Verify body params
    if (!req.body.old) {
      return res.status(400).json({ error: "Missing old password" });
    }
    // Verify password
    // reference: ai.txt (3)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,20}$/;
    if (!req.body.new || !passwordRegex.test(req.body.new)) {
      return res.status(400).json({ error: "New Password is invalid" });
    }
    // Verify password matches
    const user = await prisma.user.findUnique({
      where: { utorid: req.user.utorid },
      select: { password: true },
    });
    if (user.password !== req.body.old) {
      return res
        .status(403)
        .json({ error: "Forbidden - current password does not match" });
    }

    // Update user
    await prisma.user.update({
      where: { utorid: req.user.utorid },
      data: { password: req.body.new },
    });
    return res.status(200).send();
  }
);

router.post(
  "/me/transactions",
  authorize(["regular", "cashier", "manager", "superuser"]),
  async (req, res) => {
    // Verify no extra body parameters
    const allowedFields = ["type", "amount", "remark"];
    if (containsExtraFields(allowedFields, req.body)) {
      return res
        .status(400)
        .json({ error: "Bad request - extra fields present" });
    }

    const { type, amount, remark } = req.body;

    // Validate type
    if (type !== "redemption") {
      return res
        .status(400)
        .json({ error: "Bad request - type must be redemption" });
    }

    // Validate amount
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "Bad request - invalid amount" });
    }

    // Fetch logged-in user
    const user = await prisma.user.findUnique({
      where: { utorid: req.user.utorid },
    });

    // Check verification
    if (!user.verified) {
      return res.status(403).json({ error: "Forbidden - user not verified" });
    }

    // Check balance
    if (user.points < parsedAmount) {
      return res
        .status(400)
        .json({ error: "Bad request - insufficient points" });
    }

    // Create redemption transaction (not processed yet)
    const transaction = await prisma.transaction.create({
      data: {
        type: "redemption",
        amount: parsedAmount,
        spent: 0,
        suspicious: false,
        processed: false,
        remark: remark || "",
        userId: user.id,
        creatorId: user.id,
      },
      include: { creator: true, user: true },
    });

    return res.status(201).json({
      id: transaction.id,
      utorid: transaction.user.utorid,
      type: transaction.type,
      processedBy: null,
      amount: transaction.amount,
      remark: transaction.remark || "",
      createdBy: transaction.creator.utorid,
    });
  }
);

router.get(
  "/me/transactions",
  authorize(["regular", "cashier", "manager", "superuser"]),
  async (req, res) => {
    const {
      type,
      relatedId,
      promotionId,
      amount,
      operator,
      page = 1,
      limit = 10,
    } = req.query;

    // Verify logged in user exists
    const user = await prisma.user.findUnique({
      where: { utorid: req.user.utorid },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check and verify optional query paramsf
    const where = { userId: user.id };

    if (type) where.type = type;
    if (relatedId) where.relatedId = parseInt(relatedId, 10);
    if (promotionId)
      where.promotionIds = { some: { id: parseInt(promotionId, 10) } };
    if (amount && operator) {
      const parsedAmount = parseInt(amount, 10);
      if (!["gte", "lte"].includes(operator)) {
        return res
          .status(400)
          .json({ error: "Bad request - invalid operator" });
      }
      where.amount = { [operator]: parsedAmount };
    }

    const skip = (page - 1) * limit;
    const take = parseInt(limit, 10);

    const [count, results] = await prisma.$transaction([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        skip,
        take,
        include: { promotionIds: true, creator: true },
        orderBy: { id: "asc" },
      }),
    ]);

    return res.status(200).json({
      count,
      results: results.map((transaction) => ({
        id: transaction.id,
        type: transaction.type,
        spent: transaction.spent,
        amount: transaction.amount,
        promotionIds: transaction.promotionIds.map((p) => p.id),
        relatedId: transaction.relatedId || undefined,
        remark: transaction.remark || "",
        createdBy: transaction.creator?.utorid || "",
        suspicious: transaction.suspicious,
      })),
    });
  }
);

router.patch(
  "/me",
  authorize(["regular", "cashier", "manager", "superuser"]),
  upload.single("avatar"),
  async (req, res) => {
    // Verify no extra body parameters
    const allowdFields = ["name", "email", "birthday", "avatar"];
    if (containsExtraFields(allowdFields, req.body)) {
      return res
        .status(400)
        .json({ error: "Bad request - extra fields present" });
    }
    // Get & verify optional params
    const updateData = {};
    // Check and verify email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@mail\.utoronto\.ca$/;
    if (req.body.email) {
      if (!emailRegex.test(req.body.email)) {
        return res
          .status(400)
          .json({ error: "Bad Request - email is not valid" });
      } else {
        // Verify user with email exists
        const userEmail = await prisma.user.findUnique({
          where: { email: req.body.email },
        });
        if (userEmail && userEmail.utorid !== req.user.utorid) {
          return res
            .status(409)
            .json({ error: "Conflict - email already in use" });
        }
        updateData["email"] = req.body.email;
      }
    }
    // Check and verify name
    if (req.body.name) {
      if (req.body.name.length > 50) {
        return res
          .status(400)
          .json({ error: "Bad Request - name is too long" });
      } else {
        updateData["name"] = req.body.name;
      }
    }
    // Check and verify birthday
    if (req.body.birthday) {
      const date = new Date(req.body.birthday);
      if (
        !(date instanceof Date) ||
        isNaN(date) ||
        date.toISOString().slice(0, 10) !== req.body.birthday
      ) {
        return res
          .status(400)
          .json({ error: "Bad Request - birthday is not in YYYY-MM-DD" });
      } else {
        updateData["birthday"] = req.body.birthday;
      }
    }
    // Check if avatar passed
    if (req.file) {
      updateData["avatarUrl"] = req.file.path;
    }

    // No fields passed - don't update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    // Update user
    const user = await prisma.user.update({
      where: { utorid: req.user.utorid },
      data: updateData,
      select: {
        id: true,
        utorid: true,
        name: true,
        email: true,
        birthday: true,
        role: true,
        points: true,
        createdAt: true,
        lastLogin: true,
        verified: true,
        avatarUrl: true,
      },
    });
    return res.status(200).json(user);
  }
);

router.get(
  "/me",
  authorize(["regular", "cashier", "manager", "superuser"]),
  async (req, res) => {
    // Get logged in user
    const user = await prisma.user.findUnique({
      where: { utorid: req.user.utorid },
      select: {
        id: true,
        utorid: true,
        name: true,
        points: true,
        verified: true,
        email: true,
        birthday: true,
        role: true,
        suspicious: true,
        createdAt: true,
        lastLogin: true,
        avatarUrl: true,
      },
    });
    // Get related promotions
    const promotions = await prisma.promotion.findMany({
      where: {
        users: {
          some: { id: user.id },
        },
      },
      select: {
        id: true,
        name: true,
        minSpending: true,
        rate: true,
        points: true,
        type: true,
      },
    });
    user["promotions"] = promotions;
    return res.status(200).json(user);
  }
);

router.post(
  "/",
  authorize(["cashier", "manager", "superuser"]),
  async (req, res) => {
    // Verify no extra body parameters
    const allowdFields = ["utorid", "name", "email"];
    if (containsExtraFields(allowdFields, req.body)) {
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
      return res.status(409).json({ error: "Conflict - user already exists" });
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
        password: "defaultPass123",
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
  }
);

router.get(
  "/",
  authorize(["regular", "cashier", "manager", "superuser"]),
  async (req, res) => {
    // Add and verify optional query params
    const query = {};
    if (req.query.name) {
      query["name"] = { contains: req.query.name };
    }

    if (req.query.utorid) {
      query["utorid"] = { contains: req.query.utorid };
    }

    if (req.query.role) {
      query["role"] = req.query.role;
    }
    if (req.query.verified === "true" || req.query.verified === "false") {
      query["verified"] = req.query.verified === "true";
    }
    if (req.query.activated === "true" || req.query.activated === "false") {
      query["activated"] = req.query.activated === "true";
    }
    // Verify and set default pagination
    let page = parseInt(req.query.page) || 1;
    let take = parseInt(req.query.limit) || 10;
    if (page < 1 || take < 1) {
      return res.status(400).json({ error: "Page/limit must be positive" });
    }
    // Retrieve based on query
    const skip = (page - 1) * take;
    const total = await prisma.user.count({ where: query });
    const users = await prisma.user.findMany({
      skip,
      take: take,
      where: query,
      select: {
        id: true,
        utorid: true,
        name: true,
        email: true,
        birthday: true,
        role: true,
        points: true,
        createdAt: true,
        lastLogin: true,
        verified: true,
        avatarUrl: true,
      },
    });
    return res.status(200).json({
      count: total,
      results: users,
    });
  }
);

router.post(
  "/:userId/transactions",
  authorize(["regular", "cashier", "manager", "superuser"]),
  async (req, res) => {
    // Veriy no extra body params
    const allowdFields = ["type", "amount", "remark"];
    if (containsExtraFields(allowdFields, req.body)) {
      return res
        .status(400)
        .json({ error: "Bad request - extra fields present" });
    }
    // Verify userId and recipient exists
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ error: "Bad Request - userid is not valid" });
    }
    const recipient = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!recipient) {
      return res.status(404).json({ error: "User not found" });
    }
    // Get sender and is verified
    const sender = await prisma.user.findUnique({
      where: { utorid: req.user.utorid },
    });
    if (!sender.verified) {
      return res.status(403).json({ error: "Sender not verified" });
    }
    // Verify type
    if (req.body.type !== "transfer") {
      return res
        .status(400)
        .json({ error: "Bad Request - type must be transfer" });
    }
    // Verify amount
    const amount = parseInt(req.body.amount, 10);
    if (isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ error: "Bad Request - amount of points is invalid" });
    }

    // Get remark
    let remark = req.body.remark ? req.body.remark : "";

    // Verify sender has enough points
    if (sender.points < amount) {
      return res
        .status(400)
        .json({ error: "Bad Request - sender doesn't have enough points" });
    }
    // Create sender Transaction
    const senderTransaction = await prisma.transaction.create({
      data: {
        type: "transfer",
        remark: remark,
        amount: amount,
        spent: 0,
        processed: true,
        suspicious: false,
        userId: sender.id,
        relatedId: recipient.id,
        creatorId: sender.id,
      },
    });

    // Create Recipient Transaction
    const recipientTransaction = await prisma.transaction.create({
      data: {
        type: "transfer",
        remark: remark,
        amount: amount,
        spent: 0, // May need to change this
        processed: true,
        suspicious: false,
        userId: recipient.id,
        relatedId: sender.id,
        creatorId: sender.id,
      },
    });
    // Update sender points
    const senderTotalPoints = sender.points - amount;
    await prisma.user.update({
      where: { id: sender.id },
      data: { points: senderTotalPoints },
    });

    // Update recipient points
    const recipientTotalPoints = recipient.points + amount;
    await prisma.user.update({
      where: { id: recipient.id },
      data: { points: recipientTotalPoints },
    });

    return res.status(201).json({
      id: sender.id,
      sender: sender.utorid,
      recipient: recipient.utorid,
      type: "transfer",
      sent: amount,
      remark: remark,
      createdBy: sender.utorid,
    });
  }
);

router.get(
  "/:userId",
  authorize(["cashier", "manager", "superuser"]),
  async (req, res) => {
    // Verify userId
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ error: "Bad Request - userid is not valid" });
    }
    // Check if user exists and only return certain fields if user is a cashier
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        utorid: true,
        name: true,
        points: true,
        verified: true,
        email: req.user.role !== "cashier",
        birthday: req.user.role !== "cashier",
        role: req.user.role !== "cashier",
        createdAt: req.user.role !== "cashier",
        lastLogin: req.user.role !== "cashier",
        avatarUrl: req.user.role !== "cashier",
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Get promotions depending on user role
    const promotionQuery = {
      users: {
        some: { id: userId },
      },
    };
    if (req.user.role === "cashier") {
      promotionQuery["type"] = "onetime";
      promotionQuery["used"] = false;
    }
    const promotions = await prisma.promotion.findMany({
      where: promotionQuery,
      select: {
        id: true,
        name: true,
        minSpending: true,
        rate: true,
        points: true,
      },
    });
    user["promotions"] = promotions;

    return res.status(200).json(user);
  }
);

router.patch(
  "/:userId",
  authorize(["manager", "superuser"]),
  async (req, res) => {
    // Verify no extra body parameters
    const allowdFields = ["email", "verified", "suspicious", "role"];
    if (containsExtraFields(allowdFields, req.body)) {
      return res
        .status(400)
        .json({ error: "Bad request - extra fields present" });
    }

    // Verify userId and user exists
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ error: "Bad Request - userId is not valid" });
    }
    const foundUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        suspicious: true,
        role: true,
      },
    });
    if (!foundUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get and verify optional params
    const updateData = {};
    // Verify email
    if (req.body.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@mail\.utoronto\.ca$/;
      if (!emailRegex.test(req.body.email)) {
        return res
          .status(400)
          .json({ error: "Bad Request - email is not valid" });
      } else {
        // Email in use by another user
        const userEmail = await prisma.user.findUnique({
          where: { email: req.body.email },
        });
        if (userEmail && userEmail.id !== foundUser.id) {
          return res
            .status(409)
            .json({ error: "Conflict - email already in use" });
        }
        updateData["email"] = req.body.email;
      }
    }

    // Verified must be true if present
    if ("verified" in req.body && req.body.verified != null) {
      if (req.body.verified !== true) {
        return res
          .status(400)
          .json({ error: "Bad Request - verified is not set to true" });
      } else {
        updateData["verified"] = Boolean(req.body.verified);
      }
    }
    // Check and Verify suspicous
    if ("suspicious" in req.body && req.body.suspicious != null) {
      if (
        // req.body.suspicious !== null &&
        typeof req.body.suspicious !== "boolean"
      ) {
        return res
          .status(400)
          .json({ error: "Bad Request - verified is not a bool" });
      } else {
        updateData["suspicious"] = req.body.suspicious;
      }
    }

    // Verify valid role type
    if (req.body.role) {
      if (
        !["regular", "cashier", "manager", "superuser"].includes(req.body.role)
      ) {
        return res.status(400).json({ error: "Role invalid" });
      }
      // Manager cannot update to manager or superuser
      if (
        req.user.role === "manager" &&
        ["manager", "superuser"].includes(req.body.role)
      ) {
        return res
          .status(403)
          .json({ error: "Manager can't promote to a Manager or Superuser" });
      }
      // Manager cannot promote suspicious user to cashier
      if (
        req.user.role === "manager" &&
        foundUser.suspicious === true &&
        foundUser.role === "regular" &&
        req.body.role === "cashier"
      ) {
        return res
          .status(403)
          .json({ error: "Manager cannot promote suspicious user to cashier" });
      }
      updateData["role"] = req.body.role;
    }

    // No update data passed
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        utorid: true,
        name: true,
        email: "email" in updateData,
        verified: "verified" in updateData,
        suspicious: "suspicious" in updateData,
        role: "role" in updateData,
      },
    });
    return res.status(200).json(user);
  }
);

/* Unsupported Methods */
// users
router.all("/", async (req, res) => {
  return res.status(405).json({ error: "Method unsupported" });
});

// me/password
router.all("/me/password", async (req, res) => {
  return res.status(405).json({ error: "Method unsupported" });
});

// me
router.all("/me", async (req, res) => {
  return res.status(405).json({ error: "Method unsupported" });
});

// :userId/transactions
router.all("/:userId/transactions", async (req, res) => {
  return res.status(405).json({ error: "Method unsupported" });
});

// :userId
router.all("/:userId", async (req, res) => {
  return res.status(405).json({ error: "Method unsupported" });
});

module.exports = router;
