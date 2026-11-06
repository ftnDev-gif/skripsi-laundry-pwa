'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { sendWhatsAppMessage } from '@/lib/fonnte';
import { generateReceiptMessage, generatePickupMessage } from '@/lib/whatsappTemplate';
import {
  LaundryStatus,
  mapOrderToTransactionView,
  toDbOrderStatus,
  toDbPaymentStatus,
} from '@/lib/orderMapper';

const DEFAULT_SERVICES: Record<
  string,
  { name: string; unit: string; price: number; estimatedDurationHours: number }
> = {
  cuci_setrika: {
    name: 'Cuci & Setrika (Komplit)',
    unit: 'kg',
    price: 6000,
    estimatedDurationHours: 24,
  },
  cuci_lipat: {
    name: 'Cuci Lipat (Cuci Saja)',
    unit: 'kg',
    price: 4000,
    estimatedDurationHours: 24,
  },
  setrika_saja: {
    name: 'Setrika Saja',
    unit: 'kg',
    price: 3000,
    estimatedDurationHours: 24,
  },
};

async function resolveService(serviceIdentifier: string) {
  const numericId = Number(serviceIdentifier);
  if (!Number.isNaN(numericId) && numericId > 0) {
    const byId = await prisma.service.findUnique({ where: { id: numericId } });
    if (byId) return byId;
  }

  const preset =
    DEFAULT_SERVICES[serviceIdentifier] || DEFAULT_SERVICES.cuci_setrika;

  const existing = await prisma.service.findFirst({
    where: { name: preset.name },
  });

  if (existing) {
    return existing;
  }

  return await prisma.service.create({
    data: {
      name: preset.name,
      unit: preset.unit,
      price: preset.price,
      estimatedDurationHours: preset.estimatedDurationHours,
    },
  });
}

export async function createTransaction(formData: FormData) {
  const customerId = formData.get('customerId') as string | null;
  const customerName = (formData.get('customerName') as string | null)?.trim() || '';
  const customerPhone = (formData.get('customerPhone') as string | null)?.trim() || '';
  const customerAddress = (formData.get('customerAddress') as string | null)?.trim() || null;
  const weight = parseFloat(formData.get('weight') as string);
  const serviceId = (formData.get('serviceId') as string) || 'cuci_setrika';
  const rawPaymentStatus = (formData.get('paymentStatus') as string) || 'LUNAS';
  const physicalNotes =
    ((formData.get('physicalNotes') || formData.get('notes')) as string | null)?.trim() || null;

  if (!weight || weight <= 0) {
    throw new Error('Berat tidak valid');
  }

  if (!customerId && (!customerName || !customerPhone)) {
    throw new Error('Nama dan nomor WhatsApp wajib diisi untuk pelanggan baru');
  }

  const formattedPhone = customerPhone
    ? customerPhone.startsWith('62')
      ? customerPhone.replace(/\D/g, '')
      : '62' + customerPhone.replace(/^0+/, '').replace(/\D/g, '')
    : '';

  // Pastikan layanan tersedia di tabel services
  const serviceRecord = await resolveService(serviceId);
  const unitPrice = Number(serviceRecord.price);
  const subtotal = weight * unitPrice;
  const totalPrice = subtotal;

  // Generate Nomor Invoice (contoh: INV-YYYYMM-XXX)
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;

  const countThisMonth = await prisma.order.count({
    where: {
      invoiceCode: {
        startsWith: `INV-${yearMonth}`,
      },
    },
  });

  const nextNumber = (countThisMonth + 1).toString().padStart(3, '0');
  const invoiceCode = `INV-${yearMonth}-${nextNumber}`;

  const estimatedCompletionDate = new Date(
    now.getTime() + serviceRecord.estimatedDurationHours * 60 * 60 * 1000
  );

  const dbPaymentStatus = toDbPaymentStatus(rawPaymentStatus);

  // Simpan Order beserta relasi Customer (connect / connectOrCreate) & OrderItem (nested write)
  const order = await prisma.order.create({
    data: {
      invoiceCode,
      totalPrice,
      paymentStatus: dbPaymentStatus,
      orderStatus: 'antre',
      qrCodePath: `/tracking/${invoiceCode}`,
      entryDate: now,
      estimatedCompletionDate,
      notes: physicalNotes,
      customer:
        customerId && customerId !== 'new'
          ? {
              connect: { id: Number(customerId) },
            }
          : {
              connectOrCreate: {
                where: { phoneNumber: formattedPhone },
                create: {
                  name: customerName,
                  phoneNumber: formattedPhone,
                  address: customerAddress,
                },
              },
            },
      orderItems: {
        create: [
          {
            serviceId: serviceRecord.id,
            quantity: weight,
            unitPrice,
            subtotal,
          },
        ],
      },
    },
    include: {
      customer: true,
      orderItems: {
        include: {
          service: true,
        },
      },
    },
  });

  const mappedOrder = mapOrderToTransactionView(order);

  // Kirim pesan WhatsApp & catat ke tabel notification_logs
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const trackingUrl = `${appUrl}/tracking/${order.invoiceCode}`;
    const waMessage = generateReceiptMessage({
      customerName: order.customer.name,
      invoiceNumber: order.invoiceCode,
      serviceType: mappedOrder.serviceType,
      weight: mappedOrder.weight,
      totalPrice: mappedOrder.totalPrice,
      trackingUrl,
      paymentStatus: mappedOrder.paymentStatus,
    });

    const waResult = await sendWhatsAppMessage(order.customer.phoneNumber, waMessage);

    await prisma.notificationLog.create({
      data: {
        orderId: order.id,
        recipientPhone: order.customer.phoneNumber,
        messageContent: waMessage,
        status:
          process.env.ENABLE_WHATSAPP_NOTIFICATION === 'false'
            ? 'queued'
            : waResult.success
              ? 'sent'
              : 'failed',
        gatewayResponse: JSON.stringify(waResult),
        sentAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Terjadi kesalahan saat memproses notifikasi WhatsApp:', error);
  }

  redirect(`/transactions/receipt?invoice=${order.invoiceCode}`);
}

export async function getCustomers() {
  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' },
  });

  return customers.map((c: any) => ({
    id: String(c.id),
    name: c.name,
    phone: c.phoneNumber,
    phoneNumber: c.phoneNumber,
    address: c.address,
  }));
}

