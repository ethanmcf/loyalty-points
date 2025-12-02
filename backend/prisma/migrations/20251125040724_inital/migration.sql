-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "utorid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL,
    "birthday" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "activated" BOOLEAN NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "suspicious" BOOLEAN NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TEXT NOT NULL,
    "lastLogin" TEXT,
    "token" TEXT NOT NULL,
    "expiresAt" TEXT NOT NULL,
    "resetToken" TEXT NOT NULL,
    "resetExpiresAt" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "minSpending" INTEGER,
    "rate" REAL,
    "points" INTEGER,
    "used" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "spent" INTEGER NOT NULL,
    "remark" TEXT,
    "amount" INTEGER NOT NULL,
    "suspicious" BOOLEAN NOT NULL,
    "processed" BOOLEAN NOT NULL,
    "relatedId" INTEGER,
    "userId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "processorId" INTEGER,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Transaction_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Transaction_processorId_fkey" FOREIGN KEY ("processorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "capacity" INTEGER,
    "pointsRemain" INTEGER NOT NULL,
    "pointsAwarded" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "_UserPromotions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserPromotions_A_fkey" FOREIGN KEY ("A") REFERENCES "Promotion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserPromotions_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TransationPromotions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TransationPromotions_A_fkey" FOREIGN KEY ("A") REFERENCES "Promotion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TransationPromotions_B_fkey" FOREIGN KEY ("B") REFERENCES "Transaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Organizers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_Organizers_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Organizers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Guests" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_Guests_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Guests_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_utorid_key" ON "User"("utorid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_UserPromotions_AB_unique" ON "_UserPromotions"("A", "B");

-- CreateIndex
CREATE INDEX "_UserPromotions_B_index" ON "_UserPromotions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TransationPromotions_AB_unique" ON "_TransationPromotions"("A", "B");

-- CreateIndex
CREATE INDEX "_TransationPromotions_B_index" ON "_TransationPromotions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Organizers_AB_unique" ON "_Organizers"("A", "B");

-- CreateIndex
CREATE INDEX "_Organizers_B_index" ON "_Organizers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Guests_AB_unique" ON "_Guests"("A", "B");

-- CreateIndex
CREATE INDEX "_Guests_B_index" ON "_Guests"("B");
