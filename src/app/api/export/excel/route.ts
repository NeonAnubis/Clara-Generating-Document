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
      orderBy: { createdAt: 'desc' },
    })

    // Create workbook
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Sistema de Papelería'
    workbook.created = new Date()

    const worksheet = workbook.addWorksheet('Customers')

    // Define columns based on new Customer schema
    const allFields = [
      { key: 'primaryContactName', header: 'Primary Contact Name' },
      { key: 'primaryContactEmail', header: 'Primary Contact Email' },
      { key: 'secondaryContactName', header: 'Secondary Contact Name' },
      { key: 'secondaryContactEmail', header: 'Secondary Contact Email' },
      { key: 'natureOfBusiness', header: 'Nature of Business' },
      { key: 'nominalValueOfCuotas', header: 'Nominal Value of Cuotas' },
      { key: 'numberOfCuotasToBeIssued', header: 'Number of Cuotas' },
      { key: 'status', header: 'Status' },
    ]

    const selectedFields = fields?.length > 0
      ? allFields.filter(f => fields.includes(f.key))
      : allFields

    worksheet.columns = selectedFields.map(field => ({
      header: field.header,
      key: field.key,
      width: 25,
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
        fileName: `customers_${new Date().toISOString().split('T')[0]}.xlsx`,
        recordCount: customers.length,
        filterCriteria: JSON.stringify({ customerIds, fields }),
      },
    })

    return new NextResponse(buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="customers_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    return NextResponse.json({ error: 'Error exporting to Excel' }, { status: 500 })
  }
}
