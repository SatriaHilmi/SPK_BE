import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { verifyToken } from "../utils/verifyToken";
import { verifyRole } from "../utils/verifyRole";

const router = Router();
const prisma = new PrismaClient();

router.get('/matrix', verifyToken, verifyRole, async (req, res) => {
  try {
    // Ambil semua jenis alat musik
    const jenisList = await prisma.jenisAlatMusik.findMany({
      select: {
        nama: true
      }
    });

    const getCriteria = await prisma.kriteria.findMany({
      select: { code: true }
    });

    // Buat struktur data per jenis alat musik
    const matrixPerJenis = await Promise.all(
      jenisList.map(async (jenis) => {
        // Ambil alternatif unik berdasarkan jenis
        const alternatifPerJenis = await prisma.subKriteria.findMany({
          where: {
            namaId: jenis.nama
          },
          distinct: ['alternatif'],
          select: {
            alternatif: true,
          }
        });

        const dataTable = await Promise.all(
          alternatifPerJenis.map(async (item) => {
            const criteria = await prisma.subKriteria.findMany({
              where: {
                alternatif: item.alternatif,
                namaId: jenis.nama
              },
              select: {
                codeId: true,
                nilai: true
              },
              orderBy: {
                codeId: 'asc'
              }
            });
            return { alternatif: item.alternatif, criteria };
          })
        );

        return {
          jenis: jenis.nama,
          dataTable
        };
      })
    );

    res.json({
      dataHeader: getCriteria,
      matrixPerJenis
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/bobot', verifyToken, verifyRole, async (req, res) => {
  try {
    const bobot = await prisma.kriteria.findMany({
      select: {
        code: true,
        weight: true
      }
    })
    res.json(bobot)

  } catch (error: unknown) {
    res.status(500).json({ message: error });
  }
});

router.get('/normalisasi-bobot', verifyToken, verifyRole, async (req, res) => {
  try {
    const bobot = await prisma.kriteria.findMany({
      select: {
        code: true,
        weight: true
      }
    })

    const total = bobot.reduce((acc, item) => acc + item.weight, 0);
    const bobotNormalized = bobot.map((item) => {
      return {
        code: item.code,
        weight: item.weight / total
      }
    });
    res.json(bobotNormalized)
  }
  catch (error: unknown) {
    res.status(500).json({ message: error });
  }
})

router.get('/nilai-utility', verifyToken, verifyRole, async (req, res) => {
  try {
    // Ambil semua jenis alat musik
    const jenisList = await prisma.jenisAlatMusik.findMany({
      select: { nama: true }
    });

    // Iterasi per jenis untuk menghitung utility
    const matrixPerJenis = await Promise.all(
      jenisList.map(async (jenis) => {
        // Ambil semua kriteria
        const kriteriaList = await prisma.kriteria.findMany({
          orderBy: { code: 'asc' },
          include: {
            subKriteria: {
              where: {
                namaId: jenis.nama
              }
            }
          }
        });

        // Hitung utility per kriteria
        const processedKriteria = kriteriaList.map((k) => {
          const nilaiList = k.subKriteria.map(e => e.nilai);
          const max = Math.max(...nilaiList);
          const min = Math.min(...nilaiList);

          const subWithUtility = k.subKriteria.map((e) => {
            let nilaiUtility = 0;
            if (k.criteria === 'COST') {
              nilaiUtility = ((max - e.nilai) / (max - min)) * 100;
            } else {
              nilaiUtility = ((e.nilai - min) / (max - min)) * 100;
            }
            return { ...e, nilaiUtility: isNaN(nilaiUtility) ? 0 : nilaiUtility };
          });

          return {
            code: k.code,
            subKriteria: subWithUtility
          };
        });

        // Ambil alternatif unik
        const alternatifList = await prisma.subKriteria.findMany({
          where: {
            namaId: jenis.nama
          },
          distinct: ['alternatif'],
          select: { alternatif: true }
        });

        // Gabungkan nilai utility untuk setiap alternatif
        const dataTable = alternatifList.map((alt) => {
          const criteria = processedKriteria.map((k) => {
            const found = k.subKriteria.find(s => s.alternatif === alt.alternatif);
            return {
              id: found?.id ?? '',
              codeId: k.code,
              alternatif: alt.alternatif,
              nilai: found?.nilai ?? 0,
              nilaiUtility: found?.nilaiUtility ?? 0
            };
          });

          return { alternatif: alt.alternatif, criteria };
        });

        return {
          jenis: jenis.nama,
          dataHeader: processedKriteria.map(k => k.code),
          dataTable
        };
      })
    );

    res.json({ matrixPerJenis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/total-nilai', verifyToken, verifyRole, async (req, res) => {
  try {
    // Ambil semua jenis alat musik
    const jenisList = await prisma.jenisAlatMusik.findMany({
      select: { nama: true }
    });

    // Ambil semua kriteria + bobot
    const allKriteria = await prisma.kriteria.findMany({
      orderBy: { code: 'asc' },
    });
    const totalBobot = allKriteria.reduce((acc, cur) => acc + cur.weight, 0);

    const hasilPerJenis = await Promise.all(jenisList.map(async (jenis) => {
      // Ambil semua kriteria dan subkriteria yang sesuai dengan jenis
      const kriteriaList = await prisma.kriteria.findMany({
        orderBy: { code: 'asc' },
        include: {
          subKriteria: {
            where: { namaId: jenis.nama }
          }
        }
      });

      // Proses nilai utility per kriteria
      const kriteriaDenganUtility = kriteriaList.map((k) => {
        const nilaiList = k.subKriteria.map(s => s.nilai);
        const max = Math.max(...nilaiList);
        const min = Math.min(...nilaiList);
        const isConstant = max === min;

        const subKriteriaUtility = k.subKriteria.map(s => {
          let nilaiUtility = 0;
          if (isConstant) {
            nilaiUtility = 100;
          } else if (k.criteria === 'COST') {
            nilaiUtility = ((max - s.nilai) / (max - min)) * 100;
          } else {
            nilaiUtility = ((s.nilai - min) / (max - min)) * 100;
          }
          return { ...s, nilaiUtility };
        });

        return {
          ...k,
          subKriteria: subKriteriaUtility
        };
      });

      // Ambil alternatif unik berdasarkan jenis
      const alternatifList = await prisma.subKriteria.findMany({
        where: { namaId: jenis.nama },
        distinct: ['alternatif'],
        select: { alternatif: true }
      });

      // Hitung total nilai per alternatif
      const dataTable = alternatifList.map((alt) => {
        const nilaiTotal = kriteriaDenganUtility.reduce((sum, k) => {
          const bobot = k.weight;
          const normalisasi = bobot / totalBobot;
          const sub = k.subKriteria.find(s => s.alternatif === alt.alternatif);
          const utility = sub?.nilaiUtility ?? 0;
          return sum + (utility * normalisasi);
        }, 0);

        return {
          alternatif: alt.alternatif,
          totalNilai: parseFloat(nilaiTotal.toFixed(2)) // dibulatkan
        };
      });

      return {
        jenis: jenis.nama,
        data: dataTable.sort((a, b) => b.totalNilai - a.totalNilai)
      };
    }));

    res.status(200).json({ matrixTotal: hasilPerJenis });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/ranking', async (req, res) => {
  try {
    // Ambil semua jenis alat musik
    const jenisList = await prisma.jenisAlatMusik.findMany({
      select: { nama: true }
    });

    // Ambil semua kriteria
    const allKriteria = await prisma.kriteria.findMany({
      orderBy: { code: 'asc' }
    });
    const totalBobot = allKriteria.reduce((acc, item) => acc + item.weight, 0);

    // Proses per jenis
    const hasilPerJenis = await Promise.all(
      jenisList.map(async (jenis) => {
        // Ambil kriteria dengan subkriteria sesuai jenis
        const kriteriaList = await prisma.kriteria.findMany({
          orderBy: { code: 'asc' },
          include: {
            subKriteria: {
              where: { namaId: jenis.nama }
            }
          }
        });

        // Hitung utility
        const processedKriteria = kriteriaList.map((k) => {
          const nilaiList = k.subKriteria.map(s => s.nilai);
          const max = Math.max(...nilaiList);
          const min = Math.min(...nilaiList);
          const isConstant = max === min;

          const subKriteria = k.subKriteria.map((s) => {
            let nilaiUtility = 0;
            if (isConstant) {
              nilaiUtility = 100;
            } else if (k.criteria === 'COST') {
              nilaiUtility = ((max - s.nilai) / (max - min)) * 100;
            } else {
              nilaiUtility = ((s.nilai - min) / (max - min)) * 100;
            }
            return { ...s, nilaiUtility };
          });

          return { ...k, subKriteria };
        });

        // Ambil alternatif unik
        const alternatifList = await prisma.subKriteria.findMany({
          where: { namaId: jenis.nama },
          distinct: ['alternatif'],
          select: { alternatif: true }
        });

        // Hitung total nilai per alternatif
        const alternatifWithTotal = alternatifList.map((alt) => {
          const totalNilai = processedKriteria.reduce((sum, k) => {
            const sub = k.subKriteria.find(s => s.alternatif === alt.alternatif);
            const utility = sub?.nilaiUtility ?? 0;
            const normalisasi = k.weight / totalBobot;
            return sum + (utility * normalisasi);
          }, 0);

          return {
            alternatif: alt.alternatif,
            totalNilai: parseFloat(totalNilai.toFixed(2)),
          };
        });

        // Ranking per jenis
        const ranked = alternatifWithTotal
          .sort((a, b) => b.totalNilai - a.totalNilai)
          .map((item, index) => ({
            ...item,
            ranking: index + 1,
            jenis: jenis.nama
          }));

        return {
          jenis: jenis.nama,
          data: ranked
        };
      })
    );

    res.status(200).json(hasilPerJenis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;