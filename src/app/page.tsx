import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, Download, Clock } from 'lucide-react'
import prisma from '@/lib/prisma'

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido al Sistema de Papelería
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customerCount}</div>
            <p className="text-xs text-muted-foreground">
              Registrados en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Plantillas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.templateCount}</div>
            <p className="text-xs text-muted-foreground">
              Documentos disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Exportaciones
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.exportCount}</div>
            <p className="text-xs text-muted-foreground">
              Total generados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Última Actividad
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.recentExports[0]
                ? new Date(stats.recentExports[0].createdAt).toLocaleDateString('es-CR')
                : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              Última exportación
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Exportaciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentExports.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay exportaciones recientes
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
                        {exp.recordCount} registro(s)
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(exp.createdAt).toLocaleDateString('es-CR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/customers"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Agregar Cliente</p>
                <p className="text-xs text-muted-foreground">
                  Registrar nuevo cliente
                </p>
              </div>
            </a>
            <a
              href="/export"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Download className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Exportar Datos</p>
                <p className="text-xs text-muted-foreground">
                  Generar Excel o Word
                </p>
              </div>
            </a>
            <a
              href="/templates"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Gestionar Plantillas</p>
                <p className="text-xs text-muted-foreground">
                  Crear o editar plantillas
                </p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
