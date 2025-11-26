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

  // 3 managers
  for (let i = 1; i <= 3; i++) {
    usersToCreate.push({
      utorid: `manager${i}`,
      role: "manager",
      password: "Manager123!",
      email: `manager${i}@mail.utoronto.ca`,
      name: `Manager${i}`,
    });
  }

  // 3 cashiers
  for (let i = 1; i <= 3; i++) {
    usersToCreate.push({
      utorid: `cashier${i}`,
      role: "cashier",
      password: "Cashier123!",
      email: `cashier${i}@mail.utoronto.ca`,
      name: `Cashier${i}`,
    });
  }

  // 6 regular users
  for (let i = 1; i <= 6; i++) {
    usersToCreate.push({
      utorid: `regular${i}`,
      role: "regular",
      password: "Regular123!",
      email: `regular${i}@mail.utoronto.ca`,
      name: `Regular${i}`,
    });
  }

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

    const resetToken = uuidv4();

    const created = await prisma.user.create({
      data: {
        utorid: user.utorid,
        email: user.email,
        password: user.password,
        role: user.role,
        name: user.name,
        points: 0,
        activated: true,
        verified: true,
        suspicious: false,
        createdAt: now.toISOString(),
        token: "tempToken",
        expiresAt: expiresAt.toISOString(),
        resetToken: resetToken,
        resetExpiresAt: expiresAt.toISOString(),
      },
    });

    // generate token and update
    const { token } = createAuthToken(created);
    await prisma.user.update({ where: { id: created.id }, data: { token } });
    console.log(`Created: ${user.utorid} (${user.role})`);
    createdCount++;
  }
  console.log(`${createdCount} new users created.`);
}

async function createPromotions() {
  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const promotionsToCreate = [
    {
      name: "Super Sale",
      description: "Get 50% off on all items!",
      type: PromotionType.automatic,
      rate: 0.5,
      minSpending: null,
      points: null,
      used: false,
      startTime: now.toISOString(),
      endTime: in30.toISOString(),
    },
    {
      name: "Buy One Get One Free",
      description: "Buy one get one free!",
      type: PromotionType.onetime,
      rate: null,
      minSpending: null,
      points: null,
      used: false,
      startTime: now.toISOString(),
      endTime: in30.toISOString(),
    },
    {
      name: "Free Shipping",
      description: "Enjoy free shipping on orders over $50!",
      type: PromotionType.automatic,
      rate: null,
      minSpending: 50,
      points: null,
      used: false,
      startTime: now.toISOString(),
      endTime: in30.toISOString(),
    },
  ];

  let createdCount = 0;

  for (const promo of promotionsToCreate) {
    const exists = await prisma.promotion.findFirst({
      where: { name: promo.name },
    });
    if (exists) {
      continue;
    }

    await prisma.promotion.create({
      data: { ...promo, users: { connect: [{ utorid: "supersu1" }] } },
    });
    createdCount++;
  }
  console.log(`${createdCount} new promotions created.`);
}

async function seed() {
  console.log("Seed starting");
  await createUsers();
  await createPromotions();
  console.log("Seed finished");
}

seed().finally(() => prisma.$disconnect());
