import type { Customer, Order, OrderItem, Service } from '@prisma/client';

export const LaundryStatus = {
  ANTREAN: 'ANTREAN',
  DICUCI: 'DICUCI',
  DISETRIKA: 'DISETRIKA',
  SIAP_DIAMBIL: 'SIAP_DIAMBIL',
  SELESAI: 'SELESAI',
} as const;

export type LaundryStatus = (typeof LaundryStatus)[keyof typeof LaundryStatus];

export const PaymentStatus = {
  LUNAS: 'LUNAS',
  KASBON: 'KASBON',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export type OrderWithRelations = Order & {
  customer: Customer;
  orderItems: (OrderItem & {
    service: Service;
  })[];
};

export function toDbOrderStatus(status: LaundryStatus | string): string {
  const normalized = (status || '').toUpperCase();
  switch (normalized) {
    case 'ANTREAN':
    case 'ANTRE':
      return 'antre';
    case 'DICUCI':
      return 'dicuci';
    case 'DISETRIKA':
      return 'disetrika';
    case 'SIAP_DIAMBIL':
      return 'siap_diambil';
    case 'SELESAI':
      return 'selesai';
    default:
      return 'antre';
  }
}

export function fromDbOrderStatus(orderStatus: string): LaundryStatus {
  const normalized = (orderStatus || '').toLowerCase();
  switch (normalized) {
    case 'antre':
    case 'antrean':
      return LaundryStatus.ANTREAN;
    case 'dicuci':
      return LaundryStatus.DICUCI;
    case 'disetrika':
      return LaundryStatus.DISETRIKA;
    case 'siap_diambil':
      return LaundryStatus.SIAP_DIAMBIL;
    case 'selesai':
      return LaundryStatus.SELESAI;
    default:
      return LaundryStatus.ANTREAN;
  }
}

export function toDbPaymentStatus(status: PaymentStatus | string): string {
  const normalized = (status || '').toUpperCase();
  if (normalized === 'LUNAS' || normalized === 'PAID') {
    return 'paid';
  }
  return 'unpaid';
}

export function fromDbPaymentStatus(paymentStatus: string): PaymentStatus {
  const normalized = (paymentStatus || '').toLowerCase();
  if (normalized === 'paid' || normalized === 'lunas') {
    return PaymentStatus.LUNAS;
  }
  return PaymentStatus.KASBON;
}

export function mapOrderToTransactionView(order: OrderWithRelations) {
  const primaryItem = order.orderItems?.[0];
  const totalWeight =
    order.orderItems && order.orderItems.length > 0
      ? order.orderItems.reduce((acc, item) => acc + Number(item.quantity), 0)
      : 0;
  const unitPrice = primaryItem ? Number(primaryItem.unitPrice) : 0;
  const serviceName =
    order.orderItems && order.orderItems.length > 0
      ? order.orderItems.map((item) => item.service.name).join(', ')
      : 'Cuci & Setrika (Komplit)';

  return {
    id: String(order.id),
    orderId: order.id,
    invoiceNumber: order.invoiceCode,
    invoiceCode: order.invoiceCode,
    customerId: String(order.customerId),
    serviceType: serviceName,
    weight: Number(totalWeight.toFixed(2)),
    pricePerKg: unitPrice,
    totalPrice: Number(order.totalPrice),
    status: fromDbOrderStatus(order.orderStatus),
    orderStatus: order.orderStatus,
    paymentStatus: fromDbPaymentStatus(order.paymentStatus),
    rawPaymentStatus: order.paymentStatus,
    notes: order.notes,
    qrCodePath: order.qrCodePath,
    entryDate: order.entryDate,
    estimatedCompletionDate: order.estimatedCompletionDate,
    pickedUpAt: order.pickedUpAt,
    createdAt: order.entryDate,
    customer: {
      id: String(order.customer.id),
      name: order.customer.name,
      phone: order.customer.phoneNumber,
      phoneNumber: order.customer.phoneNumber,
      address: order.customer.address,
    },
    orderItems: (order.orderItems || []).map((item) => ({
      id: item.id,
      orderId: item.orderId,
      serviceId: item.serviceId,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
      service: {
        id: item.service.id,
        name: item.service.name,
        unit: item.service.unit,
        price: Number(item.service.price),
        estimatedDurationHours: item.service.estimatedDurationHours,
      },
    })),
  };
}

