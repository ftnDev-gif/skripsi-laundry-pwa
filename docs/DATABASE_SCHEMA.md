# Skema Database Sayangan Laundry

Gunakan skema relasional SQL berikut sebagai acuan utama untuk ORM (Prisma/Drizzle) atau query langsung ke SQLite/PostgreSQL.

```sql
-- 1. Tabel users (Data Pengelola)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- admin/kasir
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel customers (Data Pelanggan)
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel services (Data Layanan)
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- misal: Cuci Komplit
    unit VARCHAR(20) NOT NULL, -- kg/pcs/m2
    price DECIMAL(10,2) NOT NULL,
    estimated_duration_hours INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel orders (Data Transaksi Utama)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    invoice_code VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    user_id INTEGER REFERENCES users(id),
    total_price DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL, -- unpaid / paid
    order_status VARCHAR(30) NOT NULL, -- antre/dicuci/selesai/diambil
    qr_code_path VARCHAR(255),
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_completion_date TIMESTAMP,
    picked_up_at TIMESTAMP,
    notes TEXT -- Catatan fisik pakaian
);

-- 5. Tabel order_items (Rincian Item Transaksi)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    service_id INTEGER REFERENCES services(id),
    quantity DECIMAL(8,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- 6. Tabel notification_logs (Riwayat Pengiriman WhatsApp)
CREATE TABLE notification_logs (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    recipient_phone VARCHAR(20) NOT NULL,
    message_content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL, -- queued / sent / failed
    gateway_response TEXT,
    sent_at TIMESTAMP
);