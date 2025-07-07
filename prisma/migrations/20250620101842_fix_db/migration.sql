/*
  Warnings:

  - Added the required column `alatMusikId` to the `subKriteria` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "JenisAlatMusik" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AlatMusik" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "jenisId" TEXT NOT NULL,
    CONSTRAINT "AlatMusik_jenisId_fkey" FOREIGN KEY ("jenisId") REFERENCES "JenisAlatMusik" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_subKriteria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alternatif" TEXT NOT NULL,
    "codeId" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL,
    "alatMusikId" TEXT NOT NULL,
    CONSTRAINT "subKriteria_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Kriteria" ("code") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "subKriteria_alatMusikId_fkey" FOREIGN KEY ("alatMusikId") REFERENCES "AlatMusik" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_subKriteria" ("alternatif", "codeId", "id", "nilai") SELECT "alternatif", "codeId", "id", "nilai" FROM "subKriteria";
DROP TABLE "subKriteria";
ALTER TABLE "new_subKriteria" RENAME TO "subKriteria";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "JenisAlatMusik_name_key" ON "JenisAlatMusik"("name");
