import { prisma } from '@/lib/prisma';
import ReportClient from './ReportClient';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const transactions = await prisma.transaction.findMany({
    include: {
      customer: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return <ReportClient transactions={transactions} />;
}
