const express = require("express");
const router = express.Router();

// connect prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authorize = require("../middleware/authorizeMiddleware");
const containsExtraFields = require("../helpers/extraFieldValidation");

/* PROMOTIONS ENDPOINTS */

router.post("/", authorize(["manager", "superuser"]), async (req, res) => {
  // Validating fields
  const allowedFields = [
    "name",
    "description",
    "type",
    "startTime",
    "endTime",
    "minSpending",
    "rate",
    "points",
  ];
  if (containsExtraFields(allowedFields, req.body)) {
    return res.status(400).json({ error: "Extra fields present" });
  }

  const {
    name,
    description,
    type,
    startTime,
    endTime,
    minSpending,
    rate,
    points,
  } = req.body;

  if (!name || !description || !type || !startTime || !endTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate type
  if (!["automatic", "one-time"].includes(type)) {
    return res.status(400).json({ error: "Invalid type" });
  }

  let promotionType = type === "one-time" ? "onetime" : type;

  // Validating time
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  if (start < now) {
    return res.status(400).json({ error: "Start time cannot be in the past" });
  }
  if (end <= start) {
    return res.status(400).json({ error: "End time must be after start time" });
  }

  // Validating minSpending, rate and points
  if (rate && rate <= 0) {
    return res.status(400).json({ error: "rate must be positive" });
  }
  if (points && points <= 0) {
    return res.status(400).json({ error: "points must be positive" });
  }
  if (minSpending && minSpending <= 0) {
    return res.status(400).json({ error: "minSpending must be positive" });
  }

  try {
    const newPromo = await prisma.promotion.create({
      data: {
        name,
        description,
        type: promotionType,
        startTime,
        endTime,
        minSpending: minSpending || null,
        rate: rate || null,
        points: points || 0,
        used: false,
      },
    });

    return res.status(201).json(newPromo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get(
  "/",
  authorize(["regular", "cashier", "manager", "superuser"]),
  async (req, res) => {
    const { name, type, page = 1, limit = 10, started, ended } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    // Validating pages
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum <= 0 || limitNum <= 0) {
      return res.status(400).json({ error: "Invalid pagination values" });
    }

    const skip = (pageNum - 1) * limitNum;
    const userRole = req.user.role;

    if (started !== undefined && ended !== undefined) {
      return res
        .status(400)
        .json({ error: "Cannot filter by both started and ended" });
    }

    const where = {};

    if (name) where.name = { contains: name };
    if (type) where.type = type;

    const now = new Date();

    // Handling both versions of the get request here
    if (userRole === "manager" || userRole === "superuser") {
      if (started !== undefined) {
        where.startTime =
          started === "true"
            ? { lte: now.toISOString() }
            : { gt: now.toISOString() };
      }
      if (ended !== undefined) {
        where.endTime =
          ended === "true"
            ? { lte: now.toISOString() }
            : { gt: now.toISOString() };
      }
    } else {
      // For regular users
      where.startTime = { lte: now.toISOString() };
      where.endTime = { gt: now.toISOString() };
      where.used = false;
    }

    try {
      const count = await prisma.promotion.count({ where });
      const results = await prisma.promotion.findMany({
        where,
        skip,
        take: limitNum,
        select: {
          id: true,
          name: true,
          type: true,
          startTime: true,
          endTime: true,
          minSpending: true,
          rate: true,
          points: true,
        },
      });

      return res.status(200).json({ count, results });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

// Combined both versions of the get requests into 1 endpoint but seperated results
router.get(
  "/:promotionId",
  authorize(["regular", "cashier", "manager", "superuser"]),
  async (req, res) => {
    const id = parseInt(req.params.promotionId);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid promotion id" });
    }

    const promotion = await prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      return res.status(404).json({ error: "Not found" });
    }

    const now = new Date();
    const start = new Date(promotion.startTime);
    const end = new Date(promotion.endTime);

    // Ensure that active promos are only for regular users
    if (req.user.role === "regular" || req.user.role === "cashier") {
      if (now < start || now > end) {
        return res.status(404).json({ error: "Promotion is inactive" });
      }

      return res.status(200).json({
        id: promotion.id,
        name: promotion.name,
        description: promotion.description,
        type: promotion.type,
        endTime: promotion.endTime,
        minSpending: promotion.minSpending,
        rate: promotion.rate,
        points: promotion.points,
      });
    }

    // This is for manager or superuser
    return res.status(200).json({
      id: promotion.id,
      name: promotion.name,
      description: promotion.description,
      type: promotion.type,
      startTime: promotion.startTime,
      endTime: promotion.endTime,
      minSpending: promotion.minSpending,
      rate: promotion.rate,
      points: promotion.points,
    });
  }
);

router.patch(
  "/:promotionId",
  authorize(["manager", "superuser"]),
  async (req, res) => {
    const id = parseInt(req.params.promotionId);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid promotion id" });
    }

    const allowedFields = [
      "name",
      "description",
      "type",
      "startTime",
      "endTime",
      "minSpending",
      "rate",
      "points",
    ];

    if (containsExtraFields(allowedFields, req.body)) {
      return res.status(400).json({ error: "There are extra fields present" });
    }

    const promotion = await prisma.promotion.findUnique({ where: { id } });
    if (!promotion) {
      return res.status(404).json({ error: "Not found" });
    }

    const now = new Date();
    const initialStart = new Date(promotion.startTime);
    const initialEnd = new Date(promotion.endTime);

    const updateData = {};

    // Validate optional string fields only if not null/undefined
    if (req.body.name !== undefined && req.body.name !== null) {
      if (
        typeof req.body.name !== "string" ||
        req.body.name.trim().length === 0
      ) {
        return res.status(400).json({ error: "Name is not valid" });
      }
      updateData.name = req.body.name;
    }

    if (req.body.description !== undefined && req.body.description !== null) {
      if (
        typeof req.body.description !== "string" ||
        req.body.description.trim().length === 0
      ) {
        return res.status(400).json({ error: "Description is not valid" });
      }
      updateData.description = req.body.description;
    }

    if (req.body.type !== undefined && req.body.type !== null) {
      if (
        typeof req.body.type !== "string" ||
        req.body.type.trim().length === 0
      ) {
        return res.status(400).json({ error: "Type is not valid" });
      }
      updateData.type = req.body.type;
    }

    // Adding validations for time
    if (req.body.startTime) {
      const newStart = new Date(req.body.startTime);
      if (isNaN(newStart) || newStart < now) {
        return res.status(400).json({ error: "Invalid or past start time" });
      }
      updateData.startTime = req.body.startTime;
    }

    if (req.body.endTime) {
      const newEnd = new Date(req.body.endTime);
      const startForCompare = req.body.startTime
        ? new Date(req.body.startTime)
        : initialStart;

      if (isNaN(newEnd) || newEnd <= startForCompare) {
        return res.status(400).json({ error: "Invalid end time" });
      }
      if (newEnd < now) {
        return res
          .status(400)
          .json({ error: "End time cannot be in the past" });
      }
      if (now > initialEnd) {
        return res
          .status(400)
          .json({ error: "Cannot update end time after promotion has ended" });
      }

      updateData.endTime = req.body.endTime;
    }

    // Ensuring that some fields cannot be updated after start
    const hasStarted = now >= initialStart;
    const restricted = [
      "name",
      "description",
      "type",
      "startTime",
      "minSpending",
      "rate",
      "points",
    ];
    if (hasStarted) {
      for (const key of restricted) {
        if (req.body[key] !== undefined && req.body[key] !== null) {
          return res.status(400).json({
            error: `Cannot update '${key}' after promotion start time has passed`,
          });
        }
      }
    }

    // Validating minSpending, points and rate fields
    if (req.body.minSpending !== undefined && req.body.minSpending !== null) {
      if (req.body.minSpending <= 0) {
        return res.status(400).json({ error: "minSpending must be positive" });
      }
      updateData.minSpending = req.body.minSpending;
    }

    if (req.body.rate !== undefined && req.body.rate !== null) {
      if (req.body.rate <= 0) {
        return res.status(400).json({ error: "rate must be positive" });
      }
      updateData.rate = req.body.rate;
    }

    if (req.body.points !== undefined && req.body.points !== null) {
      if (req.body.points <= 0) {
        return res.status(400).json({ error: "points must be positive" });
      }
      updateData.points = req.body.points;
    }

    console.log("updateData:", updateData);

    const updated = await prisma.promotion.update({
      where: { id },
      data: updateData,
    });

    console.log("updated:", updated);

    const response = {
      id: updated.id,
      name: updated.name,
      type: updated.type,
    };

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        response[field] = updated[field];
      }
    }

    return res.status(200).json(response);
  }
);

router.delete(
  "/:promotionId",
  authorize(["manager", "superuser"]),
  async (req, res) => {
    const id = parseInt(req.params.promotionId);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid promotion id" });
    }

    const promotion = await prisma.promotion.findUnique({ where: { id } });
    if (!promotion) {
      return res.status(404).json({ error: "Not found" });
    }

    const now = new Date();
    const start = new Date(promotion.startTime);

    // Validating time fields
    if (now >= start) {
      return res.status(403).json({ error: "Promotion already started" });
    }

    await prisma.promotion.delete({ where: { id } });
    return res.status(204).send();
  }
);

/* =========== INVALID ENDPOINTS =========== */

router.all("/", (_, res) => {
  return res.status(405).json({ error: "Method unsupported" });
});

router.all("/:promotionId", (_, res) => {
  return res.status(405).json({ error: "Not Allowed" });
});

module.exports = router;
