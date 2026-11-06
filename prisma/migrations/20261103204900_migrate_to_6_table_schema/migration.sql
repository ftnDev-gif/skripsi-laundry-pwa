-- DropForeignKey
ALTER TABLE IF EXISTS "Transaction" DROP CONSTRAINT IF EXISTS "Transaction_customerId_fkey";
ALTER TABLE IF EXISTS "Transaction" DROP CONSTRAINT IF EXISTS "Transaction_userId_fkey";

-- DropTable
DROP TABLE IF EXISTS "Transaction";
DROP TABLE IF EXISTS "Customer";
DROP TABLE IF EXISTS "User";

-- DropEnum
DROP TYPE IF EXISTS "LaundryStatus";
DROP TYPE IF EXISTS "PaymentStatus";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'kasir',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "estimated_duration_hours" INTEGER NOT NULL DEFAULT 24,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "invoice_code" VARCHAR(50) NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "payment_status" VARCHAR(20) NOT NULL DEFAULT 'unpaid',
    "order_status" VARCHAR(30) NOT NULL DEFAULT 'antre',
    "qr_code_path" VARCHAR(255),
    "entry_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimated_completion_date" TIMESTAMP(3),
    "picked_up_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "quantity" DECIMAL(8,2) NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_logs" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "recipient_phone" VARCHAR(20) NOT NULL,
    "message_content" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "gateway_response" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_number_key" ON "customers"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "orders_invoice_code_key" ON "orders"("invoice_code");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

