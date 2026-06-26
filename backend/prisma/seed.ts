// prisma/seed.ts

import {
  BookingStatus,
  PrismaClient,
  Role,
  Transmission,
} from '@prisma/client';
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
  await prisma.carImages.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();
  await prisma.agency.deleteMany();

  console.log('🧹 Database cleaned');

  const hashedPassword = await bcrypt.hash('123123', 10);

  // 1. إنشاء 5 شركات (Agencies)
  const agencyAlpha = await prisma.agency.create({
    data: {
      name: 'Alpha Cars Co.',
      logo: 'https://placehold.co/100x100/png',
      isActive: true,
    },
  });

  const agencyBeta = await prisma.agency.create({
    data: { name: 'Beta Rentals Ltd.', isActive: true },
  });

  const agencyGamma = await prisma.agency.create({
    data: { name: 'Gamma Luxury Auto', isActive: true },
  });

  const agencyDelta = await prisma.agency.create({
    data: { name: 'Delta Prestige Cars', isActive: true },
  });

  const agencyOmega = await prisma.agency.create({
    data: { name: 'Omega Exotic Rides', isActive: true },
  });

  console.log('🏢 5 Agencies created');

  // 2. إنشاء المستخدمين لكل شركة
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

  await prisma.user.create({
    data: {
      email: 'admin@gamma.com',
      name: 'Gamma Owner',
      password: hashedPassword,
      role: Role.ADMIN,
      agencyId: agencyGamma.id,
      phoneNumber: '+20623456789',
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@delta.com',
      name: 'Delta Owner',
      password: hashedPassword,
      role: Role.ADMIN,
      agencyId: agencyDelta.id,
      phoneNumber: '+20723456789',
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@omega.com',
      name: 'Omega Owner',
      password: hashedPassword,
      role: Role.ADMIN,
      agencyId: agencyOmega.id,
      phoneNumber: '+20823456789',
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

  console.log('👥 Users and Admins created');

  // 3. مصفوفة الأسطول (15 سيارة متوزعين على الـ 5 شركات)
  const fleetData = [
    // --- Alpha Cars Co. ---
    {
      model: 'S-Class S500',
      brand: 'Mercedes-Benz',
      year: 2024,
      pricePerDay: 350,
      category: 'LUXURY',
      seatingCapacity: 5,
      fuelType: 'Petrol',
      transmission: Transmission.AUTOMATIC,
      location: 'Manhattan, NY',
      description:
        'The ultimate luxury sedan experience. Perfect for VIP transport.',
      agencyId: agencyAlpha.id,
      images: [
        'https://loremflickr.com/800/500/mercedes?lock=1',
        'https://loremflickr.com/800/500/mercedes?lock=2',
        'https://loremflickr.com/800/500/mercedes?lock=3',
      ],
    },
    {
      model: 'Model S Plaid',
      brand: 'Tesla',
      year: 2024,
      pricePerDay: 250,
      category: 'ELECTRIC',
      seatingCapacity: 5,
      fuelType: 'Electric',
      transmission: Transmission.AUTOMATIC,
      location: 'JFK International Airport',
      description:
        'Experience the future of driving. 0 to 60 mph in 1.99 seconds.',
      agencyId: agencyAlpha.id,
      images: [
        'https://loremflickr.com/800/500/tesla?lock=1',
        'https://loremflickr.com/800/500/tesla?lock=2',
        'https://loremflickr.com/800/500/tesla?lock=3',
      ],
    },
    {
      model: 'Huracán EVO',
      brand: 'Lamborghini',
      year: 2023,
      pricePerDay: 850,
      category: 'SPORT',
      seatingCapacity: 2,
      fuelType: 'Petrol',
      transmission: Transmission.AUTOMATIC,
      location: 'Manhattan, NY',
      description: 'A naturally aspirated V10 engine roaring with power.',
      agencyId: agencyAlpha.id,
      images: [
        'https://loremflickr.com/800/500/lamborghini?lock=1',
        'https://loremflickr.com/800/500/lamborghini?lock=2',
        'https://loremflickr.com/800/500/lamborghini?lock=3',
      ],
    },

    // --- Beta Rentals Ltd. ---
    {
      model: '911 Carrera S',
      brand: 'Porsche',
      year: 2023,
      pricePerDay: 450,
      category: 'SPORT',
      seatingCapacity: 2,
      fuelType: 'Petrol',
      transmission: Transmission.AUTOMATIC,
      location: 'Brooklyn, NY',
      description: 'Pure driving dynamics and timeless design.',
      agencyId: agencyBeta.id,
      images: [
        'https://loremflickr.com/800/500/porsche?lock=1',
        'https://loremflickr.com/800/500/porsche?lock=2',
        'https://loremflickr.com/800/500/porsche?lock=3',
      ],
    },
    {
      model: 'Ghost',
      brand: 'Rolls-Royce',
      year: 2024,
      pricePerDay: 1200,
      category: 'LUXURY',
      seatingCapacity: 5,
      fuelType: 'Petrol',
      transmission: Transmission.AUTOMATIC,
      location: 'Queens, NY',
      description: 'Whisper-quiet luxury providing a magic carpet ride.',
      agencyId: agencyBeta.id,
      images: [
        'https://loremflickr.com/800/500/rollsroyce?lock=1',
        'https://loremflickr.com/800/500/rollsroyce?lock=2',
        'https://loremflickr.com/800/500/rollsroyce?lock=3',
      ],
    },
    {
      model: 'RS e-tron GT',
      brand: 'Audi',
      year: 2024,
      pricePerDay: 320,
      category: 'ELECTRIC',
      seatingCapacity: 5,
      fuelType: 'Electric',
      transmission: Transmission.AUTOMATIC,
      location: 'JFK International Airport',
      description: 'Sleek, silent, and incredibly fast electric hypercar.',
      agencyId: agencyBeta.id,
      images: [
        'https://loremflickr.com/800/500/audi?lock=1',
        'https://loremflickr.com/800/500/audi?lock=2',
        'https://loremflickr.com/800/500/audi?lock=3',
      ],
    },

    // --- Gamma Luxury Auto ---
    {
      model: 'M5 Competition',
      brand: 'BMW',
      year: 2023,
      pricePerDay: 400,
      category: 'SPORT',
      seatingCapacity: 5,
      fuelType: 'Petrol',
      transmission: Transmission.AUTOMATIC,
      location: 'Brooklyn, NY',
      description:
        'The perfect blend of a daily driver and track-ready monster.',
      agencyId: agencyGamma.id,
      images: [
        'https://loremflickr.com/800/500/bmw?lock=1',
        'https://loremflickr.com/800/500/bmw?lock=2',
        'https://loremflickr.com/800/500/bmw?lock=3',
      ],
    },
    {
      model: 'Continental GT',
      brand: 'Bentley',
      year: 2023,
      pricePerDay: 950,
      category: 'LUXURY',
      seatingCapacity: 4,
      fuelType: 'Petrol',
      transmission: Transmission.AUTOMATIC,
      location: 'Manhattan, NY',
      description: 'Travel across the city in absolute supreme comfort.',
      agencyId: agencyGamma.id,
      images: [
        'https://loremflickr.com/800/500/bentley?lock=1',
        'https://loremflickr.com/800/500/bentley?lock=2',
        'https://loremflickr.com/800/500/bentley?lock=3',
      ],
    },
    {
      model: 'Taycan Turbo S',
      brand: 'Porsche',
      year: 2024,
      pricePerDay: 380,
      category: 'ELECTRIC',
      seatingCapacity: 4,
      fuelType: 'Electric',
      transmission: Transmission.AUTOMATIC,
      location: 'Brooklyn, NY',
      description:
        'The Taycan redefines what a fully electric sports sedan feels like.',
      agencyId: agencyGamma.id,
      images: [
        'https://loremflickr.com/800/500/porsche?lock=4',
        'https://loremflickr.com/800/500/porsche?lock=5',
        'https://loremflickr.com/800/500/porsche?lock=6',
      ],
    },

    // --- Delta Prestige Cars ---
    {
      model: 'Range Rover',
      brand: 'Land Rover',
      year: 2024,
      pricePerDay: 450,
      category: 'LUXURY',
      seatingCapacity: 5,
      fuelType: 'Petrol',
      transmission: Transmission.AUTOMATIC,
      location: 'Staten Island, NY',
      description: 'Commanding presence and peerless refinement.',
      agencyId: agencyDelta.id,
      images: [
        'https://loremflickr.com/800/500/rangerover?lock=1',
        'https://loremflickr.com/800/500/rangerover?lock=2',
        'https://loremflickr.com/800/500/rangerover?lock=3',
      ],
    },
    {
      model: '720S',
      brand: 'McLaren',
      year: 2023,
      pricePerDay: 1000,
      category: 'SPORT',
      seatingCapacity: 2,
      fuelType: 'Petrol',
      transmission: Transmission.AUTOMATIC,
      location: 'Manhattan, NY',
      description: 'Ferociously fast yet beautifully elegant supercar.',
      agencyId: agencyDelta.id,
      images: [
        'https://loremflickr.com/800/500/mclaren?lock=1',
        'https://loremflickr.com/800/500/mclaren?lock=2',
        'https://loremflickr.com/800/500/mclaren?lock=3',
      ],
    },
    {
      model: 'Air Dream Edition',
      brand: 'Lucid',
      year: 2023,
      pricePerDay: 280,
      category: 'ELECTRIC',
      seatingCapacity: 5,
      fuelType: 'Electric',
      transmission: Transmission.AUTOMATIC,
      location: 'Queens, NY',
      description: 'Setting new standards for EV range and luxury.',
      agencyId: agencyDelta.id,
      images: [
        'https://loremflickr.com/800/500/lucid?lock=1',
        'https://loremflickr.com/800/500/lucid?lock=2',
        'https://loremflickr.com/800/500/lucid?lock=3',
      ],
    },

    // --- Omega Exotic Rides ---
    {
      model: 'F8 Tributo',
      brand: 'Ferrari',
      year: 2022,
      pricePerDay: 1100,
      category: 'SPORT',
      seatingCapacity: 2,
      fuelType: 'Petrol',
      transmission: Transmission.AUTOMATIC,
      location: 'Manhattan, NY',
      description:
        'Features the most powerful V8 ever mounted in a non-special series.',
      agencyId: agencyOmega.id,
      images: [
        'https://loremflickr.com/800/500/ferrari?lock=1',
        'https://loremflickr.com/800/500/ferrari?lock=2',
        'https://loremflickr.com/800/500/ferrari?lock=3',
      ],
    },
    {
      model: 'G63 AMG',
      brand: 'Mercedes-Benz',
      year: 2024,
      pricePerDay: 600,
      category: 'SPORT',
      seatingCapacity: 5,
      fuelType: 'Petrol',
      transmission: Transmission.AUTOMATIC,
      location: 'Brooklyn, NY',
      description:
        'Unmistakable design paired with an earth-shattering AMG V8 biturbo engine.',
      agencyId: agencyOmega.id,
      images: [
        'https://loremflickr.com/800/500/gwagon?lock=1',
        'https://loremflickr.com/800/500/gwagon?lock=2',
        'https://loremflickr.com/800/500/gwagon?lock=3',
      ],
    },
    {
      model: 'DB11',
      brand: 'Aston Martin',
      year: 2022,
      pricePerDay: 750,
      category: 'LUXURY',
      seatingCapacity: 4,
      fuelType: 'Petrol',
      transmission: Transmission.AUTOMATIC,
      location: 'Manhattan, NY',
      description: 'British elegance meets breathtaking performance.',
      agencyId: agencyOmega.id,
      images: [
        'https://loremflickr.com/800/500/astonmartin?lock=1',
        'https://loremflickr.com/800/500/astonmartin?lock=2',
        'https://loremflickr.com/800/500/astonmartin?lock=3',
      ],
    },
  ];

  const createdCars: any[] = [];

  for (const car of fleetData) {
    const createdCar = await prisma.car.create({
      data: {
        model: car.model,
        brand: car.brand,
        year: car.year,
        pricePerDay: car.pricePerDay,
        category: car.category as any,
        seatingCapacity: car.seatingCapacity,
        fuelType: car.fuelType,
        transmission: car.transmission,
        location: car.location,
        description: car.description,
        agencyId: car.agencyId,
        images: {
          create: car.images.map((img) => ({ image: img })),
        },
      },
    });
    createdCars.push(createdCar);
  }

  console.log(`🚗 ${createdCars.length} Luxury Cars & Images created`);

  const sampleCar = createdCars[0];
  await prisma.rental.create({
    data: {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      totalPrice: sampleCar.pricePerDay * 3,
      status: BookingStatus.ACTIVE,
      customerId: clientUser.id,
      carId: sampleCar.id,
      pickupStaffId: agentUser.id,
    },
  });

  console.log('📝 Sample rental created');
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
