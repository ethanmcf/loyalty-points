/*
 * Complete this script so that it is able to add a superuser to the database
 * Usage example:
 *   node prisma/createsu.js clive123 clive.su@mail.utoronto.ca SuperUser123!
 */
"use strict";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const createAuthToken = require("../helpers/createAuthToken");

async function createSuperUser() {
  const args = process.argv;

  if (args.length !== 5) {
    console.error("usage: node prisma/createsu.js utorid email password");
    process.exit(1);
  }

  const [utorid, email, password] = args.slice(2);
  const foundUser = await prisma.user.findUnique({ where: { utorid: utorid } });

  if (foundUser) {
    console.error("super user already exists: " + utorid);
    process.exit(1);
  }

  const name = email.split("@")[0].split(".").join(" ");
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(now.getDate() + 7);

  const resetToken = uuidv4();

  const user = await prisma.user.create({
    data: {
      utorid: utorid,
      email: email,
      password: password,
      role: "superuser",
      name: name,
      points: 0,
      activated: true,
      verified: true,
      suspicious: false,
      createdAt: now.toISOString(),
      token: "tempToken", // temporary token
      expiresAt: expiresAt.toISOString(),
      resetToken: resetToken,
      resetExpiresAt: expiresAt.toISOString(),
    },
  });
  const { token, _ } = createAuthToken(user);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { token: token },
  });

  console.log(token);
  console.log(updatedUser);
}

createSuperUser().finally(() => prisma.$disconnect());
