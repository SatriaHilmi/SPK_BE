import { Router } from "express";
import { verifyToken } from "../utils/verifyToken";
import { subKriteria, PrismaClient } from "@prisma/client";
import { verifyRole } from "../utils/verifyRole";
const prisma = new PrismaClient();

const router = Router();
//get all subkriteria
router.get("/", verifyToken, async (req, res) => {
    try {
        const subkriteria = await prisma.subKriteria.findMany();
        res.json(subkriteria);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

//insert data subkriteria
router.post('/', verifyToken, async (req, res) => {
    const { alternatif, codeId, nilai, namaId } = req.body
    try {
        const isExist = await prisma.subKriteria.findFirst({
            where: { codeId, alternatif }
        })

        if (isExist) throw { message: 'Subkriteria already exist' }
        const getCriteria = await prisma.kriteria.findUnique({
            where: {
                code: codeId
            }
        })
        if (!getCriteria) throw { message: 'Kriteria not found' }
        const subkriteria = await prisma.subKriteria.create({
            data: {
                alternatif,
                nilai: parseInt(nilai),
                jenis: {
                    connect: {
                        nama: namaId
                    }
                },
                kriteria: {
                    connect: {
                        code: codeId
                    }
                }
            }
        })
        res.status(201).json(subkriteria)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', error });
    }
})

//update data subkriteria
router.put('/:id', verifyToken, async (req, res) => {
    const { alternatif, codeId, nilai, namaId } = req.body
    const { id } = req.params
    try {
        const subKriteria = await prisma.subKriteria.update({
            where: {
                id: id
            },
            data: {
                alternatif,
                nilai,
                jenis: {
                    connect: {
                        nama: namaId
                    }
                },
                kriteria: {
                    connect: {
                        code: codeId
                    }
                }
            }
        }
        )
        res.json(subKriteria)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' });
    }
})

//delete data subkriteria
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params
    try {
        const existingSubKriteria = await prisma.subKriteria.findUnique({
            where: { id }
        });
        if (!existingSubKriteria) throw { message: 'Subkriteria not found' }

        await prisma.subKriteria.delete({
            where: {
                id
            }
        });
        res.json({ message: 'Delete success' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', error });
    }
})

export default router;