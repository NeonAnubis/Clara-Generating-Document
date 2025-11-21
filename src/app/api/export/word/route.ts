import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { customerId, templateId } = data

    // Get customer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = await (prisma.customer as any).findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Get template
    const template = await prisma.documentTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Parse JSON fields
    const individualCuotaholders = JSON.parse(customer.individualCuotaholders)
    const corporateCuotaholders = JSON.parse(customer.corporateCuotaholders)

    // Get first cuotaholder name for file naming
    const firstCuotaholder = individualCuotaholders[0] || {}
    const cuotaholderName = firstCuotaholder.lastName
      ? `${firstCuotaholder.givenNames || ''}_${firstCuotaholder.lastName}`.trim()
      : corporateCuotaholders[0]?.companyName || 'customer'

    // Replace placeholders in template content
    let content = template.content
    const placeholders: Record<string, string | null> = {
      '{{primaryContactName}}': customer.primaryContactName,
      '{{primaryContactEmail}}': customer.primaryContactEmail,
      '{{secondaryContactName}}': customer.secondaryContactName,
      '{{secondaryContactEmail}}': customer.secondaryContactEmail,
      '{{natureOfBusiness}}': customer.natureOfBusiness,
      '{{nominalValueOfCuotas}}': customer.nominalValueOfCuotas,
      '{{numberOfCuotasToBeIssued}}': customer.numberOfCuotasToBeIssued,
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
                text: `Generated on: ${new Date().toLocaleDateString('es-CR')}`,
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

    const fileName = `${template.name}_${cuotaholderName}.docx`.replace(/\s+/g, '_')

    // Log generated document
    await prisma.generatedDocument.create({
      data: {
        customerId: customer.id,
        templateId: template.id,
        fileName,
        fileType: 'docx',
        generatedData: JSON.stringify({
          customer: {
            id: customer.id,
            primaryContactName: customer.primaryContactName,
            natureOfBusiness: customer.natureOfBusiness,
          },
          template: { id: template.id, name: template.name }
        }),
      },
    })

    // Log export history
    await prisma.exportHistory.create({
      data: {
        exportType: 'word',
        fileName,
        recordCount: 1,
        filterCriteria: JSON.stringify({ customerId, templateId }),
      },
    })

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Error generating Word document:', error)
    return NextResponse.json({ error: 'Error generating Word document' }, { status: 500 })
  }
}
