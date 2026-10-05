// Prisma seed file for Novum Labs IMS
// Step 2 Seed Script

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Novum Labs IMS initial database records...');

  // 1. Seed Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@novumlabs.edu' },
    update: {},
    create: {
      email: 'admin@novumlabs.edu',
      name: 'Engr. Mahfuz Alam',
      role: 'ADMIN',
      passwordHash: '$2b$10$EpI0j3pZ2eM1kL3q7fN2O.fXvL8xGj3t7pQe5wY4rB9vU8mD1xY6', // Mock bcrypt hash
    },
  });

  // 2. Seed Accountant
  const accountantUser = await prisma.user.upsert({
    where: { email: 'accounts@novumlabs.edu' },
    update: {},
    create: {
      email: 'accounts@novumlabs.edu',
      name: 'Harun Ur Rashid',
      role: 'ACCOUNTANT',
      passwordHash: '$2b$10$EpI0j3pZ2eM1kL3q7fN2O.fXvL8xGj3t7pQe5wY4rB9vU8mD1xY6',
    },
  });

  // 3. Seed Instructors
  const teacherUser1 = await prisma.user.upsert({
    where: { email: 'salman@novumlabs.edu' },
    update: {},
    create: {
      email: 'salman@novumlabs.edu',
      name: 'Dr. Salman Khan',
      role: 'TEACHER',
      passwordHash: '$2b$10$EpI0j3pZ2eM1kL3q7fN2O.fXvL8xGj3t7pQe5wY4rB9vU8mD1xY6',
      instructor: {
        create: {
          name: 'Dr. Salman Khan',
          email: 'salman@novumlabs.edu',
          phone: '+880 1819-876543',
          designation: 'Senior Lead Faculty',
          department: 'Software Engineering & Web',
          status: 'Active',
          bio: 'Specialized in React, Node.js, and Cloud Infrastructure.',
        },
      },
    },
  });

  // 4. Seed Course
  const course1 = await prisma.course.upsert({
    where: { code: 'FSD-301' },
    update: {},
    create: {
      code: 'FSD-301',
      title: 'Full-Stack Web Engineering with React & Node',
      description: 'Comprehensive 16-week intensive engineering track covering TypeScript, Next.js, Express, PostgreSQL, and scalable deployments.',
      durationWeeks: 16,
      totalFee: 24000,
    },
  });

  console.log('Seed completed successfully for Novum Labs IMS.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
