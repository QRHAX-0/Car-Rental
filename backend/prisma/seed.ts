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
      description: `Engine: 3.0L Inline-6 Turbo with EQ Boost
Horsepower: 429 hp @ 6100 rpm
Interior: Exclusive Nappa Leather with ambient lighting
Tech: 12.8-inch OLED touchscreen & Burmester 3D Surround Sound
Safety: Active Distance Assist DISTRONIC`,
      agencyId: agencyAlpha.id,
      images: [
        'https://images.unsplash.com/photo-1622200294738-765f14e21262?q=80&w=1000',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000',
        'https://images.unsplash.com/photo-1629897159744-884279ba858c?q=80&w=1000',
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
      description: `Acceleration: 0 to 60 mph in 1.99 seconds
Range: Up to 396 miles per charge
Drivetrain: Tri-Motor All-Wheel Drive (1,020 hp)
Features: Yoke steering, 17-inch cinematic display
Autopilot: Full Self-Driving Capability included`,
      agencyId: agencyAlpha.id,
      images: [
        'https://images.unsplash.com/photo-1617704548623-340376566718?q=80&w=1000',
        'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=1000',
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
      description: `Engine: Naturally Aspirated 5.2L V10
Top Speed: 202 mph (325 km/h)
Drive: All-Wheel Drive with rear mechanical self-locking differential
Interior: Alcantara and Carbon Fiber trim
Exhaust: Sport exhaust system with a roaring signature sound`,
      agencyId: agencyAlpha.id,
      images: [
        'https://images.unsplash.com/photo-1620854497046-646a2a07c374?q=80&w=1000',
        'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1000',
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
      description: `Engine: 3.0L Twin-Turbo Flat-6
Horsepower: 443 hp
Acceleration: 0 to 60 mph in 3.5 seconds
Transmission: 8-speed Porsche Doppelkupplung (PDK)
Interior: 14-way Sport Seats with memory package`,
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
      description: `Engine: 6.75L Twin-Turbo V12
Ride: Planar Suspension System for a magic carpet ride
Interior: Starlight Headliner and open-pore wood trim
Cabin: Whisper-quiet acoustic insulation
Doors: Power-closing coach doors`,
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
      description: `Power: Dual Synchronous Electric Motors
Horsepower: Up to 637 hp with boost engaged
Acceleration: 0 to 60 mph in 3.1 seconds
Charging: 800-volt architecture for ultra-fast charging
Design: Carbon fiber roof and Matrix-design LED headlights`,
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
      description: `Engine: 4.4L TwinPower Turbo V8
Horsepower: 617 hp
Drivetrain: M xDrive All-Wheel Drive with 2WD mode
Exhaust: M Sport Exhaust System
Tech: Head-up display & Harman Kardon surround sound`,
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
      description: `Engine: 4.0L Twin-Turbocharged V8
Interior: Hand-crafted leather and sustainable veneers
Audio: Naim for Bentley 2200W premium audio system
Ride: Active All-Wheel Drive with air suspension
Display: Bentley Rotating Display`,
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
      description: `Power: Dual electric motors with Launch Control
Horsepower: Up to 750 hp (Overboost Power)
Acceleration: 0 to 60 mph in 2.6 seconds
Brakes: Porsche Ceramic Composite Brakes (PCCB)
Display: Curved 16.8-inch digital display for the driver`,
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
      description: `Engine: 4.4L Twin-Turbo V8
Comfort: 24-way heated and cooled massage front seats
Capability: Terrain Response 2 with all-wheel steering
Audio: Meridian Signature Sound System (35 speakers)
Design: Flush deployable door handles and panoramic roof`,
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
      description: `Engine: 4.0L Twin-Turbo V8
Horsepower: 710 hp
Design: Iconic Twin-Hinged Dihedral Doors
Aerodynamics: Active rear spoiler with air brake functionality
Chassis: Carbon fiber Monocage II for extreme rigidity`,
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
      description: `Range: EPA-estimated 520 miles on a single charge
Power: Dual Motor All-Wheel Drive (1,111 hp)
Interior: Glass Canopy roof for expansive views
Tech: 34-inch Glass Cockpit curved display
Charging: Adds 300 miles of range in just 20 minutes`,
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
      description: `Engine: 3.9L Twin-Turbo V8 (Award-winning)
Horsepower: 710 hp @ 8000 rpm
Acceleration: 0 to 62 mph in 2.9 seconds
Handling: Ferrari Dynamic Enhancer (FDE+)
Design: S-Duct front aero and lexan rear screen`,
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
      description: `Engine: Handcrafted 4.0L V8 Biturbo
Horsepower: 577 hp & 627 lb-ft of torque
Drive: AMG Performance 4MATIC All-Wheel Drive
Exhaust: Side-pipe exhaust system with adjustable flaps
Interior: G-Class specific Manufaktur leather and trim`,
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
      description: `Engine: 4.0L Twin-Turbo V8
Horsepower: 528 hp
Design: Clamshell hood and Aston Martin Aeroblade
Interior: Brogue detailing and full-grain leather
Tech: 360-degree bird's-eye camera system`,
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
