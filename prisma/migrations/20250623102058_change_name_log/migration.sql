/*
  Warnings:

  - You are about to drop the column `name` on the `JenisAlatMusik` table. All the data in the column will be lost.
  - You are about to drop the column `alternatif` on the `subKriteria` table. All the data in the column will be lost.
  - You are about to drop the column `codeId` on the `subKriteria` table. All the data in the column will be lost.
  - Added the required column `codeId` to the `AlatMusik` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `JenisAlatMusik` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AlatMusik" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "codeId" TEXT NOT NULL,
    "jenisId" TEXT NOT NULL,
    CONSTRAINT "AlatMusik_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Kriteria" ("code") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AlatMusik_jenisId_fkey" FOREIGN KEY ("jenisId") REFERENCES "JenisAlatMusik" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AlatMusik" ("id", "jenisId", "name") SELECT "id", "jenisId", "name" FROM "AlatMusik";
DROP TABLE "AlatMusik";
ALTER TABLE "new_AlatMusik" RENAME TO "AlatMusik";
CREATE TABLE "new_JenisAlatMusik" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL
);
INSERT INTO "new_JenisAlatMusik" ("id") SELECT "id" FROM "JenisAlatMusik";
DROP TABLE "JenisAlatMusik";
ALTER TABLE "new_JenisAlatMusik" RENAME TO "JenisAlatMusik";
CREATE UNIQUE INDEX "JenisAlatMusik_nama_key" ON "JenisAlatMusik"("nama");
CREATE TABLE "new_subKriteria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nilai" INTEGER NOT NULL,
    "alatMusikId" TEXT NOT NULL,
    CONSTRAINT "subKriteria_alatMusikId_fkey" FOREIGN KEY ("alatMusikId") REFERENCES "AlatMusik" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_subKriteria" ("alatMusikId", "id", "nilai") SELECT "alatMusikId", "id", "nilai" FROM "subKriteria";
DROP TABLE "subKriteria";
ALTER TABLE "new_subKriteria" RENAME TO "subKriteria";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
