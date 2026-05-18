import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: BigInt(1) },
    update: {},
    create: {
      id: BigInt(1),
      username: 'zhangsan',
      email: 'zhangsan@example.com',
      phone: '13800000001',
      status: 'ACTIVE',
    },
  });

  await prisma.user.upsert({
    where: { id: BigInt(2) },
    update: {},
    create: {
      id: BigInt(2),
      username: 'lisi',
      email: 'lisi@example.com',
      phone: '13800000002',
      status: 'ACTIVE',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
