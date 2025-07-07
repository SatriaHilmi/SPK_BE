import { Router } from 'express';
import { verifyToken } from "../utils/verifyToken";
import { verifyRole } from "../utils/verifyRole";
import { PrismaClient } from "@prisma/client"; import { me } from './me';
import { url } from 'inspector';
import { any } from 'joi';
// import { imagekit } from '../utils/utils_image/imagekit';

const router = Router();
const prisma = new PrismaClient();

router.post('/', verifyToken, async (req, res) => {
    try {
        const { imageUrl } = req.body;
        //@ts-ignore
        const userId = req.user?.id; // Ambil ID dari token

        if (!imageUrl) {
            res.status(400).json({ message: 'Image URL is required' });
            return
        }

        if (!userId) {
            res.status(401).json({ message: 'User ID not found in token' });
            return
        }

        const savedImage = await prisma.user.update({
            where: { id: userId },
            data: {
                photo: imageUrl,
            },
        });

        res.status(201).json(savedImage);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user?.id; // Ambil ID dari token

        if (!userId) {
            res.status(401).json({ message: 'User ID not found in token' });
            return
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.delete('/', verifyToken, async (req, res) => {
    try {
        await prisma.user.update({
            //@ts-ignore
            where: { id: req.user?.id },
            data: {
                photo: "",
            },
        })
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
})

export default router;