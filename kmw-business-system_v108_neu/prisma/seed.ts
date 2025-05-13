import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin role
  const adminRole = await prisma.role.upsert({
    where: { key: 'ADMIN' },
    update: {},
    create: {
      key: 'ADMIN',
      name: 'Administrator',
      description: 'System Administrator with full access',
      rolePermissions: {
        create: [
          { key: 'ALL' }
        ]
      }
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
      name: 'System Administrator',
      password: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  console.log('Database has been seeded. 🌱');
  console.log('Admin credentials:');
  console.log('Username: admin');
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