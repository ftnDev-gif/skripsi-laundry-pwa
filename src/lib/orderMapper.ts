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

export interface CustomerRecord {
  id: number | string;
  name: string;
  phoneNumber?: string;
  phone?: string;
  address?: string | null;
  createdAt?: Date;
}

export interface ServiceRecord {
  id: number;
  name: string;
  unit: string;
  price: number | string | { toString(): string };
  estimatedDurationHours: number;
  createdAt?: Date;
}

export interface OrderItemRecord {
  id: number;
  orderId: number;
  serviceId: number;
  quantity: number | string | { toString(): string };
  unitPrice: number | string | { toString(): string };
  subtotal: number | string | { toString(): string };
  service?: ServiceRecord | null;
}

export interface OrderWithRelations {
  id: number | string;
  invoiceCode: string;
  customerId: number | string;
  totalPrice: number | string | { toString(): string };
  paymentStatus: string;
  orderStatus: string;
  qrCodePath?: string | null;
  entryDate: Date;
  estimatedCompletionDate?: Date | null;
  pickedUpAt?: Date | null;
  notes?: string | null;
  customer: CustomerRecord;
  orderItems?: OrderItemRecord[];
}

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

export function mapOrderToTransactionView(order: OrderWithRelations | any) {
  const items: any[] = Array.isArray(order.orderItems) ? order.orderItems : [];
  const primaryItem: any = items[0];

  const totalWeight =
    items.length > 0
      ? items.reduce((acc: number, item: any) => acc + Number(item.quantity || 0), 0)
      : 0;

  const unitPrice = primaryItem ? Number(primaryItem.unitPrice || 0) : 0;

  const serviceName =
    items.length > 0
      ? items
          .map((item: any) => item.service?.name || 'Cuci & Setrika (Komplit)')
          .join(', ')
      : 'Cuci & Setrika (Komplit)';

  const customerPhone = order.customer?.phoneNumber || order.customer?.phone || '';

  return {
    id: String(order.id),
    orderId: Number(order.id),
    invoiceNumber: order.invoiceCode,
    invoiceCode: order.invoiceCode,
    customerId: String(order.customerId),
    serviceType: serviceName,
    weight: Number(totalWeight.toFixed(2)),
    pricePerKg: unitPrice,
    totalPrice: Number(order.totalPrice || 0),
    status: fromDbOrderStatus(order.orderStatus),
    orderStatus: order.orderStatus,
    paymentStatus: fromDbPaymentStatus(order.paymentStatus),
    rawPaymentStatus: order.paymentStatus,
    notes: order.notes ?? null,
    qrCodePath: order.qrCodePath ?? null,
    entryDate: order.entryDate,
    estimatedCompletionDate: order.estimatedCompletionDate ?? null,
    pickedUpAt: order.pickedUpAt ?? null,
    createdAt: order.entryDate,
    customer: {
      id: String(order.customer?.id ?? order.customerId),
      name: order.customer?.name || 'Pelanggan',
      phone: customerPhone,
      phoneNumber: customerPhone,
      address: order.customer?.address ?? null,
    },
    orderItems: items.map((item: any) => ({
      id: item.id,
      orderId: item.orderId,
      serviceId: item.serviceId,
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unitPrice || 0),
      subtotal: Number(item.subtotal || 0),
      service: item.service
        ? {
            id: item.service.id,
            name: item.service.name,
            unit: item.service.unit,
            price: Number(item.service.price || 0),
            estimatedDurationHours: item.service.estimatedDurationHours,
          }
        : undefined,
    })),
  };
}
