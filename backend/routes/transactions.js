const express = require("express");
const router = express.Router();

// connect prisma
const { PrismaClient, TransactionType } = require("@prisma/client");
const prisma = new PrismaClient();
const authorize = require("../middleware/authorizeMiddleware");
const { isMandatoryValidStrings } = require("../helpers/dataValidation");
const containsExtraFields = require("../helpers/extraFieldValidation");

// Set a redemption transaction as being completed/processed (Jennifer Tan)
router.patch(
  "/:transactionsId/processed",
  authorize(["cashier", "manager", "superuser"]),
  async (req, res) => {
    const transactionId = Number(req.params["transactionsId"]);
    if (!Number.isInteger(transactionId)) {
      return res.status(404).json({ error: "Not Found" });
    }

    const { processed } = req.body;

    // can only be true or boolean type
    if (!processed || typeof processed !== "boolean" || processed !== true) {
      return res.status(400).json({ error: "Bad Request" });
    }

    // check if transaction is of type "redemption"
    const currentTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!currentTransaction) {
      // transaction not found
      return res.status(404).json({ error: "Not Found" });
    }

    if (currentTransaction.type !== TransactionType.redemption) {
      return res.status(400).json({ error: "Bad Request" });
    }

    // if transaction has already been processed
    if (currentTransaction.processed === true) {
      return res.status(400).json({ error: "Bad Request" });
    }

    // change flag from false to then deduct points from the user
    const userId = currentTransaction.userId;
    const pointsToDeduct = currentTransaction.amount;
    const oldUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!oldUser) {
      return res.status(404).json({ error: "Not Found" });
    }

    // deduct points
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: Number(oldUser.points) - Number(pointsToDeduct),
      },
    });

    // change flag from false to true and then record who processed it
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        processorId: req.user.id, // user who is logged
        processed: true,
      },
      select: {
        id: true,
        type: true,
        amount: true,
        remark: true,
        user: { select: { utorid: true } },
        processor: { select: { utorid: true } },
        creator: { select: { utorid: true } },
      },
    });

    if (!updatedTransaction) {
      return res.status(404).json({ error: "Not Found" });
    }

    return res.status(200).json({
      id: updatedTransaction.id,
      utorid: updatedTransaction.user.utorid,
      type: updatedTransaction.type,
      processedBy: updatedTransaction.processor.utorid,
      redeemed: updatedTransaction.amount,
      remark: updatedTransaction.remark,
      createdBy: updatedTransaction.creator.utorid,
    });
  }
);

/* TRANSACTIONS */

// sets a transaction as suspicious (Veda Kesarwani)
router.patch(
  "/:transactionId/suspicious",
  authorize(["manager", "superuser"]),
  async (req, res) => {
    const allowedFields = ["suspicious"];
    if (containsExtraFields(allowedFields, req.body)) {
      return res.status(400).json({ error: "Extra fields present" });
    }

    // Validate Id
    const transactionId = parseInt(req.params.transactionId, 10);
    if (isNaN(transactionId)) {
      return res.status(400).json({ error: "Invalid transactionId" });
    }

    // Validate suspicious field
    if (typeof req.body.suspicious !== "boolean") {
      return res
        .status(400)
        .json({ error: "Suspicious value must be boolean" });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true, promotionIds: true, creator: true },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (transaction.suspicious !== req.body.suspicious) {
      const user = await prisma.user.findUnique({
        where: { id: transaction.userId },
      });

      let newPoints = user.points;
      if (req.body.suspicious === true) {
        newPoints -= transaction.amount; // deduct points
      } else {
        newPoints += transaction.amount; // add points
      }

      // Update user points and transaction suspicious flag
      await prisma.user.update({
        where: { id: user.id },
        data: { points: newPoints },
      });
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { suspicious: req.body.suspicious },
      });
    }

    const updated = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true, promotionIds: true, creator: true },
    });

    return res.status(200).json({
      id: updated.id,
      utorid: updated.user.utorid,
      type: updated.type,
      spent: updated.spent,
      amount: updated.amount,
      promotionIds: updated.promotionIds.map((p) => p.id),
      suspicious: updated.suspicious,
      remark: updated.remark || "",
      createdBy: updated.creator.utorid,
    });
  }
);

