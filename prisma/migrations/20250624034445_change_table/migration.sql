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
    CONSTRAINT "subKriteria_namaId_fkey" FOREIGN KEY ("namaId") REFERENCES "JenisAlatMusik" ("nama") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_subKriteria" ("alternatif", "codeId", "id", "namaId", "nilai") SELECT "alternatif", "codeId", "id", "namaId", "nilai" FROM "subKriteria";
DROP TABLE "subKriteria";
ALTER TABLE "new_subKriteria" RENAME TO "subKriteria";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
