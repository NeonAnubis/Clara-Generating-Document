import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Header,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  VerticalAlign,
  TableLayoutType,
} from 'docx'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { customerId, tomo = 'PRIMERO' } = data

    // Get customer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = await (prisma.customer as any).findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Extract customer data with defaults
    const legalId = customer.legalId || '3-102-000000'
    const abbreviation = customer.abbreviation || 'LIMITADA'
    const bookLegalization = customer.bookLegalization || ''
    const tradeName = customer.tradeName || ''

    // Define colors
    const navyColor = '2C3E50'
    const goldColor = '555555'

    // Create header with table layout matching fourth_header.png
    const createDocumentHeader = () => {
      return new Header({
        children: [
          new Table({
            layout: TableLayoutType.FIXED,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              // First row: Legal ID + Abbreviation | empty | Nº Legalización label
              new TableRow({
                children: [
                  // Left cell: Legal ID and company type
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE,
                    },
                    borders: {
                      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                      bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                      left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                    },
                    verticalAlign: VerticalAlign.BOTTOM,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                          new TextRun({
                            text: `${legalId} ${abbreviation}`,
                            bold: true,
                            size: 24,
                            color: navyColor,
                          }),
                        ],
                      }),
                    ],
                  }),
                  // Right cell: Nº Legalización label
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE,
                    },
                    borders: {
                      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                      bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                      left: { style: BorderStyle.SINGLE, size: 8, color: navyColor },
                      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                    },
                    verticalAlign: VerticalAlign.TOP,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'Nº Legalización',
                            size: 18,
                            color: navyColor,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              // Second row: TOMO text | Series code | Legalization number
              new TableRow({
                children: [
                  // Left cell: TOMO and series
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE,
                    },
                    borders: {
                      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                      bottom: { style: BorderStyle.SINGLE, size: 8, color: '555555' },
                      left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                    },
                    verticalAlign: VerticalAlign.TOP,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                          new TextRun({
                            text: `TOMO ${tomo}`,
                            size: 18,
                            color: '000000',
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        indent: {
                          right: 200,
                        },
                        children: [
                          new TextRun({
                            text: tradeName,
                            size: 16,
                            color: navyColor,
                          }),
                        ],
                      }),
                    ],
                  }),
                  // Right cell: Legalization number
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE,
                    },
                    borders: {
                      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                      bottom: { style: BorderStyle.SINGLE, size: 8, color: goldColor },
                      left: { style: BorderStyle.SINGLE, size: 8, color: navyColor },
                      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                    },
                    verticalAlign: VerticalAlign.CENTER,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: bookLegalization,
                            bold: true,
                            size: 22,
                            color: navyColor,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    }

    // Page margins
    const topMargin = Math.round(1.0 * 1440)
    const bottomMargin = Math.round(1.0 * 1440)
    const leftMargin = Math.round(1.0 * 1440)
    const rightMargin = Math.round(1.0 * 1440)

    // Create the document with the custom header
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: topMargin,
                bottom: bottomMargin,
                left: leftMargin,
                right: rightMargin,
              },
            },
          },
          headers: {
            default: createDocumentHeader(),
          },
          children: [
            // Empty document body - content will be placed in header
            new Paragraph({
              children: [],
            }),
          ],
        },
      ],
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

    const fileName = `Book_Header_${legalId.replace(/\s+/g, '_')}.docx`

    // Log export history
    await prisma.exportHistory.create({
      data: {
        exportType: 'word',
        fileName,
        recordCount: 1,
        filterCriteria: JSON.stringify({ customerId, type: 'book-header', tomo }),
      },
    })

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Error generating book header:', error)
    return NextResponse.json({ error: 'Error generating book header' }, { status: 500 })
  }
}