// get specific transaction by id (Jennifer Tan)
router.get(
  "/:transactionId",
  authorize(["manager", "superuser"]),
  async (req, res) => {
    const transactionId = Number(req.params["transactionId"]);
    if (!Number.isInteger(transactionId)) {
      return res.status(404).json({ error: "Not Found" });
    }

    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId },
      select: {
        id: true,
        user: { select: { utorid: true } },
        type: true,
        spent: true,
        amount: true,
        promotionIds: true,
        relatedId: true,
        suspicious: true,
        remark: true,
        creator: { select: { utorid: true } },
      },
    });
    if (!transaction) {
      return res.status(404).json({ error: "Not Found" });
    }
    const outputData = {
      id: transaction.id,
      utorid: transaction.user.utorid,
      type: transaction.type,
      spent: transaction.spent,
      amount: transaction.amount,
      promotionIds: transaction.promotionIds,
      suspicious: transaction.suspicious,
      remark: transaction.remark,
      createdBy: transaction.creator.utorid,
    };
    if (transaction.type === "adjustment") {
      outputData.relatedId = transaction.relatedId;
    }
    return res.status(200).json(outputData);
  }
);

// create new purchase transaction (Jennifer Tan)
router.post(
  "/",
  authorize(["cashier", "manager", "superuser"]),
  async (req, res) => {
    const { role } = req.user;

    /**
     * There are two types of transactions:
     * - purchase: UTORID, TYPE, SPENT, promotionIds, remark (cashier or higher)
     * - adjustment: UTORID, TYPE, AMOUNT, RELATEDID, promotionIds, remark (manager or higher)
     */
    const { utorid, type, spent, amount, promotionIds, remark, relatedId } =
      req.body;

    let validity = isMandatoryValidStrings([utorid, type]);

    if (type === "purchase") {
      if (!(spent && !Number.isNaN(Number(spent)) && Number(spent) > 0)) {
        return res.status(400).json({ error: "Bad Request" });
      }
    } else if (type === "adjustment") {
      if (!relatedId || !Number.isInteger(Number(relatedId))) {
        // in adjustment, relatedId refers to the transaction it wants to edit
        return res.status(404).json({ error: "Not Found" });
      } else {
        const previousTransaction = await prisma.transaction.findUnique({
          where: { id: Number(relatedId) },
        });
        if (!previousTransaction) {
          return res.status(404).json({ error: "Bad Request" });
        }
      }
    } else {
      // for this endpoint, type can only be purchase or adjustment
      return res.status(400).json({ error: "Bad Request" });
    }

    /* Validating Promotional Ids */
    if (promotionIds && !Array.isArray(promotionIds)) {
      validity = false;
    }

    if (promotionIds) {
      // iterate through promotional ids
      for (const promotionalId of promotionIds) {
        if (!Number.isInteger(Number(promotionalId))) {
          return res.status(400).json({ error: "Bad Request" });
        }

        const promotion = await prisma.promotion.findFirst({
          where: { id: Number(promotionalId) },
        });

        // check if promotion has expired
        const currentDateTime = new Date();
        const promotionExpiresAt = new Date(promotion.endTime);

        if (
          !promotion ||
          promotionExpiresAt < currentDateTime ||
          promotion.used ||
          Number(spent) < Number(promotion.minSpending) ||
          (promotion.rate !== null && promotion.rate <= 0)
        ) {
          return res.status(400).json({ error: "Bad Request" });
        }
      }
    }

    if (remark && (typeof remark !== "string" || remark === "")) {
      return res.status(400).json({ error: "Bad Request" });
    }

    // Make sure valid
    if (!validity) {
      return res.status(400).json({ error: "Bad Request" });
    }

    // verify affected user
    const affectedUser = await prisma.user.findFirst({
      where: { utorid: utorid },
    });

    if (!affectedUser) {
      return res
        .status(404)
        .json({ error: "Not Found: Affected User Not Found" });
    }

    // case 1: type === purchase
    if (type === "purchase") {
      // Get points from promotions
      const centsSpent = Number(spent) * 100;
      let promoPoints = 0;
      let totalRate = 0.04;
      // check promotional ids

      if (promotionIds) {
        for (const promotionalId of promotionIds) {
          // iterate through promotional ids

          // check if promotion exists
          const promotion = await prisma.promotion.findFirst({
            where: { id: Number(promotionalId) },
          });

          // apply each promotion
          if (promotion.points !== null) {
            promoPoints += promotion.points;
          }
          if (promotion.rate !== null) {
            totalRate += promotion.rate;
          }
        }
      }

      const totalPoints = Math.round(centsSpent * totalRate) + promoPoints;
      // check if cashier processing is supicious
      let suspicious = false;
      if (role === "cashier") {
        cashier = await prisma.user.findUnique({
          where: { utorid: req.user.utorid },
        });
        if (!cashier) {
          return res.status(404).json({ error: "Not Found" });
        }
        // Only add points if cashier is not suspicous
        if (cashier.suspicious) {
          suspicious = true;
        }
      }
      if (!suspicious) {
        const newPointsAmount = affectedUser.points + totalPoints;
        await prisma.user.update({
          where: { id: affectedUser.id },
          data: { points: newPointsAmount },
        });
      }

      // Update one time promotions to used
      if (promotionIds) {
        for (const promotionalId of promotionIds) {
          const promotion = await prisma.promotion.findFirst({
            where: { id: Number(promotionalId) },
          });
          if (promotion.type === "onetime") {
            const newPromotion = await prisma.promotion.update({
              where: { id: Number(promotionalId) },
              data: { used: true },
            });
          }
        }
      }

      // create record for transaction
      const newTransaction = await prisma.transaction.create({
        data: {
          type: "purchase",
          spent: spent,
          amount: totalPoints,
          remark: remark,
          suspicious: suspicious,
          processed: true,
          promotionIds: promotionIds
            ? { connect: promotionIds.map((id) => ({ id: Number(id) })) }
            : undefined, // ai.txt (5)
          user: {
            connect: { id: affectedUser.id },
          },
          creator: {
            connect: { utorid: req.user.utorid },
          },
        },
        include: { promotionIds: true },
      });

      return res.status(201).json({
        id: newTransaction.id,
        utorid: utorid,
        type: "purchase",
        spent: spent,
        earned: suspicious ? 0 : newTransaction.amount,
        remark: newTransaction.remark,
        promotionIds: promotionIds || [],
        createdBy: req.user.utorid,
      });
    }
    // CASE 2 - type == adjustment
    if (type === "adjustment") {
      if (role === "cashier") {
        return res.status(403).json({ error: "Forbidden" });
      }

      const oldUser = await prisma.user.findUnique({
        where: { utorid: utorid },
      });

      if (!oldUser) {
        return res.status(404).json({ error: "Not Found" });
      }

      const newPoints = oldUser.points + Number(amount);

      // Once an adjustment is made, the amount is automatically reflected in the user's points balance
      const updatedUser = await prisma.user.update({
        where: { utorid: utorid },
        data: {
          points: newPoints,
        },
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "Not Found" });
      }

      // create record for transaction
      const newTransaction = await prisma.transaction.create({
        data: {
          spent: 0,
          amount: amount,
          type: "adjustment",
          remark: remark,
          relatedId: relatedId,
          promotionIds: promotionIds
            ? { connect: promotionIds.map((id) => ({ id: Number(id) })) }
            : undefined, // ai.txt (5)
          user: {
            connect: { id: affectedUser.id },
          },
          creator: {
            connect: { utorid: req.user.utorid },
          },
          suspicious: false,
          processed: true,
        },
        include: { promotionIds: true },
      });

      return res.status(201).json({
        id: newTransaction.id,
        utorid: utorid,
        type: "adjustment",
        relatedId: relatedId,
        amount: newTransaction.amount,
        remark: newTransaction.remark,
        promotionIds: promotionIds || [],
        createdBy: req.user.utorid,
      });
    }
  }
);

