'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
} from 'lucide-react'

interface Customer {
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

type SortField = 'primaryContact' | 'email' | 'cuotaholder' | 'business' | 'status'
type SortDirection = 'asc' | 'desc' | null

interface SortState {
  field: SortField | null
  direction: SortDirection
}

export function CustomerListSortable() {
  const t = useTranslations('customers')
  const tCommon = useTranslations('common')

  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null)
  const [sortState, setSortState] = useState<SortState>({ field: null, direction: null })

  const fetchCustomers = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)

      const response = await fetch(`/api/customers?${params}`)
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const getFirstCuotaholderName = (customer: Customer) => {
    if (customer.individualCuotaholders?.length > 0) {
      const first = customer.individualCuotaholders[0]
      if (first.givenNames || first.lastName) {
        return `${first.givenNames || ''} ${first.lastName || ''}`.trim()
      }
    }
    if (customer.corporateCuotaholders?.length > 0) {
      const first = customer.corporateCuotaholders[0]
      if (first.companyName) {
        return first.companyName
      }
    }
    return ''
  }

  const getCuotaholderCount = (customer: Customer) => {
    const individualCount = customer.individualCuotaholders?.filter(c => c.lastName || c.givenNames).length || 0
    const corporateCount = customer.corporateCuotaholders?.filter(c => c.companyName).length || 0
    return individualCount + corporateCount
  }

  const handleSort = (field: SortField) => {
    setSortState(prev => {
      if (prev.field !== field) {
        return { field, direction: 'asc' }
      }
      if (prev.direction === 'asc') {
        return { field, direction: 'desc' }
      }
      if (prev.direction === 'desc') {
        return { field: null, direction: null }
      }
      return { field, direction: 'asc' }
    })
  }

  const sortedCustomers = useMemo(() => {
    if (!sortState.field || !sortState.direction) {
      return customers
    }

    return [...customers].sort((a, b) => {
      let valueA: string
      let valueB: string

      switch (sortState.field) {
        case 'primaryContact':
          valueA = (a.primaryContactName || '').toLowerCase()
          valueB = (b.primaryContactName || '').toLowerCase()
          break
        case 'email':
          valueA = (a.primaryContactEmail || '').toLowerCase()
          valueB = (b.primaryContactEmail || '').toLowerCase()
          break
        case 'cuotaholder':
          valueA = getFirstCuotaholderName(a).toLowerCase()
          valueB = getFirstCuotaholderName(b).toLowerCase()
          break
        case 'business':
          valueA = (a.natureOfBusiness || '').toLowerCase()
          valueB = (b.natureOfBusiness || '').toLowerCase()
          break
        case 'status':
          valueA = a.status.toLowerCase()
          valueB = b.status.toLowerCase()
          break
        default:
          return 0
      }

      if (valueA < valueB) return sortState.direction === 'asc' ? -1 : 1
      if (valueA > valueB) return sortState.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [customers, sortState])

  const handleDeleteClick = (id: string) => {
    setCustomerToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return

    try {
      await fetch(`/api/customers/${customerToDelete}`, { method: 'DELETE' })
      fetchCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
    } finally {
      setDeleteDialogOpen(false)
      setCustomerToDelete(null)
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

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const isActive = sortState.field === field
    const direction = isActive ? sortState.direction : null

    return (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => handleSort(field)}
      >
        {children}
        {direction === 'asc' ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : direction === 'desc' ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
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
              <TableHead>
                <SortableHeader field="primaryContact">{t('primaryContact')}</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="email">{t('email')}</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="cuotaholder">{t('cuotaholder')}</SortableHeader>
              </TableHead>
              <TableHead>{t('cuotaholderCount')}</TableHead>
              <TableHead>
                <SortableHeader field="business">{t('businessNature')}</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="status">{t('status')}</SortableHeader>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {tCommon('loading')}
                </TableCell>
              </TableRow>
            ) : sortedCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {t('noCustomersFound')}
                </TableCell>
              </TableRow>
            ) : (
              sortedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.primaryContactName || '-'}
                  </TableCell>
                  <TableCell>{customer.primaryContactEmail || '-'}</TableCell>
                  <TableCell>{getFirstCuotaholderName(customer) || '-'}</TableCell>
                  <TableCell>{getCuotaholderCount(customer)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {customer.natureOfBusiness || '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
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
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(customer.id)}
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
