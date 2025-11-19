import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { customerId, templateId } = data

    // Get customer
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
    }

    // Get template
    const template = await prisma.documentTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      return NextResponse.json({ error: 'Plantilla no encontrada' }, { status: 404 })
    }

    // Replace placeholders in template content
    let content = template.content
    const placeholders: Record<string, string | null> = {
      '{{firstName}}': customer.firstName,
      '{{lastName}}': customer.lastName,
      '{{fullName}}': `${customer.firstName} ${customer.lastName}`,
      '{{email}}': customer.email,
      '{{phone}}': customer.phone,
      '{{mobile}}': customer.mobile,
      '{{idType}}': customer.idType,
      '{{idNumber}}': customer.idNumber,
      '{{address}}': customer.address,
      '{{city}}': customer.city,
      '{{state}}': customer.state,
      '{{country}}': customer.country,
      '{{postalCode}}': customer.postalCode,
      '{{companyName}}': customer.companyName,
      '{{companyId}}': customer.companyId,
      '{{position}}': customer.position,
      '{{notes}}': customer.notes,
      '{{category}}': customer.category,
      '{{date}}': new Date().toLocaleDateString('es-CR'),
    }

    Object.entries(placeholders).forEach(([placeholder, value]) => {
      content = content.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value || '')
    })

    // Parse content into paragraphs
    const paragraphs = content.split('\n').map(line => {
      // Check if it's a heading
      if (line.startsWith('# ')) {
        return new Paragraph({
          children: [new TextRun({ text: line.substring(2), bold: true, size: 32 })],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        })
      }
      if (line.startsWith('## ')) {
        return new Paragraph({
          children: [new TextRun({ text: line.substring(3), bold: true, size: 28 })],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        })
      }

      return new Paragraph({
        children: [new TextRun({ text: line, size: 24 })],
        spacing: { after: 120 },
      })
    })

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: template.name,
                bold: true,
                size: 36,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          ...paragraphs,
          new Paragraph({
            children: [
              new TextRun({
                text: `Generado el: ${new Date().toLocaleDateString('es-CR')}`,
                size: 20,
                italics: true,
              }),
            ],
            spacing: { before: 400 },
          }),
        ],
      }],
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

    // Log generated document
    await prisma.generatedDocument.create({
      data: {
        customerId: customer.id,
        templateId: template.id,
        fileName: `${template.name}_${customer.lastName}_${customer.firstName}.docx`,
        fileType: 'docx',
        generatedData: JSON.stringify({ customer, template: { id: template.id, name: template.name } }),
      },
    })

    // Log export history
    await prisma.exportHistory.create({
      data: {
        exportType: 'word',
        fileName: `${template.name}_${customer.lastName}_${customer.firstName}.docx`,
        recordCount: 1,
        filterCriteria: JSON.stringify({ customerId, templateId }),
      },
    })

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${template.name}_${customer.lastName}_${customer.firstName}.docx"`,
      },
    })
  } catch (error) {
    console.error('Error generating Word document:', error)
    return NextResponse.json({ error: 'Error al generar documento Word' }, { status: 500 })
  }
}
