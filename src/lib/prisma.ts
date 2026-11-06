import { PrismaClient } from '@prisma/client';

type ExtendedPrismaClient = PrismaClient & {
  user: any;
  customer: any;
  service: any;
  order: any;
  orderItem: any;
  notificationLog: any;
};

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

export const prisma: ExtendedPrismaClient =
  globalForPrisma.prisma ??
  (new PrismaClient({
    log: ['query', 'error', 'warn'],
  }) as ExtendedPrismaClient);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
