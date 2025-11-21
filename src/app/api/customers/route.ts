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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customers = await (prisma.customer as any).findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Parse JSON fields before returning
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsedCustomers = customers.map((customer: any) => ({
      ...customer,
      individualCuotaholders: JSON.parse(customer.individualCuotaholders || '[]'),
      corporateCuotaholders: JSON.parse(customer.corporateCuotaholders || '[]'),
      ubos: JSON.parse(customer.ubos || '[]'),
      directors: JSON.parse(customer.directors || '[]'),
    }))

    return NextResponse.json(parsedCustomers)
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
        primaryContactName: data.primaryContactName || null,
        primaryContactEmail: data.primaryContactEmail || null,
        secondaryContactName: data.secondaryContactName || null,
        secondaryContactEmail: data.secondaryContactEmail || null,
        onlyPrimarySecondaryNotified: data.onlyPrimarySecondaryNotified || false,
        individualCuotaholders: JSON.stringify(data.individualCuotaholders || []),
        corporateCuotaholders: JSON.stringify(data.corporateCuotaholders || []),
        uboSameAsCuotaholder: data.uboSameAsCuotaholder || false,
        ubos: JSON.stringify(data.ubos || []),
        directorSameAsCuotaholder: data.directorSameAsCuotaholder || false,
        directors: JSON.stringify(data.directors || []),
        nominalValueOfCuotas: data.nominalValueOfCuotas || '100',
        numberOfCuotasToBeIssued: data.numberOfCuotasToBeIssued || '1000',
        natureOfBusiness: data.natureOfBusiness || null,
        status: data.status || 'active',
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Error creating customer' }, { status: 500 })
  }
}
