/*
  Warnings:

  - You are about to drop the column `publishCapId` on the `Coin` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coin" (
    "objectId" TEXT NOT NULL PRIMARY KEY,
    "treasuryCapId" TEXT NOT NULL,
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
INSERT INTO "new_Coin" ("createdAt", "creator", "decimals", "description", "discordUrl", "iconUrl", "name", "objectId", "symbol", "telegramUrl", "treasuryCapId", "twitterUrl", "updatedAt", "website") SELECT "createdAt", "creator", "decimals", "description", "discordUrl", "iconUrl", "name", "objectId", "symbol", "telegramUrl", "treasuryCapId", "twitterUrl", "updatedAt", "website" FROM "Coin";
DROP TABLE "Coin";
ALTER TABLE "new_Coin" RENAME TO "Coin";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
