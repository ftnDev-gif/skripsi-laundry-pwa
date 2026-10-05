'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createTransaction(formData: FormData) {
  const customerId = formData.get('customerId') as string;
  const customerName = formData.get('customerName') as string;
  const customerPhone = formData.get('customerPhone') as string;
  const weight = parseFloat(formData.get('weight') as string);
  const serviceId = formData.get('serviceId') as string;
  const paymentStatus = formData.get('paymentStatus') as 'LUNAS' | 'KASBON';

  const customerAddress = formData.get('customerAddress') as string | null;

  if (!weight || weight <= 0) {
    throw new Error('Berat tidak valid');
  }

  // Get default user (cashier) from seeding
  const defaultUser = await prisma.user.findFirst();
  if (!defaultUser) {
    throw new Error('Tidak ada user/kasir ditemukan. Lakukan seeding terlebih dahulu.');
  }

  // Handle Customer
  let finalCustomerId = customerId;
  if (!finalCustomerId) {
    if (!customerName || !customerPhone) {
      throw new Error('Nama dan nomor WhatsApp wajib diisi untuk pelanggan baru');
    }
    
    // Check if phone already exists just in case
    let existingCustomer = await prisma.customer.findUnique({
      where: { phone: customerPhone }
    });

    if (existingCustomer) {
      finalCustomerId = existingCustomer.id;
    } else {
      const newCustomer = await prisma.customer.create({
        data: {
          name: customerName,
          phone: customerPhone,
          address: customerAddress || null,
        }
      });
      finalCustomerId = newCustomer.id;
    }
  }

  // Service details (Hardcoded for now as in UI, ideally from DB if services were a table)
  let serviceType = '';
  let pricePerKg = 0;
  if (serviceId === 'cuci_setrika') {
    serviceType = 'Cuci & Setrika (Komplit)';
    pricePerKg = 6000;
  } else if (serviceId === 'cuci_lipat') {
    serviceType = 'Cuci Lipat (Cuci Saja)';
    pricePerKg = 4000;
  } else if (serviceId === 'setrika_saja') {
    serviceType = 'Setrika Saja';
    pricePerKg = 3000;
  }

  const totalPrice = weight * pricePerKg;

  // Generate Invoice Number (e.g. INV-YYYYMM-XXX)
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  
  // Count transactions this month
  const countThisMonth = await prisma.transaction.count({
    where: {
      invoiceNumber: {
        startsWith: `INV-${yearMonth}`
      }
    }
  });

  const nextNumber = (countThisMonth + 1).toString().padStart(3, '0');
  const invoiceNumber = `INV-${yearMonth}-${nextNumber}`;

  const transaction = await prisma.transaction.create({
    data: {
      invoiceNumber,
      userId: defaultUser.id,
      customerId: finalCustomerId,
      serviceType,
      weight,
      pricePerKg,
      totalPrice,
      status: 'ANTREAN',
      paymentStatus: paymentStatus,
    }
  });

  redirect(`/transactions/receipt?invoice=${transaction.invoiceNumber}`);
}

export async function getCustomers() {
  return await prisma.customer.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      phone: true,
      address: true,
    }
  });
}

export async function updateCustomerPhone(customerId: string, newPhone: string) {
  if (!newPhone) {
    throw new Error('Nomor telepon tidak boleh kosong');
  }
  
  const formattedPhone = '62' + newPhone.replace(/^0+/, '').replace(/\D/g, '');

  const existingCustomer = await prisma.customer.findUnique({
    where: { phone: formattedPhone },
  });

  if (existingCustomer && existingCustomer.id !== customerId) {
    throw new Error('Nomor WhatsApp ini sudah digunakan oleh pelanggan lain');
  }

  const updatedCustomer = await prisma.customer.update({
    where: { id: customerId },
    data: { phone: formattedPhone },
    select: { id: true, name: true, phone: true }
  });

  return updatedCustomer;
}
