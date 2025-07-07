-- CreateTable
CREATE TABLE "subKriteria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "altenatif" TEXT NOT NULL,
    "codeId" TEXT NOT NULL,
    "C1" INTEGER NOT NULL,
    "C2" INTEGER NOT NULL,
    "C3" INTEGER NOT NULL,
    "C4" INTEGER NOT NULL,
    CONSTRAINT "subKriteria_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Kriteria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
