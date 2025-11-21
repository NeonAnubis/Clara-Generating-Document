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

    // Parse JSON fields before returning
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customerData = customer as any
    const parsedCustomer = {
      ...customer,
      individualCuotaholders: JSON.parse(customerData.individualCuotaholders || '[]'),
      corporateCuotaholders: JSON.parse(customerData.corporateCuotaholders || '[]'),
      ubos: JSON.parse(customerData.ubos || '[]'),
      directors: JSON.parse(customerData.directors || '[]'),
    }

    return NextResponse.json(parsedCustomer)
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
