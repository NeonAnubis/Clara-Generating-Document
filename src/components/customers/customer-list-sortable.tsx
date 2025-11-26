'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  companyName: string | null
  companyType: string | null
  legalId: string | null
  shareholderOne: string | null
  shareholderTwo: string | null
  email: string | null
  createdAt: string
}

type SortField = 'companyName' | 'legalId' | 'email' | 'shareholder'
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

  const getShareholderDisplay = (customer: Customer) => {
    if (customer.shareholderOne) {
      return customer.shareholderOne
    }
    return '-'
  }

  const getShareholderCount = (customer: Customer) => {
    let count = 0
    if (customer.shareholderOne) count++
    if (customer.shareholderTwo) count++
    return count
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
        case 'companyName':
          valueA = (a.companyName || '').toLowerCase()
          valueB = (b.companyName || '').toLowerCase()
          break
        case 'legalId':
          valueA = (a.legalId || '').toLowerCase()
          valueB = (b.legalId || '').toLowerCase()
          break
        case 'email':
          valueA = (a.email || '').toLowerCase()
          valueB = (b.email || '').toLowerCase()
          break
        case 'shareholder':
          valueA = (a.shareholderOne || '').toLowerCase()
          valueB = (b.shareholderOne || '').toLowerCase()
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
                <SortableHeader field="companyName">{t('company')}</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="legalId">Legal ID</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="email">{t('email')}</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="shareholder">Shareholder</SortableHeader>
              </TableHead>
              <TableHead>Shareholders</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {tCommon('loading')}
                </TableCell>
              </TableRow>
            ) : sortedCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {t('noCustomersFound')}
                </TableCell>
              </TableRow>
            ) : (
              sortedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.companyName || '-'}
                  </TableCell>
                  <TableCell>{customer.legalId || '-'}</TableCell>
                  <TableCell>{customer.email || '-'}</TableCell>
                  <TableCell>{getShareholderDisplay(customer)}</TableCell>
                  <TableCell>{getShareholderCount(customer)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => window.open(`/customers/${customer.id}`, '_blank')}
                        >
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
