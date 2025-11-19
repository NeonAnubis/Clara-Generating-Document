import prisma from '@/lib/prisma'
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

export const dynamic = 'force-dynamic'

async function getExportHistory() {
  return prisma.exportHistory.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}

export default async function HistoryPage() {
  const history = await getExportHistory()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Historial de Exportaciones</h1>
        <p className="text-muted-foreground">
          Registro de todos los documentos generados
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Archivo</TableHead>
              <TableHead>Registros</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No hay exportaciones registradas
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
                    {new Date(item.createdAt).toLocaleString('es-CR', {
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
