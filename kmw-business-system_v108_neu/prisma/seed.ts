import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin role
  const adminRole = await prisma.role.upsert({
    where: { key: 'admin' },
    update: {},
    create: {
      key: 'admin',
    },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@kmw-business.de' },
    update: {},
    create: {
      email: 'admin@kmw-business.de',
      username: 'admin',
      name: 'Admin',
      password: hashedPassword,
      roleId: adminRole.id,
      active: true,
    },
  });

  console.log('Database has been seeded. 🌱');
  console.log('Admin credentials:');
  console.log('Email:', adminUser.email);
  console.log('Username:', adminUser.username);
  console.log('Password: Admin123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 