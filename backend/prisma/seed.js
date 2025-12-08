/*
 * Complete this script so that it is able to add a superuser to the database
 * Usage example:
 *   node prisma/createsu.js clive123 clive.su@mail.utoronto.ca SuperUser123!
 */
"use strict";
require("dotenv").config();

const { PrismaClient, PromotionType } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const createAuthToken = require("../helpers/createAuthToken");

const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const randFloat = (min, max, decimals = 2) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

const randomBirthday = () => {
  const start = new Date(1969, 0, 1).getTime();
  const end = new Date(2003, 11, 31).getTime();
  const randomDate = Math.floor(Math.random() * (end - start + 1)) + start;
  const date = new Date(randomDate);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const pickRandomUsers = async (min, max) => {
  const allUsers = await prisma.user.findMany({
    select: { utorid: true },
  });
  if (allUsers.length === 0) return [];

  const num = randInt(
    Math.min(min, allUsers.length),
    Math.min(max, allUsers.length)
  );

  const randomUsers = [...allUsers]
    .sort(() => Math.random() - 0.5)
    .slice(0, num);
  return randomUsers.map((user) => ({ utorid: user.utorid }));
};

const randomDateRange = () => {
  const now = Date.now();
  // Start anytime from now - 7 days to now + 7 days
  const start = now + randInt(-7, 7) * 24 * 60 * 60 * 1000;
  // End 1–30 days after start
  const end = start + randInt(1, 30) * 24 * 60 * 60 * 1000;
  return {
    startTime: new Date(start).toISOString(),
    endTime: new Date(end).toISOString(),
  };
};

async function createUsers() {
  const usersToCreate = [];

  // 1 superuser
  usersToCreate.push({
    utorid: "supersu1",
    role: "superuser",
    password: "SuperUser123!",
    email: "super1@mail.utoronto.ca",
    name: "Superuser1",
  });

  // 5 managers
  for (let i = 1; i <= 5; i++) {
    usersToCreate.push({
      utorid: `manager${i}`,
      role: "manager",
      password: "Manager123!",
      email: `manager${i}@mail.utoronto.ca`,
      name: `Manager${i}`,
    });
  }

  // 5 cashiers
  for (let i = 1; i <= 5; i++) {
    usersToCreate.push({
      utorid: `cashier${i}`,
      role: "cashier",
      password: "Cashier123!",
      email: `cashier${i}@mail.utoronto.ca`,
      name: `Cashier${i}`,
    });
  }

  // 8 regular users
  for (let i = 1; i <= 8; i++) {
    usersToCreate.push({
      utorid: `regular${i}`,
      role: "regular",
      password: "Regular123!",
      email: `regular${i}@mail.utoronto.ca`,
      name: `Regular${i}`,
    });
  }

  // Special users
  const roleBasedFlags = {
    manager: {
      suspiciousUtorid: "manager3",
      unverifiedUtorid: "manager4",
      unactivatedUtorid: "manager5",
    },
    cashier: {
      suspiciousUtorid: "cashier3",
      unverifiedUtorid: "cashier4",
      unactivatedUtorid: "cashier5",
    },
    regular: {
      suspiciousUtorid: "regular6",
      unverifiedUtorid: "regular7",
      unactivatedUtorid: "regular8",
    },
  };

  // Create users in db
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(now.getDate() + 7);

  let createdCount = 0;

  for (const user of usersToCreate) {
    // skip if exists
    const exists = await prisma.user.findUnique({
      where: { utorid: user.utorid },
    });
    if (exists) {
      continue;
    }

    // Attributes
    const points = randInt(10, 100);
    const birthday = Math.random() < 0.5 ? randomBirthday() : null;
    const lastLogin =
      Math.random() < 0.5 == 0
        ? new Date(
            now.getTime() - randInt(0, 14) * 24 * 60 * 60 * 1000
          ).toISOString()
        : null;
    let suspicious = false;
    let verified = true;
    let activated = true;
    const flags = roleBasedFlags[user.role];
    if (flags) {
      if (user.utorid === flags.suspiciousUtorid) suspicious = true;
      if (user.utorid === flags.unverifiedUtorid) verified = false;
      if (user.utorid === flags.unactivatedUtorid) activated = false;
    }

    const resetToken = uuidv4();

    const created = await prisma.user.create({
      data: {
        utorid: user.utorid,
        email: user.email,
        password: user.password,
        role: user.role,
        name: user.name,
        birthday: birthday,
        lastLogin: lastLogin,
        points: points,
        activated: activated,
        verified: verified,
        suspicious: suspicious,
        createdAt: now.toISOString(),
        token: "tempToken",
        expiresAt: expiresAt.toISOString(),
        resetToken: resetToken,
        resetExpiresAt: expiresAt.toISOString(),
      },
    });
    console.log(created.utorid, created.resetToken);
    // generate token and update
    const { token } = createAuthToken(created);
    await prisma.user.update({ where: { id: created.id }, data: { token } });
    createdCount++;
  }
  console.log(`${createdCount} new users created.`);
}

async function createPromotions() {
  const names = [
    "Super Sale",
    "Mega Deal",
    "Ultra Discount",
    "Flash Boost",
    "Weekend Bonus",
    "Holiday Offer",
    "Golden Special",
    "Hot Event",
    "Surprise Drop",
    "Lucky Discount",
    "Super Bonus",
    "Golden Reward",
  ];
  const descriptions = [
    "Limited time only",
    "While supplies last",
    "Members only",
    "Dont miss out",
    "Weekend only",
    "Today only",
    "Ends soon",
    "Exclusive",
    "Online only",
    "In-store only",
    "Early bird",
    "Buy one get one free",
  ];

  let createdCount = 0;
  for (let i = 0; i < 12; i++) {
    const name = names[i];
    const description = descriptions[i];
    const minSpending = Math.random() < 0.5 ? randInt(10, 300) : null;
    const { startTime, endTime } = randomDateRange();
    const used = Math.random() < 0.3 ? true : false;
    const rate = Math.random() < 0.5 ? randFloat(0.05, 0.5, 2) : null;
    const points = Math.random() < 0.5 ? randInt(10, 60) : null;
    const type =
      Math.random < 0.5 ? PromotionType.onetime : PromotionType.automatic;
    const affectedUsers = await pickRandomUsers(1, 5);

    const exists = await prisma.promotion.findFirst({
      where: { name: name },
    });
    if (exists) {
      continue;
    }

    await prisma.promotion.create({
      data: {
        name,
        description,
        type,
        used,
        startTime,
        endTime,
        points,
        rate,
        minSpending,
        users: { connect: affectedUsers },
      },
    });
    createdCount++;
  }
  console.log(`${createdCount} new promotions created.`);
}

async function createEvents() {
  const names = [
    "Super Sale",
    "Mega Deal",
    "Ultra Discount",
    "Flash Boost",
    "Weekend Bonus",
    "Holiday Offer",
    "Golden Special",
    "Hot Event",
    "Surprise Drop",
    "Lucky Discount",
    "Super Bonus",
    "Golden Reward",
  ];
  const descriptions = [
    "Limited time only",
    "While supplies last",
    "Members only",
    "Dont miss out",
    "Weekend only",
    "Today only",
    "Ends soon",
    "Exclusive",
    "Online only",
    "In-store only",
    "Early bird",
    "Buy one get one free",
  ];
  const locations = [
    "Dusty Divot",
    "Tilted Towers",
    "Retail Row",
    "Tomato Town",
    "Junk Yard Junction",
    "Pleasant Park",
    "Shifty Shafts",
    "Snobby Shores",
    "Wailing Woods",
    "Lucky Landing",
    "Anarchy Acres",
    "Fatal Fields",
  ];

  let createdCount = 0;
  for (let i = 0; i < 12; i++) {
    const name = names[i];
    const description = descriptions[i];
    const location = locations[i];
    const { startTime, endTime } = randomDateRange();
    const published = Math.random() < 0.1 ? true : false;
    const pointsRemain = randInt(50, 200);
    const pointsAwarded = randInt(10, 60);
    const organizerUsers = await pickRandomUsers(1, 3);
    const guestUsers = await pickRandomUsers(1, 5);
    const capacity =
      Math.random() < 0.5
        ? randInt(guestUsers.length, guestUsers.length + 8)
        : null;

    const exists = await prisma.event.findFirst({
      where: { name: name },
    });
    if (exists) {
      continue;
    }

    await prisma.event.create({
      data: {
        name,
        description,
        location,
        published,
        capacity,
        pointsRemain,
        pointsAwarded,
        startTime,
        endTime,
        organizers: { connect: organizerUsers },
        guests: { connect: guestUsers },
      },
    });
    createdCount++;
  }
  console.log(`${createdCount} new events created.`);
}

async function createTransactions() {
  const remarks = [
    "Manual adjustment",
    "Customer requested change",
    "Event participation",
    "Transfer between accounts",
    "Fraud review pending",
    "Bulk redemption",
    "Loyalty correction",
    "System sync",
    "Birthday bonus",
    "Promo applied incorrectly",
  ];

  const promotions = await prisma.promotion.findMany();
  const events = await prisma.event.findMany();
  const allUsers = await prisma.user.findMany();
  const nonRegularusers = allUsers.filter((user) => user.role !== "regular");
  const cashiers = allUsers.filter((user) => user.role === "cashier");

  const randomPromotions = () => {
    const mixed = [...promotions].sort(() => Math.random() - 0.5);
    return mixed
      .slice(0, randInt(1, Math.min(2, promotions.length)))
      .map((promos) => ({ id: promos.id }));
  };

  let count = 0;

  const createTrans = async (type) => {
    // Pick random user
    const user = allUsers[randInt(0, allUsers.length - 1)];

    // Fields
    const spent =
      type === "purchase" || type === "redemption"
        ? randInt(10, 500)
        : type === "transfer"
        ? 0
        : randInt(0, 50);
    const amount = randInt(1, user.points);
    const suspicious = Math.random() < 0.3;
    const remark =
      Math.random() < 0.5 ? remarks[randInt(0, remarks.length - 1)] : null;
    const promoConnect = Math.random() < 0.2 ? randomPromotions() : [];

    // Creator can be themself or authority users
    const creator =
      Math.random() < 0.6
        ? user
        : nonRegularusers[
            randInt(0, Math.max(nonRegularusers.length - 1, 0))
          ] || user;

    // relatedId per type
    let relatedId = null;
    let processed = true;
    let processor = null;
    if (type === "transfer") {
      // Pick ranomd user not the current user
      const others = allUsers.filter((u) => u.id !== user.id);
      let otherUser = others[randInt(0, Math.max(others.length - 1, 0))];
      relatedId = otherUser.id;
    } else if (type === "redemption") {
      processed = Math.random() < 0.5;
      processor = processed
        ? cashiers[randInt(0, Math.max(cashiers.length - 1, 0))]
        : null;
      relatedId = processor ? processor.id : null;
    } else if (type === "event") {
      // link to random event
      relatedId = events[randInt(0, Math.max(events.length - 1, 0))].id;
    } else if (type === "adjustment") {
      // link to random transaction
      const transactions = await prisma.transaction.findMany();
      relatedId =
        transactions[randInt(0, Math.max(transactions.length - 1, 0))].id;
    }

    await prisma.transaction.create({
      data: {
        type,
        spent,
        amount,
        suspicious,
        processed: processed,
        remark,
        relatedId,
        user: { connect: { id: user.id } },
        creator: { connect: { id: creator.id } },
        processor: processor ? { connect: { id: processor.id } } : undefined,
        promotionIds: promoConnect.length
          ? { connect: promoConnect }
          : undefined,
      },
    });

    count += 1;
  };
  // Redemption
  for (let i = 0; i < 15; i++) await createTrans("redemption");
  // Event
  for (let i = 0; i < 15; i++) await createTrans("event");
  // Transfer
  for (let i = 0; i < 25; i++) await createTrans("transfer");
  // Purchase
  for (let i = 0; i < 15; i++) await createTrans("purchase");
  // Adjustment
  for (let i = 0; i < 10; i++) await createTrans("adjustment");

  console.log(`${count} new transactions created`);
}

async function seed() {
  console.log("Seed starting");
  await createUsers();
  await createPromotions();
  await createEvents();
  await createTransactions();
  console.log("Seed finished");
}

seed().finally(() => prisma.$disconnect());
