'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye
} from 'lucide-react'

interface Company {
  id: string
  primaryContactName: string | null
  primaryContactEmail: string | null
  secondaryContactName: string | null
  secondaryContactEmail: string | null
  onlyPrimarySecondaryNotified: boolean
  individualCuotaholders: Array<{
    lastName: string
    givenNames: string
    emailAddress: string
    telephoneNumber: string
  }>
  corporateCuotaholders: Array<{
    companyName: string
  }>
  natureOfBusiness: string | null
  status: string
  createdAt: string
}

interface CustomerListProps {
  onSelectCompany?: (company: Company) => void
  selectable?: boolean
  selectedIds?: string[]
}

export function CustomerList({ onSelectCompany, selectable, selectedIds = [] }: CustomerListProps) {
  const t = useTranslations('customers')
  const tCommon = useTranslations('common')

  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null)

  const fetchCompanies = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)

      const response = await fetch(`/api/customers?${params}`)
      const data = await response.json()
      setCompanies(data)
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const handleDeleteClick = (id: string) => {
    setCompanyToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return

    try {
      await fetch(`/api/customers/${companyToDelete}`, { method: 'DELETE' })
      fetchCompanies()
    } catch (error) {
      console.error('Error deleting company:', error)
    } finally {
      setDeleteDialogOpen(false)
      setCompanyToDelete(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      inactive: 'secondary',
      pending: 'destructive',
    }
    const labels: Record<string, string> = {
      active: t('statusActive'),
      inactive: t('statusInactive'),
      pending: t('statusPending'),
    }
    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    )
  }

  const getFirstCuotaholderName = (company: Company) => {
    if (company.individualCuotaholders?.length > 0) {
      const first = company.individualCuotaholders[0]
      if (first.givenNames || first.lastName) {
        return `${first.givenNames || ''} ${first.lastName || ''}`.trim()
      }
    }
    if (company.corporateCuotaholders?.length > 0) {
      const first = company.corporateCuotaholders[0]
      if (first.companyName) {
        return first.companyName
      }
    }
    return '-'
  }

  const getCuotaholderCount = (company: Company) => {
    const individualCount = company.individualCuotaholders?.filter(c => c.lastName || c.givenNames).length || 0
    const corporateCount = company.corporateCuotaholders?.filter(c => c.companyName).length || 0
    return individualCount + corporateCount
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && <TableHead className="w-12"></TableHead>}
              <TableHead>{t('primaryContact')}</TableHead>
              <TableHead>{t('email')}</TableHead>
              <TableHead>{t('cuotaholder')}</TableHead>
              <TableHead>{t('cuotaholderCount')}</TableHead>
              <TableHead>{t('businessNature')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={selectable ? 8 : 7} className="text-center py-8">
                  {tCommon('loading')}
                </TableCell>
              </TableRow>
            ) : companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={selectable ? 8 : 7} className="text-center py-8 text-muted-foreground">
                  {t('noCustomersFound')}
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow
                  key={company.id}
                  className={selectable ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => selectable && onSelectCompany?.(company)}
                >
                  {selectable && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(company.id)}
                        onChange={() => onSelectCompany?.(company)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4"
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">
                    {company.primaryContactName || '-'}
                  </TableCell>
                  <TableCell>{company.primaryContactEmail || '-'}</TableCell>
                  <TableCell>{getFirstCuotaholderName(company)}</TableCell>
                  <TableCell>{getCuotaholderCount(company)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {company.natureOfBusiness || '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(company.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          {tCommon('view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          {tCommon('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(company.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {tCommon('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
            <AlertDialogTitle>{t('deleteCustomer')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {tCommon('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
