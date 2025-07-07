import { PrismaClient } from '@prisma/client'
import { Router, Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/verifyToken'
import { ResponseDTO } from '../types'
const router = Router()
const prisma = new PrismaClient()
//get one user
//@ts-ignore
router.get('/:id', verifyToken, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params
  const user = await prisma.user.findUnique({
    where: { id },
    omit: {
      password: true,
      id: true
    }
  })
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json(user)
})

//get all users
//@ts-ignore
router.get('/', verifyToken, async (req, res):Promise<ResponseDTO> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,      }
    })
    res.json({
      status: 200,
      message: 'Users found',
      data: users
    })
  }catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
})


export default router