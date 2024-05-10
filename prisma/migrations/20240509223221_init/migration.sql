-- CreateTable
CREATE TABLE "Coin" (
    "objectId" TEXT NOT NULL PRIMARY KEY,
    "creator" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "twitterUrl" TEXT NOT NULL,
    "discordUrl" TEXT NOT NULL,
    "telegramUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
