import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import ExcelJS from 'exceljs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { customerIds, fields } = data

    // Get customers
    const customers = await prisma.customer.findMany({
      where: customerIds?.length > 0 ? {
        id: { in: customerIds }
      } : {},
      orderBy: { lastName: 'asc' },
    })

    // Create workbook
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Sistema de Papelería'
    workbook.created = new Date()

    const worksheet = workbook.addWorksheet('Clientes')

    // Define columns based on selected fields or all fields
    const allFields = [
      { key: 'firstName', header: 'Nombre' },
      { key: 'lastName', header: 'Apellido' },
      { key: 'email', header: 'Correo Electrónico' },
      { key: 'phone', header: 'Teléfono' },
      { key: 'mobile', header: 'Celular' },
      { key: 'idType', header: 'Tipo de ID' },
      { key: 'idNumber', header: 'Número de ID' },
      { key: 'address', header: 'Dirección' },
      { key: 'city', header: 'Ciudad' },
      { key: 'state', header: 'Provincia' },
      { key: 'country', header: 'País' },
      { key: 'postalCode', header: 'Código Postal' },
      { key: 'companyName', header: 'Empresa' },
      { key: 'companyId', header: 'Cédula Jurídica' },
      { key: 'position', header: 'Puesto' },
      { key: 'category', header: 'Categoría' },
      { key: 'status', header: 'Estado' },
      { key: 'notes', header: 'Notas' },
    ]

    const selectedFields = fields?.length > 0
      ? allFields.filter(f => fields.includes(f.key))
      : allFields

    worksheet.columns = selectedFields.map(field => ({
      header: field.header,
      key: field.key,
      width: 20,
    }))

    // Style header row
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' },
    }
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }

    // Add data rows
    customers.forEach(customer => {
      const rowData: Record<string, string | null> = {}
      selectedFields.forEach(field => {
        rowData[field.key] = customer[field.key as keyof typeof customer] as string | null
      })
      worksheet.addRow(rowData)
    })

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      if (column.header) {
        column.width = Math.max(column.header.length + 2, 15)
      }
    })

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Log export
    await prisma.exportHistory.create({
      data: {
        exportType: 'excel',
        fileName: `clientes_${new Date().toISOString().split('T')[0]}.xlsx`,
        recordCount: customers.length,
        filterCriteria: JSON.stringify({ customerIds, fields }),
      },
    })

    return new NextResponse(buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="clientes_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    return NextResponse.json({ error: 'Error al exportar a Excel' }, { status: 500 })
  }
}
