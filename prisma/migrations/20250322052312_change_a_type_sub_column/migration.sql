/*
  Warnings:

  - You are about to alter the column `nilai` on the `subKriteria` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_subKriteria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alternatif" TEXT NOT NULL,
    "codeId" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL,
    CONSTRAINT "subKriteria_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Kriteria" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_subKriteria" ("alternatif", "codeId", "id", "nilai") SELECT "alternatif", "codeId", "id", "nilai" FROM "subKriteria";
DROP TABLE "subKriteria";
ALTER TABLE "new_subKriteria" RENAME TO "subKriteria";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
