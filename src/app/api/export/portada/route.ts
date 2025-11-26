import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Header,
  ImageRun,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  PageBreak,
  TableLayoutType,
} from 'docx'
import * as fs from 'fs'
import * as path from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { customerId } = data

    // Get customer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = await (prisma.customer as any).findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Extract customer data with defaults
    const companyName = customer.companyName || 'NOMBRE DE LA SOCIEDAD'
    const abbreviation = customer.abbreviation || 'S.R.L'
    const companyType = customer.companyType || 'SOCIEDAD DE RESPONSABILIDAD LIMITADA'
    const legalId = customer.legalId || '3-102-000000'
    const bookLegalization = customer.bookLegalization || ''
    const incorporationDate = customer.incorporationDate || ''

    // Read header image
    const headerImagePath = path.join(process.cwd(), 'src/assets/header.png')
    let headerImageBuffer: Buffer | null = null
    try {
      headerImageBuffer = fs.readFileSync(headerImagePath)
    } catch {
      console.log('Header image not found, continuing without it')
    }

    // Define colors
    const goldColor = 'C4A962'
    const navyColor = '2C3E50'

    // Create header with image
    const createHeader = () => {
      if (headerImageBuffer) {
        return new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: headerImageBuffer,
                  transformation: {
                    width: 600,
                    height: 50,
                  },
                  type: 'png',
                }),
              ],
            }),
          ],
        })
      }
      return new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            border: {
              bottom: {
                color: goldColor,
                size: 12,
                style: BorderStyle.SINGLE,
              },
            },
            children: [
              new TextRun({
                text: '',
              }),
            ],
          }),
        ],
      })
    }

    // Create page content function
    const createPageContent = (bookType: string) => {
      const fullCompanyName = `${companyName} ${companyType}`

      return [
        // "LEGALIZACIÓN DE LIBROS" text aligned right
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 400, after: 400 },
          children: [
            new TextRun({
              text: 'LEGALIZACIÓN DE LIBROS',
              color: navyColor,
              size: 20,
            }),
          ],
        }),
        // Company name with abbreviation
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 600, after: 200 },
          children: [
            new TextRun({
              text: `${companyName.toUpperCase()} ${abbreviation}`,
              bold: true,
              color: navyColor,
              size: 28,
              font: 'Times New Roman',
            }),
          ],
        }),
        // "PRIMERA VEZ" text with yellow underline
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
          border: {
            bottom: {
              color: goldColor,
              size: 6,
              style: BorderStyle.SINGLE,
            },
          },
          children: [
            new TextRun({
              text: 'PRIMERA VEZ',
              color: goldColor,
              size: 24,
            }),
          ],
        }),
        // Empty spacing paragraph
        new Paragraph({
          spacing: { before: 400, after: 200 },
          children: [],
        }),
        // Main content box using centered table
        new Table({
          layout: TableLayoutType.FIXED,
          width: {
            size: 85,
            type: WidthType.PERCENTAGE,
          },
          alignment: AlignmentType.CENTER,
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                    left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                    right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                  },
                  shading: {
                    fill: 'F5F5F5',
                  },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [
                    // ASIENTO NO.
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 400, after: 300 },
                      children: [
                        new TextRun({
                          text: 'ASIENTO NO. ',
                          bold: true,
                          size: 22,
                        }),
                        new TextRun({
                          text: bookLegalization,
                          size: 22,
                        }),
                      ],
                    }),
                    // Se hace constar...
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 200, after: 200 },
                      children: [
                        new TextRun({
                          text: 'Se hace constar con vista en el asiento de legalización inserto en el',
                          size: 20,
                          color: '666666',
                        }),
                      ],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 0, after: 200 },
                      children: [
                        new TextRun({
                          text: 'presente libro:',
                          size: 20,
                          color: '666666',
                        }),
                      ],
                    }),
                    // Que aquí inicia el libro...
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 300, after: 200 },
                      children: [
                        new TextRun({
                          text: 'Que aquí inicia el libro ',
                          size: 20,
                        }),
                        new TextRun({
                          text: `${bookType} `,
                          bold: true,
                          size: 20,
                        }),
                        new TextRun({
                          text: 'No. 1',
                          size: 20,
                        }),
                      ],
                    }),
                    // Que lleva la sociedad:
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 200, after: 200 },
                      children: [
                        new TextRun({
                          text: 'Que lleva la sociedad:',
                          size: 20,
                          color: '666666',
                        }),
                      ],
                    }),
                    // Full company name
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 200, after: 200 },
                      children: [
                        new TextRun({
                          text: fullCompanyName.toUpperCase(),
                          bold: true,
                          size: 20,
                        }),
                      ],
                    }),
                    // Cédula de persona jurídica
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 200, after: 200 },
                      children: [
                        new TextRun({
                          text: 'Cédula de persona jurídica ',
                          color: goldColor,
                          size: 20,
                        }),
                        new TextRun({
                          text: `número ${legalId}`,
                          size: 20,
                        }),
                      ],
                    }),
                    // Consta de 50 folios...
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 300, after: 300 },
                      children: [
                        new TextRun({
                          text: 'Consta de 50 folios en perfecto estado de conservación y limpieza',
                          size: 20,
                          color: '666666',
                        }),
                      ],
                    }),
                    // Empty line before FECHA DE LEGALIZACIÓN
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 100, after: 100 },
                      children: [],
                    }),
                    // FECHA DE LEGALIZACIÓN - inside the box
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 200, after: 100 },
                      children: [
                        new TextRun({
                          text: 'FECHA DE LEGALIZACIÓN',
                          size: 20,
                          color: '666666',
                        }),
                      ],
                    }),
                    // Date - inside the box
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 100, after: 200 },
                      children: [
                        new TextRun({
                          text: incorporationDate,
                          size: 20,
                        }),
                      ],
                    }),
                    // TIMBRES CANCELADOS - inside the box
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 200, after: 400 },
                      children: [
                        new TextRun({
                          text: 'TIMBRES CANCELADOS',
                          size: 20,
                          color: '666666',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]
    }

    // Page margins: Top 1.46", Bottom 0.98", Left 1.18", Right 1.18"
    // Convert inches to twentieths of a point (1 inch = 1440 twips)
    const topMargin = Math.round(1.46 * 1440) // 2102
    const bottomMargin = Math.round(0.98 * 1440) // 1411
    const leftMargin = Math.round(1.18 * 1440) // 1699
    const rightMargin = Math.round(1.18 * 1440) // 1699

    // Create the document with two pages
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
            default: createHeader(),
          },
          children: [
            ...createPageContent('ASAMBLEA DE CUOTISTAS'),
            new Paragraph({
              children: [new PageBreak()],
            }),
            ...createPageContent('REGISTRO DE CUOTISTAS'),
          ],
        },
      ],
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

    const fileName = `Portada_Libros_${companyName.replace(/\s+/g, '_')}.docx`

    // Log export history
    await prisma.exportHistory.create({
      data: {
        exportType: 'word',
        fileName,
        recordCount: 1,
        filterCriteria: JSON.stringify({ customerId, type: 'portada' }),
      },
    })

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Error generating portada:', error)
    return NextResponse.json({ error: 'Error generating portada' }, { status: 500 })
  }
}
