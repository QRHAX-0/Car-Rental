// prisma/seed.ts

import {
  BookingStatus,
  PrismaClient,
  Role,
  Transmission,
} from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  console.log('🌱 Starting Seeding...');

  await prisma.rental.deleteMany();
  await prisma.carImages.deleteMany(); // Added CarImages cleanup
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();
  await prisma.agency.deleteMany();

  console.log('🧹 Database cleaned');

  const hashedPassword = await bcrypt.hash('123123', 10);

  const agencyAlpha = await prisma.agency.create({
    data: {
      name: 'Alpha Cars Co.',
      logo: 'https://placehold.co/100x100/png',
      isActive: true,
    },
  });

  const agencyBeta = await prisma.agency.create({
    data: {
      name: 'Beta Rentals Ltd.',
      isActive: true,
    },
  });

  console.log('🏢 Agencies created');

  await prisma.user.create({
    data: {
      email: 'super@app.com',
      name: 'Super Manager',
      phoneNumber: '+20123456789',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@alpha.com',
      name: 'Alpha Owner',
      password: hashedPassword,
      phoneNumber: '+20223456789',
      role: Role.ADMIN,
      agencyId: agencyAlpha.id,
    },
  });
  const agentUser = await prisma.user.create({
    data: {
      email: 'agent@alpha.com',
      name: 'Alpha Staff Member',
      password: hashedPassword,
      role: Role.AGENT,
      agencyId: agencyAlpha.id,
      phoneNumber: '+20323456789',
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@beta.com',
      name: 'Beta Owner',
      password: hashedPassword,
      role: Role.ADMIN,
      agencyId: agencyBeta.id,
      phoneNumber: '+20423456789',
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      email: 'client@gmail.com',
      name: 'Normal Client',
      password: hashedPassword,
      role: Role.USER,
      phoneNumber: '+20523456789',
    },
  });

  console.log('👥 Users created');

  const car1 = await prisma.car.create({
    data: {
      model: 'Corolla',
      brand: 'Toyota',
      year: 2024,
      pricePerDay: 1000,
      category: 'Sedan',
      seatingCapacity: 5,
      fuelType: 'Petrol',
      transmission: Transmission.AUTOMATIC,
      location: 'Cairo',
      description: 'Brand new Toyota Corolla',
      agencyId: agencyAlpha.id,
      images: {
        create: [
          { image: 'https://placehold.co/600x400/png' },
          { image: 'https://placehold.co/600x400/png' },
        ],
      },
    },
  });

  await prisma.car.create({
    data: {
      model: 'Cerato',
      brand: 'Kia',
      year: 2023,
      pricePerDay: 900,
      category: 'Sedan',
      seatingCapacity: 5,
      fuelType: 'Petrol',
      transmission: Transmission.AUTOMATIC,
      location: 'Giza',
      description: 'Kia Cerato K3',
      agencyId: agencyAlpha.id,
      images: {
        create: [{ image: 'https://placehold.co/600x400/png' }],
      },
    },
  });

  await prisma.car.create({
    data: {
      model: 'C180',
      brand: 'Mercedes',
      year: 2025,
      pricePerDay: 5000,
      category: 'Luxury',
      seatingCapacity: 4,
      fuelType: 'Petrol',
      transmission: Transmission.AUTOMATIC,
      location: 'Alexandria',
      description: 'Luxury for VIPs',
      agencyId: agencyBeta.id,
      images: {
        create: [
          { image: 'https://placehold.co/600x400/png' },
          { image: 'https://placehold.co/600x400/png' },
          { image: 'https://placehold.co/600x400/png' },
        ],
      },
    },
  });

  console.log('🚗 Cars & Images created');

  await prisma.rental.create({
    data: {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      totalPrice: 3000,
      status: BookingStatus.ACTIVE,
      customerId: clientUser.id,
      carId: car1.id,
      pickupStaffId: agentUser.id,
    },
  });

  console.log('📝 Sample rental created');
  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
