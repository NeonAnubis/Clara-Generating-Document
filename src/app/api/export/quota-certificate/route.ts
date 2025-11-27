import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun,
} from 'docx'
import * as fs from 'fs'
import * as path from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { customerId, cuotaholderIndex = 0, certificateNumber = '001', series = 'AB' } = data

    // Get customer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = await (prisma.customer as any).findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const shareValue = customer.shareValue || 'CIEN'
    const numberOfShares = customer.numberOfShares || 'MIL'
    const shareCapital = customer.shareCapital || ''

    // Use customer's incorporation date for "Plazo Social" sentence
    const incorporationDate = customer.incorporationDate || ''

    // Use customer's date, month, year fields for the "San José" date
    const customerDay = customer.date || ''
    const customerMonth = customer.month || ''
    const customerYear = customer.year || ''
    const customerFormattedDate = customerDay && customerMonth && customerYear
      ? `${customerDay} de ${customerMonth} de ${customerYear}`
      : ''

    // Create company ID from legalId
    const companyId = customer.legalId || '3-102-XXXXXX'

    // Load background image
    const backgroundImagePath = path.join(process.cwd(), 'src', 'assets', 'background.png')
    const backgroundImageBuffer = fs.readFileSync(backgroundImagePath)

    const shareholderIndex = cuotaholderIndex === 0 ? 'One' : 'Two'
    const shareholderField = `shareholder${shareholderIndex}` as const
    const shareholderName = customer[shareholderField] || 'NOMBRE DEL CUOTAHABIENTE'
    const cuotaholderName = shareholderName.toUpperCase()
    const identificationField = `identification${cuotaholderIndex === 0 ? '' : '2'}` as const
    const identification = customer[identificationField] || 'XXXXXXXXX'

    // Create the certificate document with borders
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: {
              width: 15840, // 11 inches in twips (1440 * 11)
              height: 12240, // 8.5 inches in twips (1440 * 8.5)
            },
            margin: {
              top: 1699, // 1.18 inch in twips (1440 * 1.18)
              bottom: 1699, // 1.18 inch in twips
              left: 1411, // 0.98 inch in twips (1440 * 0.98)
              right: 1411, // 0.98 inch in twips
            },
          },
        },
        children: [
          // Background image
          new Paragraph({
            children: [
              new ImageRun({
                type: 'png',
                data: backgroundImageBuffer,
                transformation: {
                  width: 1055,
                  height: 818,
                },
                floating: {
                  horizontalPosition: {
                    relative: 'page' as const,
                    offset: 0,
                  },
                  verticalPosition: {
                    relative: 'page' as const,
                    offset: 0,
                  },
                  behindDocument: true,
                },
              }),
            ],
          }),

          // Header row with certificate info
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `CERTIFICADO DE CUOTAS ${certificateNumber}`, color: '1E3A5F', size: 22 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: `SERIE ${series}`, color: '1E3A5F', size: 22, italics: true }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: `VALE POR ${numberOfShares} CUOTAS`, color: '1E3A5F', size: 32, bold: false }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Company name
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({ text: `${companyId} SOCIEDAD DE RESPONSABILIDAD LIMITADA`, bold: true, size: 44, color: '000000', font: 'Helvetica' }),
            ],
          }),

          // Trade name
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: customer.tradeName || '', color: '000000', size: 22 }),
            ],
          }),

          // Domiciled info
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
            children: [
              new TextRun({ text: 'DOMICILIADA EN SAN JOSE', color: '000000', size: 28, font: 'Helvetica' }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `CEDULA JURIDICA ${companyId}`, color: '000000', size: 28, font: 'Helvetica' }),
            ],
          }),

          // Capital social box
          new Table({
            width: { size: 80, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.CENTER,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    margins: { top: 200, bottom: 200, left: 200, right: 200 },
                    shading: { fill: 'F5F5F5' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: `CAPITAL SOCIAL ${shareCapital} COLONES REPRESENTANDO POR`, size: 22, font: 'Helvetica' }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 200 },
                        children: [
                          new TextRun({ text: `${numberOfShares} CUOTAS COMUNES Y NOMINATIVAS`, size: 22, font: 'Helvetica' }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 200 },
                        children: [
                          new TextRun({ text: `DE ${shareValue} COLONES CADA UNA`, size: 22, font: 'Helvetica' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Constitution info
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300 },
            children: [
              new TextRun({ text: 'Constituida por escritura otorgada en San José, ante la notaria Clara Alvarado Jiménez e inscrita ante el Registro', size: 22, font: 'Helvetica' }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Público, Sección Mercantil.', size: 22, font: 'Helvetica' }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `Plazo Social 120 años a partir de la fecha de constitución el ${incorporationDate}.`, size: 22, font: 'Helvetica' }),
            ],
          }),

          // Certification text
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400 },
            children: [
              new TextRun({ text: 'Certificamos que ', size: 22, font: 'Helvetica' }),
              new TextRun({ text: cuotaholderName + ',', bold: true, size: 22, font: 'Helvetica' }),
              new TextRun({ text: ` con identificación número ${identification}`, size: 22, font: 'Helvetica' }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
            children: [
              new TextRun({ text: 'es propietaria de ', size: 22, font: 'Helvetica' }),
              new TextRun({ text: `${numberOfShares} CUOTAS`, bold: true, size: 22, font: 'Helvetica' }),
              new TextRun({ text: ' comunes y nominativas.', size: 22, font: 'Helvetica' }),
            ],
          }),

          // Validation text
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
            children: [
              new TextRun({ text: 'Para su validez, este título debe ser certificado por el GERENTE.', size: 22, font: 'Helvetica' }),
            ],
          }),

          // Date
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
            children: [
              new TextRun({ text: `San José, ${customerFormattedDate}.`, bold: true, size: 22, font: 'Helvetica' }),
            ],
          }),

          // Signature line
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400 },
            children: [
              new TextRun({ text: '________________________________________', size: 20 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({ text: 'GERENTE', bold: true, size: 24 }),
            ],
          }),
        ],
      }],
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

    const fileName = `Certificado_Cuotas_${cuotaholderName.replace(/\s+/g, '_')}.docx`

    // Log export history
    await prisma.exportHistory.create({
      data: {
        exportType: 'word',
        fileName,
        recordCount: 1,
        filterCriteria: JSON.stringify({ customerId, type: 'quota-certificate' }),
      },
    })

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Error generating quota certificate:', error)
    return NextResponse.json({ error: 'Error generating quota certificate' }, { status: 500 })
  }
}
