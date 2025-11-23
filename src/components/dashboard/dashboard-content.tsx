'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, Download, Clock } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  customerCount: number
  templateCount: number
  exportCount: number
  recentExports: Array<{
    id: string
    fileName: string
    recordCount: number
    createdAt: Date
  }>
}
// DashboardContent component to display stats and quick actions
export function DashboardContent({ stats }: { stats: DashboardStats }) {
  const t = useTranslations('dashboard')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('welcome')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('totalCustomers')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customerCount}</div>
            <p className="text-xs text-muted-foreground">
              {t('registeredInSystem')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('templates')}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.templateCount}</div>
            <p className="text-xs text-muted-foreground">
              {t('availableDocuments')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('exports')}
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.exportCount}</div>
            <p className="text-xs text-muted-foreground">
              {t('totalGenerated')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('lastActivity')}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.recentExports[0]
                ? new Date(stats.recentExports[0].createdAt).toLocaleDateString()
                : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('lastExport')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('recentExports')}</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentExports.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t('noRecentExports')}
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentExports.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{exp.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {exp.recordCount} {t('records')}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(exp.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/customers"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">{t('addCustomer')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('registerNewCustomer')}
                </p>
              </div>
            </Link>
            <Link
              href="/export"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Download className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">{t('exportData')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('generateExcelOrWord')}
                </p>
              </div>
            </Link>
            <Link
              href="/templates"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">{t('manageTemplates')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('createOrEditTemplates')}
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
