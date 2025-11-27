'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { FileSpreadsheet, FileText, Trash2 } from 'lucide-react'

interface ExportHistoryItem {
  id: string
  exportType: string
  fileName: string
  recordCount: number
  createdAt: Date
}

export function HistoryContent({ history: initialHistory }: { history: ExportHistoryItem[] }) {
  const t = useTranslations('history')
  const tCommon = useTranslations('common')
  const router = useRouter()

  const [history, setHistory] = useState(initialHistory)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(history.map(item => item.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return

    setIsDeleting(true)
    try {
      const response = await fetch('/api/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      })

      if (response.ok) {
        setHistory(prev => prev.filter(item => !selectedIds.has(item.id)))
        setSelectedIds(new Set())
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting history:', error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const isAllSelected = history.length > 0 && selectedIds.size === history.length
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < history.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} {t('selectedCount')}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('deleteSelected')}
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) {
                      (el as HTMLButtonElement & { indeterminate: boolean }).indeterminate = isSomeSelected
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                  aria-label={tCommon('selectAll')}
                />
              </TableHead>
              <TableHead>{t('type')}</TableHead>
              <TableHead>{t('file')}</TableHead>
              <TableHead>{t('records')}</TableHead>
              <TableHead>{t('date')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {t('noExports')}
                </TableCell>
              </TableRow>
            ) : (
              history.map((item) => (
                <TableRow key={item.id} className={selectedIds.has(item.id) ? 'bg-muted/50' : ''}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={(checked) => handleSelectOne(item.id, checked as boolean)}
                      aria-label={`Select ${item.fileName}`}
                    />
                  </TableCell>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {tCommon('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
