'use client'

import { useTranslations } from 'next-intl'
import { CustomerList } from '@/components/customers/customer-list'

export default function CustomersPage() {
  const t = useTranslations('customers')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <CustomerList />
    </div>
  )
}