// get list of transactions with filters (Jennifer Tan)
router.get("/", authorize(["manager", "superuser"]), async (req, res) => {
  const filter = {};
  // note: query can only be string
  if (req.query.name) {
    filter.name = req.query.name;
  }

  if (req.query.createdBy) {
    filter.createdBy = req.query.createdBy;
  }

  // check if suspicious
  if (req.query.suspicious) {
    if (req.query.suspicious === "true" || req.query.suspicious === "false") {
      if (req.query.suspicious === "true") {
        filter.suspicious = true;
      } else {
        filter.suspicious = false;
      }
    } else {
      return res
        .status(400)
        .json({ error: "Bad Request - Suspicious is Invalid" });
    }
  }

  if (req.query.promotionalId) {
    // check if the promotionalId exists
    if (!Number.isInteger(Number(req.query.promotionId))) {
      return res.status(400).json({ error: "Bad Request" });
    }

    const promotion = await prisma.promotion.findUnique({
      where: { id: Number(req.query.promotionId) },
    });

    // promotion not found
    if (!promotion) {
      return res.status(404).json({ error: "Not Found" });
    }

    filter.promotionIds = { contains: { id: Number(req.query.promotionalId) } };
  }

  if (req.query.type) {
    if (
      req.query.type === "purchase" ||
      req.query.type === "adjustment" ||
      req.query.type === "transfer" ||
      req.query.type === "redemption" ||
      req.query.type === "event"
    ) {
      filter.type = type;
    } else {
      return res.status(400).json({ error: "Bad Request - Type is Invalid" });
    }
  }

  if (req.query.relatedId) {
    if (req.query.type) {
      // check that relatedID is a valid number
      if (!Number.isInteger(Number(req.query.promotionId))) {
        return res.status(400).json({ error: "Bad Request" });
      }
      if (req.query.type === "adjustment") {
        // verify that its a valid transaction
        const relatedTransaction = await prisma.transaction.findUnique({
          where: { id: Number(req.query.relatedId) },
        });

        if (!relatedTransaction) {
          return res
            .status(404)
            .json({ error: "Related Transaction Not Found" });
        }
      } else if (req.query.type === "transfer") {
        // verify that its a valid transaction
        const relatedUser = await prisma.user.findUnique({
          where: { id: Number(req.query.relatedId) },
        });

        if (!relatedUser) {
          return res.status(404).json({ error: "Related User Not Found" });
        }
      } else if (req.query.type === "redemption") {
        const relatedCashier = await prisma.user.findUnique({
          where: { id: Number(req.query.relatedId), role: "cashier" },
        });

        if (!relatedCashier) {
          return res
            .status(404)
            .json({ error: "Not Found - Cashier Does not Exist" });
        }

        filter.processorId = Number(req.query.relatedId);
        filter.processed = true;
      } else {
        const relatedEvent = await prisma.event.findUnique({
          where: { id: Number(req.query.relatedId) },
        });

        if (!relatedEvent) {
          return res.status(404).json({ error: "Related Event Not Found" });
        }
      }
    } else {
      return res.status(400).json({
        error: "Bad Request - Related Id is Invalid, Must be used with type.",
      });
    }
  }

  // check amount and operator (must exist together)
  if (
    (req.query.amount && !req.query.operator) ||
    (!req.query.amount && req.query.operator)
  ) {
    return res.status(400).json({
      error: "Bad Request - Amount and Operator must exist at the same time",
    });
  }
  if (req.query.amount && req.query.operator) {
    if (!Number.isInteger(Number(req.query.amount))) {
      // does this need to be an integer
      return res.status(400).json({ error: "Bad Request" });
    }

    if (req.query.operation !== "gte" && req.query.operation !== "lte") {
      return res.status(400).json({ error: "Bad Request" });
    }

    if (req.query.operation === "gte") {
      filter.amount = {
        gte: Number(req.query.amount),
      };
    } else {
      filter.amount = {
        lte: Number(req.query.amount),
      };
    }
  }

  // check page and limit

  // default values
  if (req.query.page) {
    if (!Number.isInteger(Number(req.query.page))) {
      return res.status(400).json({ error: "Bad Request" });
    }
  }

  if (req.query.limit) {
    if (!Number.isInteger(Number(req.query.limit))) {
      return res.status(400).json({ error: "Bad Request" });
    }
  }

  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 10;
  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: "Page/limit must be positive" });
  }

  const skip = (page - 1) * limit;
  const totalCount = await prisma.transaction.count({ where: filter });
  const transactions = await prisma.transaction.findMany({
    skip,
    take: limit,
    where: filter,
    select: {
      id: true,
      userId: true,
      amount: true,
      type: true,
      spent: true,
      promotionIds: true,
      suspicious: true,
      remark: true,
      creatorId: true,
    },
  });

  const outputtedTransactions = await Promise.all(
    transactions.map(async (transaction) => {
      const userUtorid = await prisma.user.findUnique({
        where: { id: transaction.userId },
        select: { utorid: true },
      });
      const creatorUtorid = await prisma.user.findUnique({
        where: { id: transaction.creatorId },
        select: { utorid: true },
      });

      return {
        id: transaction.id,
        utorid: userUtorid.utorid,
        amount: transaction.amount,
        type: transaction.type,
        spent: transaction.spent,
        promotionIds: transaction.promotionIds,
        suspicious: transaction.suspicious,
        remark: transaction.remark,
        createdBy: creatorUtorid.utorid,
      };
    })
  );

  console.log(outputtedTransactions);

  return res.status(200).json({
    count: totalCount,
    results: outputtedTransactions,
  });
});

// invalid endpoints

// endpoint: /transactions/:transactionId/suspicious  (Veda Kesarwani)
router.all("/:transactionId/suspicious", (_, res) => {
  return res.status(405).json({ error: "Method unsupported" });
});

// endpoint: /transactions/:transactionId/processed -> patch  (Jennifer Tan)
router.all("/:transactionId/processed", (_, res) => {
  return res.status(405).json({ error: "Not Allowed" });
});

// endpoint: /transactions/:transactionId -> get  (Jennifer Tan)
router.all("/:transactionId", (_, res) => {
  return res.status(405).json({ error: "Not Allowed" });
});

// endpoint: /transactions/ -> get, post (Jennifer Tan)
router.all("/", (_, res) => {
  return res.status(405).json({ error: "Not Allowed" });
});

module.exports = router;
