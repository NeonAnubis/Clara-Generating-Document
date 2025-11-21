import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const where = {
      AND: [
        search ? {
          OR: [
            { primaryContactName: { contains: search, mode: 'insensitive' as const } },
            { primaryContactEmail: { contains: search, mode: 'insensitive' as const } },
            { secondaryContactName: { contains: search, mode: 'insensitive' as const } },
            { natureOfBusiness: { contains: search, mode: 'insensitive' as const } },
          ]
        } : {},
        status ? { status } : {},
      ]
    }

    const companies = await prisma.company.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Parse JSON fields before returning
    const parsedCompanies = companies.map(company => ({
      ...company,
      individualCuotaholders: JSON.parse(company.individualCuotaholders),
      corporateCuotaholders: JSON.parse(company.corporateCuotaholders),
      ubos: JSON.parse(company.ubos),
      directors: JSON.parse(company.directors),
    }))

    return NextResponse.json(parsedCompanies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json({ error: 'Error fetching companies' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const company = await prisma.company.create({
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

    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json({ error: 'Error creating company' }, { status: 500 })
  }
}
