import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const customer = await prisma.customer.findUnique({
      where: { id },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json({ error: 'Error fetching customer' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = await (prisma.customer as any).update({
      where: { id },
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

        // Manager
        managerFirstName: data.managerFirstName || null,
        managerId: data.managerId || null,
        managerAddress: data.managerAddress || null,
        managerOccupation: data.managerOccupation || null,
        managerMaritalStatus: data.managerMaritalStatus || null,
        managerNationality: data.managerNationality || null,
        managerLastName: data.managerLastName || null,

        // Other
        denomination: data.denomination || null,
        idInNumbers: data.idInNumbers || null,
        dissolvedRecord: data.dissolvedRecord || null,
        bookLegalization: data.bookLegalization || null,
        email: data.email || null,
        tradeName: data.tradeName || null,
      },
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Error updating customer' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.customer.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json({ error: 'Error deleting customer' }, { status: 500 })
  }
}
