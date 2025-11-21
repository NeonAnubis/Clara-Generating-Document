'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CustomerFormInline } from '@/components/customers/customer-form-inline'
import { CustomerListSortable } from '@/components/customers/customer-list-sortable'
import { UserPlus, List } from 'lucide-react'

export default function CustomersPage() {
  const t = useTranslations('customers')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCustomerSaved = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="register" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            {t('tabRegister')}
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            {t('tabList')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="register" className="mt-6">
          <CustomerFormInline onSave={handleCustomerSaved} />
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <CustomerListSortable key={refreshKey} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
