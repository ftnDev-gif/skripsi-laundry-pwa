export async function sendWhatsAppMessage(target: string, message: string) {
  // Check if WhatsApp notification is enabled
  if (process.env.ENABLE_WHATSAPP_NOTIFICATION !== 'true') {
    console.log('Notifikasi WA dinonaktifkan via environment variable');
    return { success: true, message: 'Notifikasi WA dinonaktifkan' };
  }

  const apiToken = process.env.FONNTE_API_TOKEN;
  if (!apiToken) {
    console.warn('Peringatan: FONNTE_API_TOKEN tidak diatur. Mengabaikan pengiriman WA.');
    return { success: false, error: 'FONNTE_API_TOKEN is missing' };
  }

  try {
    const formData = new FormData();
    formData.append('target', target);
    formData.append('message', message);
    formData.append('countryCode', '62');

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': apiToken,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error('Gagal mengirim pesan WhatsApp via Fonnte:', error.message);
    return { success: false, error: error.message };
  }
}
