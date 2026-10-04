import { PrismaClient, LaundryStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Akun Kasir Default (US-01)
  const user = await prisma.user.upsert({
    where: { username: 'kasir' },
    update: {},
    create: {
      name: 'Kasir Sayangan',
      username: 'kasir',
      password: 'password123', // Nanti dapat di-hash menggunakan bcrypt
    },
  });

  // 2. Data Pelanggan Tersimpan (Masukan Pak Gunawan)
  const customer1 = await prisma.customer.upsert({
    where: { phone: '081234567890' },
    update: {},
    create: {
      name: 'Budi Santoso',
      phone: '081234567890',
      address: 'Jl. Garuda No. 12',
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { phone: '089876543210' },
    update: {},
    create: {
      name: 'Bu Sisri',
      phone: '089876543210',
      address: 'Perumahan Indah Asri B-3',
    },
  });

  // 3. Data Sampel Transaksi
  await prisma.transaction.upsert({
    where: { invoiceNumber: 'INV-202610-001' },
    update: {},
    create: {
      invoiceNumber: 'INV-202610-001',
      userId: user.id,
      customerId: customer1.id,
      serviceType: 'Cuci & Setrika',
      weight: 3.0,
      pricePerKg: 8000,
      totalPrice: 24000,
      status: LaundryStatus.DISETRIKA,
      paymentStatus: PaymentStatus.LUNAS,
    },
  });

  console.log('Database seeding berhasil diselesaikan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });