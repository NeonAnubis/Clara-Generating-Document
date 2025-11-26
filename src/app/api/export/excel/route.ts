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
      { key: 'companyName', header: 'Company Name' },
      { key: 'companyType', header: 'Company Type' },
      { key: 'abbreviation', header: 'Abbreviation' },
      { key: 'legalId', header: 'Legal ID' },
      { key: 'shareCapital', header: 'Share Capital' },
      { key: 'numberOfShares', header: 'Number of Shares' },
      { key: 'shareValue', header: 'Share Value' },
      { key: 'series', header: 'Series' },
      { key: 'registeredAddress', header: 'Registered Address' },
      { key: 'companyTerm', header: 'Company Term' },
      { key: 'incorporationDate', header: 'Incorporation Date' },
      { key: 'shareholderOne', header: 'Shareholder One' },
      { key: 'certificateNumber', header: 'Certificate Number' },
      { key: 'identification', header: 'Identification' },
      { key: 'ownership', header: 'Ownership' },
      { key: 'numberOfSharesHeld', header: 'Number of Shares Held' },
      { key: 'maritalStatus', header: 'Marital Status' },
      { key: 'profession', header: 'Profession' },
      { key: 'shareholder1Address', header: 'Shareholder 1 Address' },
      { key: 'reference', header: 'Reference' },
      { key: 'sharesInWords1', header: 'Shares in Words 1' },
      { key: 'percentage1', header: 'Percentage 1' },
      { key: 'certificateNumber2', header: 'Certificate Number 2' },
      { key: 'reference2', header: 'Reference 2' },
      { key: 'shareholder2Address', header: 'Shareholder 2 Address' },
      { key: 'profession2', header: 'Profession 2' },
      { key: 'maritalStatus2', header: 'Marital Status 2' },
      { key: 'shareholderTwo', header: 'Shareholder Two' },
      { key: 'identification2', header: 'Identification 2' },
      { key: 'ownership2', header: 'Ownership 2' },
      { key: 'percentage2', header: 'Percentage 2' },
      { key: 'sharesInNumbers2', header: 'Shares in Numbers 2' },
      { key: 'numberOfSharesHeld2', header: 'Number of Shares Held 2' },
      { key: 'legalIdInWords', header: 'Legal ID in Words' },
      { key: 'renewalStartDate', header: 'Renewal Start Date' },
      { key: 'active', header: 'Active' },
      { key: 'archived', header: 'Archived' },
      { key: 'cooperator', header: 'Cooperator' },
      { key: 'legalRepresentative', header: 'Legal Representative' },
      { key: 'representativeId', header: 'Representative ID' },
      { key: 'activeTaxation', header: 'Active Taxation' },
      { key: 'managerFirstName', header: 'Manager First Name' },
      { key: 'managerLastName', header: 'Manager Last Name' },
      { key: 'managerId', header: 'Manager ID' },
      { key: 'managerMaritalStatus', header: 'Manager Marital Status' },
      { key: 'managerOccupation', header: 'Manager Occupation' },
      { key: 'managerNationality', header: 'Manager Nationality' },
      { key: 'managerAddress', header: 'Manager Address' },
      { key: 'denomination', header: 'Denomination' },
      { key: 'idInNumbers', header: 'ID in Numbers' },
      { key: 'dissolvedRecord', header: 'Dissolved Record' },
      { key: 'bookLegalization', header: 'Book Legalization' },
      { key: 'email', header: 'Email' },
      { key: 'tradeName', header: 'Trade Name' },
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