export async function getServices() {
  const services = await prisma.service.findMany({
    orderBy: { id: 'asc' },
  });

  return services.map((s: any) => ({
    id: s.id,
    name: s.name,
    unit: s.unit,
    price: Number(s.price),
    estimatedDurationHours: s.estimatedDurationHours,
  }));
}

export async function updateCustomerPhone(customerId: string | number, newPhone: string) {
  if (!newPhone) {
    throw new Error('Nomor telepon tidak boleh kosong');
  }

  const parsedCustomerId = Number(customerId);
  const formattedPhone = '62' + newPhone.replace(/^0+/, '').replace(/\D/g, '');

  const existingCustomer = await prisma.customer.findUnique({
    where: { phoneNumber: formattedPhone },
  });

  if (existingCustomer && existingCustomer.id !== parsedCustomerId) {
    throw new Error('Nomor WhatsApp ini sudah digunakan oleh pelanggan lain');
  }

  const updatedCustomer = await prisma.customer.update({
    where: { id: parsedCustomerId },
    data: { phoneNumber: formattedPhone },
  });

  return {
    id: String(updatedCustomer.id),
    name: updatedCustomer.name,
    phone: updatedCustomer.phoneNumber,
    phoneNumber: updatedCustomer.phoneNumber,
  };
}

export async function updateTransactionStatus(
  transactionId: string | number,
  nextStatus: LaundryStatus | string
) {
  if (!transactionId || !nextStatus) {
    throw new Error('Transaction ID dan Status baru wajib diisi');
  }

  const dbStatus = toDbOrderStatus(nextStatus);
  const numericId = Number(transactionId);
  const whereClause =
    !Number.isNaN(numericId) && numericId > 0
      ? { id: numericId }
      : { invoiceCode: String(transactionId) };

  const order = await prisma.order.update({
    where: whereClause,
    data: {
      orderStatus: dbStatus,
      ...(dbStatus === 'selesai' ? { pickedUpAt: new Date() } : {}),
    },
    include: {
      customer: true,
      orderItems: {
        include: {
          service: true,
        },
      },
    },
  });

  // Kirim WhatsApp otomatis & catat ke notification_logs saat status berubah menjadi SIAP_DIAMBIL
  const isSiapDiambil =
    dbStatus === 'siap_diambil' ||
    String(nextStatus).toUpperCase() === 'SIAP_DIAMBIL';

  if (isSiapDiambil && order.customer?.phoneNumber) {
    try {
      const message = generatePickupMessage({
        customerName: order.customer.name,
        invoiceNumber: order.invoiceCode,
      });

      const waResult = await sendWhatsAppMessage(order.customer.phoneNumber, message);

      await prisma.notificationLog.create({
        data: {
          orderId: order.id,
          recipientPhone: order.customer.phoneNumber,
          messageContent: message,
          status:
            process.env.ENABLE_WHATSAPP_NOTIFICATION === 'false'
              ? 'queued'
              : waResult.success
                ? 'sent'
                : 'failed',
          gatewayResponse: JSON.stringify(waResult),
          sentAt: new Date(),
        },
      });
    } catch (error: any) {
      console.error('Gagal mengirim atau mencatat pesan WhatsApp otomatis (Siap Diambil):', error);
    }
  }

  // Revalidasi halaman dashboard, daftar transaksi, laporan, dan tracking agar UI terbarui
  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  revalidatePath('/reports');
  revalidatePath('/scan/[id]', 'page');
  revalidatePath('/tracking/[id]', 'page');

  return mapOrderToTransactionView(order);
}
