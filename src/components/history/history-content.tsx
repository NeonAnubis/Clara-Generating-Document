'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileSpreadsheet, FileText } from 'lucide-react'

interface ExportHistoryItem {
  id: string
  exportType: string
  fileName: string
  recordCount: number
  createdAt: Date
}

export function HistoryContent({ history }: { history: ExportHistoryItem[] }) {
  const t = useTranslations('history')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('type')}</TableHead>
              <TableHead>{t('file')}</TableHead>
              <TableHead>{t('records')}</TableHead>
              <TableHead>{t('date')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {t('noExports')}
                </TableCell>
              </TableRow>
            ) : (
              history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.exportType === 'excel' ? (
                        <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      ) : (
                        <FileText className="h-4 w-4 text-blue-600" />
                      )}
                      <Badge variant={item.exportType === 'excel' ? 'secondary' : 'default'}>
                        {item.exportType.toUpperCase()}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.fileName}</TableCell>
                  <TableCell>{item.recordCount}</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
