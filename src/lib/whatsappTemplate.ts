/**
 * Template Pesan WhatsApp - Single Source of Truth
 * Digunakan untuk pengiriman otomatis via Fonnte maupun tombol manual via wa.me
 */

export interface ReceiptMessageParams {
  customerName?: string;
  invoiceNumber: string;
  serviceType: string;
  weight: number;
  totalPrice: number | string;
  trackingUrl: string;
  paymentStatus?: string;
}

export interface PickupMessageParams {
  customerName?: string;
  invoiceNumber: string;
}

/**
 * 1. Template Pesan untuk Transaksi Baru / Nota Digital
 */
export function generateReceiptMessage(
  dataOrFirstParam: ReceiptMessageParams | string,
  secondParam?: string,
  thirdParam?: string | number,
  fourthParam?: number | string,
  fifthParam?: number | string,
  sixthParam?: string,
  seventhParam?: string
): string {
  let customerName = 'Pelanggan';
  let invoiceNumber = '';
  let serviceType = 'Cuci';
  let weight = 0;
  let totalPrice: number | string = 0;
  let trackingUrl = '';
  let paymentStatus: string | undefined = undefined;

  if (typeof dataOrFirstParam === 'object' && dataOrFirstParam !== null) {
    customerName = dataOrFirstParam.customerName || 'Pelanggan';
    invoiceNumber = dataOrFirstParam.invoiceNumber || '';
    serviceType = dataOrFirstParam.serviceType || 'Cuci';
    weight = dataOrFirstParam.weight ?? 0;
    totalPrice = dataOrFirstParam.totalPrice ?? 0;
    trackingUrl = dataOrFirstParam.trackingUrl || '';
    paymentStatus = dataOrFirstParam.paymentStatus;
  } else if (typeof dataOrFirstParam === 'string') {
    if (dataOrFirstParam.startsWith('INV-')) {
      invoiceNumber = dataOrFirstParam;
      serviceType = (secondParam as string) || 'Cuci';
      weight = typeof thirdParam === 'number' ? thirdParam : Number(thirdParam) || 0;
      totalPrice = (fourthParam as number | string) ?? 0;
      trackingUrl = (fifthParam as string) || '';
      customerName = sixthParam || 'Pelanggan';
      paymentStatus = seventhParam;
    } else {
      customerName = dataOrFirstParam;
      invoiceNumber = secondParam || '';
      serviceType = (thirdParam as string) || 'Cuci';
      weight = typeof fourthParam === 'number' ? fourthParam : Number(fourthParam) || 0;
      totalPrice = (fifthParam as number | string) ?? 0;
      trackingUrl = sixthParam || '';
      paymentStatus = seventhParam;
    }
  }

  const formattedTotal =
    typeof totalPrice === 'number'
      ? new Intl.NumberFormat('id-ID').format(totalPrice)
      : totalPrice;

  const paymentText = paymentStatus ? ` (${paymentStatus})` : '';

  return `Halo *${customerName}*, terima kasih telah mencuci di *Sayangan Laundry*!

*Nomor Resi:* ${invoiceNumber}
*Layanan:* ${serviceType} (${weight} Kg)
*Total Tagihan:* Rp ${formattedTotal}${paymentText}

Lacak status cucian Anda melalui tautan berikut:
${trackingUrl}

Sayangan Laundry — Bersih, Rapi & Wangi.`;
}

/**
 * 2. Template Pesan untuk Pengingat Pengambilan (Siap Diambil)
 */
export function generatePickupMessage(
  dataOrCustomerName: PickupMessageParams | string,
  invoiceNumberParam?: string
): string {
  let customerName = 'Pelanggan';
  let invoiceNumber = '';

  if (typeof dataOrCustomerName === 'object' && dataOrCustomerName !== null) {
    customerName = dataOrCustomerName.customerName || 'Pelanggan';
    invoiceNumber = dataOrCustomerName.invoiceNumber || '';
  } else if (typeof dataOrCustomerName === 'string') {
    if (dataOrCustomerName.startsWith('INV-')) {
      invoiceNumber = dataOrCustomerName;
      customerName = invoiceNumberParam || 'Pelanggan';
    } else {
      customerName = dataOrCustomerName;
      invoiceNumber = invoiceNumberParam || '';
    }
  }

  return `Halo *${customerName}*, cucian Anda dengan nomor nota *${invoiceNumber}* di Sayangan Laundry sudah *SIAP DIAMBIL*. Terima kasih!`;
}

/**
 * Alias untuk menjaga kompatibilitas kode sebelumnya
 */
export const generateReadyMessage = generatePickupMessage;

/**
 * Format nomor telepon ke standar internasional WhatsApp (628...)
 */
export function formatWhatsAppPhone(phone: string): string {
  let cleaned = (phone || '').replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

/**
 * Menghasilkan URL click-to-chat WhatsApp (https://wa.me/...)
 */
export function createWhatsAppUrl(phone: string, text: string): string {
  const cleaned = formatWhatsAppPhone(phone);
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppUrl(phone: string, text: string): string {
  return createWhatsAppUrl(phone, text);
}
