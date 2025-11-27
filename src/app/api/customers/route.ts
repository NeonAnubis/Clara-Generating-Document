import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Fields allowed for selection (to prevent arbitrary field access)
const ALLOWED_FIELDS = [
  'id', 'companyName', 'companyType', 'abbreviation', 'legalId', 'shareCapital',
  'numberOfShares', 'shareValue', 'series', 'registeredAddress', 'companyTerm',
  'incorporationDate', 'currency', 'administration', 'shareholderOne', 'certificateNumber', 'identification',
  'ownership', 'numberOfSharesHeld', 'date', 'month', 'year', 'print', 'excelId',
  'capitalNumber', 'maritalStatus', 'profession', 'shareholder1Address', 'reference',
  'sharesInWords1', 'percentage1', 'certificateNumber2', 'reference2', 'shareholder2Address',
  'profession2', 'maritalStatus2', 'shareholderTwo', 'identification2', 'ownership2',
  'percentage2', 'sharesInNumbers2', 'numberOfSharesHeld2', 'field1', 'legalIdInWords',
  'renewalStartDate', 'active', 'archived', 'cooperator', 'legalRepresentative',
  'representativeId', 'activeTaxation',
  // Manager 1
  'managerFirstName', 'managerId', 'managerAddress', 'managerOccupation',
  'managerMaritalStatus', 'managerNationality', 'managerLastName',
  // Manager 2
  'manager2FirstName', 'manager2LastName', 'manager2Id', 'manager2Address',
  'manager2Occupation', 'manager2MaritalStatus', 'manager2Nationality',
  // Sub-manager
  'subManagerFirstName', 'subManagerLastName', 'subManagerId', 'subManagerAddress',
  'subManagerOccupation', 'subManagerMaritalStatus', 'subManagerNationality',
  // Other
  'denomination', 'idInNumbers', 'dissolvedRecord', 'bookLegalization', 'email', 'tradeName',
  'createdAt', 'updatedAt'
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const fieldsParam = searchParams.get('fields')

    const where = search ? {
      OR: [
        { companyName: { contains: search, mode: 'insensitive' as const } },
        { tradeName: { contains: search, mode: 'insensitive' as const } },
        { legalId: { contains: search, mode: 'insensitive' as const } },
        { shareholderOne: { contains: search, mode: 'insensitive' as const } },
        { shareholderTwo: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ]
    } : {}

    // Build select object if fields are specified
    let select: Record<string, boolean> | undefined
    if (fieldsParam) {
      const requestedFields = fieldsParam.split(',').map(f => f.trim())
      select = {}
      for (const field of requestedFields) {
        if (ALLOWED_FIELDS.includes(field)) {
          select[field] = true
        }
      }
      // Ensure id is always included
      select.id = true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customers = await (prisma.customer as any).findMany({
      where,
      select,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Error fetching customers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = await (prisma.customer as any).create({
      data: {
        // Company Information
        companyName: data.companyName || null,
        companyType: data.companyType || null,
        abbreviation: data.abbreviation || null,
        legalId: data.legalId || null,
        shareCapital: data.shareCapital || null,
        numberOfShares: data.numberOfShares || null,
        shareValue: data.shareValue || null,
        series: data.series || null,
        registeredAddress: data.registeredAddress || null,
        companyTerm: data.companyTerm || null,
        incorporationDate: data.incorporationDate || null,
        currency: data.currency || null,
        administration: data.administration || null,

        // Shareholder 1
        shareholderOne: data.shareholderOne || null,
        certificateNumber: data.certificateNumber || null,
        identification: data.identification || null,
        ownership: data.ownership || null,
        numberOfSharesHeld: data.numberOfSharesHeld || null,
        date: data.date || null,
        month: data.month || null,
        year: data.year || null,
        print: data.print || null,
        excelId: data.excelId || null,
        capitalNumber: data.capitalNumber || null,
        maritalStatus: data.maritalStatus || null,
        profession: data.profession || null,
        shareholder1Address: data.shareholder1Address || null,
        reference: data.reference || null,
        sharesInWords1: data.sharesInWords1 || null,
        percentage1: data.percentage1 || null,

        // Shareholder 2
        certificateNumber2: data.certificateNumber2 || null,
        reference2: data.reference2 || null,
        shareholder2Address: data.shareholder2Address || null,
        profession2: data.profession2 || null,
        maritalStatus2: data.maritalStatus2 || null,
        shareholderTwo: data.shareholderTwo || null,
        identification2: data.identification2 || null,
        ownership2: data.ownership2 || null,
        percentage2: data.percentage2 || null,
        sharesInNumbers2: data.sharesInNumbers2 || null,
        numberOfSharesHeld2: data.numberOfSharesHeld2 || null,

        // Additional Fields
        field1: data.field1 || null,
        legalIdInWords: data.legalIdInWords || null,
        renewalStartDate: data.renewalStartDate || null,
        active: data.active || null,
        archived: data.archived || null,
        cooperator: data.cooperator || null,
        legalRepresentative: data.legalRepresentative || null,
        representativeId: data.representativeId || null,
        activeTaxation: data.activeTaxation || null,

        // Manager 1
        managerFirstName: data.managerFirstName || null,
        managerId: data.managerId || null,
        managerAddress: data.managerAddress || null,
        managerOccupation: data.managerOccupation || null,
        managerMaritalStatus: data.managerMaritalStatus || null,
        managerNationality: data.managerNationality || null,
        managerLastName: data.managerLastName || null,

        // Manager 2
        manager2FirstName: data.manager2FirstName || null,
        manager2LastName: data.manager2LastName || null,
        manager2Id: data.manager2Id || null,
        manager2Address: data.manager2Address || null,
        manager2Occupation: data.manager2Occupation || null,
        manager2MaritalStatus: data.manager2MaritalStatus || null,
        manager2Nationality: data.manager2Nationality || null,

        // Sub-manager
        subManagerFirstName: data.subManagerFirstName || null,
        subManagerLastName: data.subManagerLastName || null,
        subManagerId: data.subManagerId || null,
        subManagerAddress: data.subManagerAddress || null,
        subManagerOccupation: data.subManagerOccupation || null,
        subManagerMaritalStatus: data.subManagerMaritalStatus || null,
        subManagerNationality: data.subManagerNationality || null,

        // Other
        denomination: data.denomination || null,
        idInNumbers: data.idInNumbers || null,
        dissolvedRecord: data.dissolvedRecord || null,
        bookLegalization: data.bookLegalization || null,
        email: data.email || null,
        tradeName: data.tradeName || null,
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Error creating customer' }, { status: 500 })
  }
}
