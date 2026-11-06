import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as PrismaClient & {
  user: any;
  customer: any;
  service: any;
  order: any;
  orderItem: any;
  notificationLog: any;
};

async function main() {
  // 1. Akun Kasir Default (users)
  const user = await prisma.user.upsert({
    where: { email: 'kasir@sayangan.com' },
    update: {},
    create: {
      name: 'Kasir Sayangan',
      email: 'kasir@sayangan.com',
      password: 'sayangan123',
      role: 'kasir',
    },
  });

  // 2. Data Layanan Standar (services)
  const defaultServices = [
    {
      name: 'Cuci & Setrika (Komplit)',
      unit: 'kg',
      price: 6000,
      estimatedDurationHours: 24,
    },
    {
      name: 'Cuci Lipat (Cuci Saja)',
      unit: 'kg',
      price: 4000,
      estimatedDurationHours: 24,
    },
    {
      name: 'Setrika Saja',
      unit: 'kg',
      price: 3000,
      estimatedDurationHours: 24,
    },
  ];

  const seededServices: Array<{ id: number; name: string; unit: string; price: any }> = [];
  for (const svc of defaultServices) {
    const existing = await prisma.service.findFirst({
      where: { name: svc.name },
    });
    if (existing) {
      seededServices.push(existing);
    } else {
      const created = await prisma.service.create({ data: svc });
      seededServices.push(created);
    }
  }

  // 3. Data Pelanggan Tersimpan (customers)
  const customer1 = await prisma.customer.upsert({
    where: { phoneNumber: '6281234567890' },
    update: {},
    create: {
      name: 'Budi Santoso',
      phoneNumber: '6281234567890',
      address: 'Jl. Garuda No. 12',
    },
  });

  await prisma.customer.upsert({
    where: { phoneNumber: '6289876543210' },
    update: {},
    create: {
      name: 'Bu Sisri',
      phoneNumber: '6289876543210',
      address: 'Perumahan Indah Asri B-3',
    },
  });

  // 4. Data Sampel Pesanan (orders + order_items + notification_logs)
  const mainService = seededServices[0];
  const existingOrder = await prisma.order.findUnique({
    where: { invoiceCode: 'INV-202610-001' },
  });

  if (!existingOrder && mainService) {
    const order = await prisma.order.create({
      data: {
        invoiceCode: 'INV-202610-001',
        customerId: customer1.id,
        totalPrice: 18000,
        paymentStatus: 'paid',
        orderStatus: 'disetrika',
        qrCodePath: '/tracking/INV-202610-001',
        notes: 'Tidak ada catatan khusus',
        orderItems: {
          create: [
            {
              serviceId: mainService.id,
              quantity: 3.0,
              unitPrice: 6000,
              subtotal: 18000,
            },
          ],
        },
        notificationLogs: {
          create: [
            {
              recipientPhone: customer1.phoneNumber,
              messageContent:
                'Halo *Budi Santoso*, terima kasih telah mencuci di *Sayangan Laundry*! Nomor Resi: INV-202610-001',
              status: 'sent',
              gatewayResponse: '{"status":true}',
            },
          ],
        },
      },
    });
    console.log(`Sampel order dibuat: ${order.invoiceCode} oleh ${user.name}`);
  }

  console.log('Database seeding 6 tabel berhasil diselesaikan!');
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
