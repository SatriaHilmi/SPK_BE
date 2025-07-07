import { Request, Response, Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '../utils/verifyToken'
const prisma = new PrismaClient()
const router = Router()
export const me = async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req.user?.id; // Ambil id dari req.user
  if (!userId) {
    res.status(400).json({ message: 'User ID not found in token' });
  }
  const profile = await prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      username: true,
      email: true,
      name: true,
      role: true
    }
  })
  if (!profile) {
    res.status(404).json({ message: 'User not found' });
  }
  res.json({
    status: 200,
    message: 'User found',
    data: profile
  })
}

router.get('/', verifyToken, me)

export default router;