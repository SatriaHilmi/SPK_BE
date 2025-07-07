import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const seedAdmin = async () => {
  console.log('setup admin')
    const passwordDefault = 'admin1234'
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(passwordDefault, salt)

    await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        password: hash,
        username: "admin",
        name: "admin",
        role: "ADMIN"
      }
    })

    const getAdmin = await prisma.user.findFirst({
      where: {
        username: 'admin'
      },
      select: {
        username: true,
        email: true,
        role: true
      }
    })

    return console.log(getAdmin)
}
seedAdmin().catch((e) => {
  console.error(e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});