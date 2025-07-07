import { Router } from 'express'
import { verifyToken } from '../utils/verifyToken'
import { Criteria, PrismaClient } from '@prisma/client'
import { verifyRole } from '../utils/verifyRole'
const prisma = new PrismaClient()

const router = Router()
//get all kriteria
router.get('/', verifyToken, async (req, res) => {
  try {
    const kriteria = await prisma.kriteria.findMany()
    res.json(kriteria)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
})

// get by id kriteria
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  try {
    const kriteria = await prisma.kriteria.findUnique({
      where: {
        id: id
      }
    })
    res.json(kriteria)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
})

// create kriteria
router.post('/', verifyToken, async (req, res) => {
  const { name, code, weight, criteria } = req.body
  try {
    const kriteria = await prisma.kriteria.create({
      data: {
        name,
        code,
        weight,
        criteria,
      }
    })
    res.status(201).json(kriteria)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
})

// update kriteria
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  const { name, code, weight, criteria } = req.body
  try {
    const kriteria = await prisma.kriteria.update({
      where: {
        id: id
      },
      data: {
        name,
        code,
        weight,
        criteria,
      }
    })
    res.json(kriteria)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
})

// delete kriteria
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    await prisma.kriteria.delete({
      where: {
        id: id
      }
    })
    res.send('delete kriteria')
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
})

export default router