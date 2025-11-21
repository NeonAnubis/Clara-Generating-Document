import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const company = await prisma.company.findUnique({
      where: { id },
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Parse JSON fields before returning
    const parsedCompany = {
      ...company,
      individualCuotaholders: JSON.parse(company.individualCuotaholders),
      corporateCuotaholders: JSON.parse(company.corporateCuotaholders),
      ubos: JSON.parse(company.ubos),
      directors: JSON.parse(company.directors),
    }

    return NextResponse.json(parsedCompany)
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json({ error: 'Error fetching company' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const company = await prisma.company.update({
      where: { id },
      data: {
        // Section 2: Primary Contact(s) Information
        primaryContactName: data.primaryContactName || null,
        primaryContactEmail: data.primaryContactEmail || null,
        secondaryContactName: data.secondaryContactName || null,
        secondaryContactEmail: data.secondaryContactEmail || null,
        onlyPrimarySecondaryNotified: data.onlyPrimarySecondaryNotified || false,

        // Section 3: Individual Cuotaholder(s) Information
        individualCuotaholders: JSON.stringify(data.individualCuotaholders || []),

        // Section 4: Corporate Cuotaholder(s) Information
        corporateCuotaholders: JSON.stringify(data.corporateCuotaholders || []),

        // Section 5: Ultimate Beneficial Owner(s)
        uboSameAsCuotaholder: data.uboSameAsCuotaholder || false,
        ubos: JSON.stringify(data.ubos || []),

        // Section 6: Managing Director(s)
        directorSameAsCuotaholder: data.directorSameAsCuotaholder || false,
        directors: JSON.stringify(data.directors || []),

        // Additional fields
        nominalValueOfCuotas: data.nominalValueOfCuotas || '100',
        numberOfCuotasToBeIssued: data.numberOfCuotasToBeIssued || '1000',
        natureOfBusiness: data.natureOfBusiness || null,

        // Status
        status: data.status || 'active',
      },
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json({ error: 'Error updating company' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.company.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting company:', error)
    return NextResponse.json({ error: 'Error deleting company' }, { status: 500 })
  }
}
