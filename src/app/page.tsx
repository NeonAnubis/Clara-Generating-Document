import prisma from '@/lib/prisma'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export const dynamic = 'force-dynamic'

async function getDashboardStats() {
  const [customerCount, templateCount, exportCount, recentExports] = await Promise.all([
    prisma.customer.count(),
    prisma.documentTemplate.count(),
    prisma.exportHistory.count(),
    prisma.exportHistory.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return { customerCount, templateCount, exportCount, recentExports }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return <DashboardContent stats={stats} />
}
