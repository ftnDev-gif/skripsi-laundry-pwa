import { prisma } from '@/lib/prisma';
import { mapOrderToTransactionView } from '@/lib/orderMapper';
import ReportClient from './ReportClient';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const rawOrders = await prisma.order.findMany({
    include: {
      customer: true,
      orderItems: {
        include: { service: true },
      },
    },
    orderBy: {
      entryDate: 'desc',
    },
  });

  const transactions = rawOrders.map((order: any) => mapOrderToTransactionView(order));

  return <ReportClient transactions={transactions} />;
}
