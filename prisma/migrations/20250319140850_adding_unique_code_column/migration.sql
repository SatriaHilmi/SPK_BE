/*
  Warnings:

  - You are about to drop the column `code` on the `subKriteria` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Kriteria` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codeId` to the `subKriteria` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_subKriteria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alternatif" TEXT NOT NULL,
    "codeId" TEXT NOT NULL,
    "nilai" TEXT NOT NULL,
    CONSTRAINT "subKriteria_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Kriteria" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_subKriteria" ("alternatif", "id", "nilai") SELECT "alternatif", "id", "nilai" FROM "subKriteria";
DROP TABLE "subKriteria";
ALTER TABLE "new_subKriteria" RENAME TO "subKriteria";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Kriteria_code_key" ON "Kriteria"("code");
