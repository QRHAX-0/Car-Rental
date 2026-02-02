// prisma/seed.ts

import { PrismaClient, Role, Transmission } from 'generated/prisma/client'; // تأكد من المسار حسب مشروعك
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg'; // لو بتستخدم Adapter خاص (زي Neon)
import { Pool } from 'pg'; // 👈 محتاجين ده لو بتستخدم الـ Adapter

// إعداد الاتصال (تأكد إن الإعدادات دي ماشية مع الـ setup بتاعك)
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// أو لو شغال local عادي ممكن تستخدم:
// const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Seeding...');

  // 1. تنظيف الداتابيز
  await prisma.rental.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();
  await prisma.agent.deleteMany();

  console.log('🧹 Database cleaned');

  // 2. تجهيز الثوابت (Password & Refresh Token)

  // أ) الباسورد الموحد
  const hashedPassword = await bcrypt.hash('123123', 10);

  // ب) الـ Refresh Token الموحد (عشان نجرب بيه) 👈 الجزئية الجديدة
  const staticRefreshToken = 'my-secret-refresh-token-123';
  const hashedRefreshToken = await bcrypt.hash(staticRefreshToken, 10);

  // 3. إنشاء الشركات (Agents)
  const agentA = await prisma.agent.create({
    data: { name: 'Alpha Cars Co.' },
  });

  const agentB = await prisma.agent.create({
    data: { name: 'Beta Rentals Co.' },
  });

  console.log('🏢 Agents created');

  // 4. إنشاء المستخدمين (Users)

  // -- Super Admin (مش محتاج توكن جاهز، هيدخل هو)
  await prisma.user.create({
    data: {
      email: 'super@app.com',
      name: 'Super Manager',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      hashedRefreshToken: null, // نبدأ نضيف
    },
  });

  // -- Admin Alpha
  await prisma.user.create({
    data: {
      email: 'admin@alpha.com',
      name: 'Alpha Admin',
      password: hashedPassword,
      role: Role.ADMIN,
      agentId: agentA.id,
      hashedRefreshToken: null,
    },
  });

  // -- Admin Beta
  await prisma.user.create({
    data: {
      email: 'admin@beta.com',
      name: 'Beta Admin',
      password: hashedPassword,
      role: Role.ADMIN,
      agentId: agentB.id,
      hashedRefreshToken: null,
    },
  });

  // -- Client (ده اللي هنديله التوكن عشان نجرب الـ Refresh Endpoint) 🧪
  await prisma.user.create({
    data: {
      email: 'client@gmail.com',
      name: 'Normal Client',
      password: hashedPassword,
      role: Role.USER,
      // 👇 بنخزن الهاش في الداتابيز
      hashedRefreshToken: hashedRefreshToken,
    },
  });

  console.log('👥 Users created (Client has a pre-set refresh token)');

  // 5. إنشاء العربيات (Cars)
  // ... (نفس الكود بتاعك للعربيات مفيش تغيير)
  await prisma.car.createMany({
    data: [
      {
        model: 'Corolla',
        brand: 'Toyota',
        year: 2024,
        price_per_day: 1000,
        image: 'https://placehold.co/600x400',
        category: 'Sedan',
        seating_capacity: 5,
        fuel_type: 'Petrol',
        transmission: Transmission.AUTOMATIC,
        location: 'Cairo',
        description: 'New Toyota Corolla',
        agentId: agentA.id,
      },
      // ... باقي العربيات
    ],
  });

  console.log('🚗 Cars created');
  console.log('✅ Seeding completed!');

  // طباعة معلومة مهمة ليك عشان متنساش
  console.log('\n🔑 Test Credentials:');
  console.log('Email: client@gmail.com');
  console.log('Pass: 123123');
  console.log(
    `Use this Refresh Token in Postman Headers/Cookies: ${staticRefreshToken}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
