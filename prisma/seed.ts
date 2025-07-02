import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@traininghub.com' },
    update: {},
    create: {
      email: 'admin@traininghub.com',
      firstName: 'Admin',
      lastName: 'User',
      password: adminPassword,
      role: 'ADMIN',
      department: 'Administration',
      position: 'System Administrator',
      location: 'Head Office',
    },
  });

  // Create manager user
  const managerPassword = await bcrypt.hash('manager123', 12);
  
  const manager = await prisma.user.upsert({
    where: { email: 'manager@traininghub.com' },
    update: {},
    create: {
      email: 'manager@traininghub.com',
      firstName: 'Manager',
      lastName: 'User',
      password: managerPassword,
      role: 'MANAGER',
      department: 'Human Resources',
      position: 'HR Manager',
      location: 'Head Office',
    },
  });

  // Create employee user
  const employeePassword = await bcrypt.hash('employee123', 12);
  
  const employee = await prisma.user.upsert({
    where: { email: 'employee@traininghub.com' },
    update: {},
    create: {
      email: 'employee@traininghub.com',
      firstName: 'Employee',
      lastName: 'User',
      password: employeePassword,
      role: 'EMPLOYEE',
      department: 'Engineering',
      position: 'Software Developer',
      location: 'Main Office',
    },
  });

  console.log('✅ Seeded users:');
  console.log('📧 Admin:', admin.email, '🔑 Password: admin123');
  console.log('📧 Manager:', manager.email, '🔑 Password: manager123');
  console.log('📧 Employee:', employee.email, '🔑 Password: employee123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });