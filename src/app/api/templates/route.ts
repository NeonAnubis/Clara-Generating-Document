import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active') === 'true'
    const minimal = searchParams.get('minimal') === 'true'

    const where = activeOnly ? { isActive: true } : {}

    // For minimal mode (export page), only fetch essential fields
    const select = minimal ? {
      id: true,
      name: true,
      category: true,
      isActive: true,
    } : undefined

    const templates = await prisma.documentTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(select ? { select } : {}),
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ error: 'Error al obtener plantillas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const template = await prisma.documentTemplate.create({
      data: {
        name: data.name,
        description: data.description || null,
        content: data.content,
        category: data.category || null,
        fieldMappings: JSON.stringify(data.fieldMappings || []),
        isActive: data.isActive ?? true,
      },
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Error al crear plantilla' }, { status: 500 })
  }
}
