import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { bodyValidator } from '../middleware/body.validator'
import { loginSchema, registrationSchema } from '../schema/auth'

const router = Router()
const prisma = new PrismaClient()
const SECRET_KEY = process.env.SECRET_KEY ?? '';

//@ts-ignore
router.post('/login', bodyValidator(loginSchema), async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {

    const user = await prisma.user.findFirst({ where: { username: username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  } catch (e: unknown) {
    return res.status(500).json({ message: e });
  }
})



//@ts-ignore
router.post('/register', bodyValidator(registrationSchema), async (req: Request, res: Response): Promise<any> => {
  const { username, password, email, name } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const isEmailExist = await prisma.user.findFirst({ where: { email: email } });
    if (isEmailExist) {
      return res.status(400).json({ message: 'Email is already taken' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // save user
    await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
        name: name
      }
    });

    const token = jwt.sign({ username, email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({ status: 200, message: 'User registered successfully', data: { username, email }, token });
  } catch (e: unknown) {
    //@ts-ignore
    res.status(500).json({ message: e.message });
  }
});

export default router