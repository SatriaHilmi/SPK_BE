/*
  Warnings:

  - You are about to drop the `AlatMusik` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `alatMusikId` on the `subKriteria` table. All the data in the column will be lost.
  - Added the required column `alternatif` to the `subKriteria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codeId` to the `subKriteria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jenisId` to the `subKriteria` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AlatMusik";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_subKriteria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alternatif" TEXT NOT NULL,
    "codeId" TEXT NOT NULL,
    "jenisId" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL,
    CONSTRAINT "subKriteria_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Kriteria" ("code") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "subKriteria_jenisId_fkey" FOREIGN KEY ("jenisId") REFERENCES "JenisAlatMusik" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_subKriteria" ("id", "nilai") SELECT "id", "nilai" FROM "subKriteria";
DROP TABLE "subKriteria";
ALTER TABLE "new_subKriteria" RENAME TO "subKriteria";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
