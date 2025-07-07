/*
  Warnings:

  - You are about to drop the column `jenisId` on the `subKriteria` table. All the data in the column will be lost.
  - Added the required column `namaId` to the `subKriteria` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_subKriteria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alternatif" TEXT NOT NULL,
    "codeId" TEXT NOT NULL,
    "namaId" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL,
    CONSTRAINT "subKriteria_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Kriteria" ("code") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "subKriteria_namaId_fkey" FOREIGN KEY ("namaId") REFERENCES "JenisAlatMusik" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_subKriteria" ("alternatif", "codeId", "id", "nilai") SELECT "alternatif", "codeId", "id", "nilai" FROM "subKriteria";
DROP TABLE "subKriteria";
ALTER TABLE "new_subKriteria" RENAME TO "subKriteria";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
