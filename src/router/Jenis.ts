import { Router } from "express";
import { verifyToken } from "../utils/verifyToken";
import { verifyRole } from "../utils/verifyRole";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const jenis = await prisma.jenisAlatMusik.findMany();
        res.json(jenis);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params
    try {
        const jenis = await prisma.jenisAlatMusik.findUnique({
            where: {
                id: id
            }
        })
        res.json(jenis)
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})


router.post('/', verifyToken, async (req, res) => {
    const { nama } = req.body;
    try {
        const jenis = await prisma.jenisAlatMusik.create({
            data: {
                nama
            },
        });
        res.status(201).json(jenis);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { nama } = req.body;

    try {
        const jenis = await prisma.jenisAlatMusik.update({
            where: {
                id: id
            },
            data: {
                nama
            }
        });
        res.json(jenis)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.jenisAlatMusik.delete({
            where: {
                id: id
            }
        });
        res.send("Jenis alat musik berhasil dihapus");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;