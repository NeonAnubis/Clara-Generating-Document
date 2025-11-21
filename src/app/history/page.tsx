import prisma from '@/lib/prisma'
import { HistoryContent } from '@/components/history/history-content'

export const dynamic = 'force-dynamic'

async function getExportHistory() {
  return prisma.exportHistory.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}

export default async function HistoryPage() {
  const history = await getExportHistory()

  return <HistoryContent history={history} />
}
