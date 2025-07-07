/*
  Warnings:

  - You are about to drop the column `C1` on the `subKriteria` table. All the data in the column will be lost.
  - You are about to drop the column `C2` on the `subKriteria` table. All the data in the column will be lost.
  - You are about to drop the column `C3` on the `subKriteria` table. All the data in the column will be lost.
  - You are about to drop the column `C4` on the `subKriteria` table. All the data in the column will be lost.
  - You are about to drop the column `codeId` on the `subKriteria` table. All the data in the column will be lost.
  - Added the required column `code` to the `subKriteria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nilai` to the `subKriteria` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_subKriteria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alternatif" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nilai" TEXT NOT NULL,
    CONSTRAINT "subKriteria_code_fkey" FOREIGN KEY ("code") REFERENCES "Kriteria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_subKriteria" ("alternatif", "id") SELECT "alternatif", "id" FROM "subKriteria";
DROP TABLE "subKriteria";
ALTER TABLE "new_subKriteria" RENAME TO "subKriteria";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
