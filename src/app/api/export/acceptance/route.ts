import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Footer,
  BorderStyle,
  PageBreak,
} from 'docx'

// Helper function to format date in Spanish
function formatDateSpanish(date: Date): string {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} de ${month} del año ${year}`
}

// Helper function to format date in English
function formatDateEnglish(date: Date): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  // Add ordinal suffix
  const suffix = (day === 1 || day === 21 || day === 31) ? 'st' :
                 (day === 2 || day === 22) ? 'nd' :
                 (day === 3 || day === 23) ? 'rd' : 'th'

  return `${month} ${day}${suffix}, ${year}`
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { customerId, managerIndex = 1 } = data

    // Get customer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = await (prisma.customer as any).findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Extract manager data based on index (1 = Manager 1, 2 = Manager 2)
    let managerFirstName: string
    let managerLastName: string
    let managerId: string
    let managerAddress: string
    let managerOccupation: string
    let managerMaritalStatus: string
    let managerNationality: string

    if (managerIndex === 2) {
      managerFirstName = customer.manager2FirstName || ''
      managerLastName = customer.manager2LastName || ''
      managerId = customer.manager2Id || ''
      managerAddress = customer.manager2Address || ''
      managerOccupation = customer.manager2Occupation || ''
      managerMaritalStatus = customer.manager2MaritalStatus || ''
      managerNationality = customer.manager2Nationality || ''
    } else {
      managerFirstName = customer.managerFirstName || ''
      managerLastName = customer.managerLastName || ''
      managerId = customer.managerId || ''
      managerAddress = customer.managerAddress || ''
      managerOccupation = customer.managerOccupation || ''
      managerMaritalStatus = customer.managerMaritalStatus || ''
      managerNationality = customer.managerNationality || ''
    }

    const tradeName = customer.tradeName || ''
    const managerFullName = `${managerFirstName} ${managerLastName}`.trim()

    // Current date
    const currentDate = new Date()
    const dateSpanish = formatDateSpanish(currentDate)
    const dateEnglish = formatDateEnglish(currentDate)

    // Define colors
    const navyColor = '2C3E50'
    const goldColor = 'C4A962'

    // Create footer
    const createDocumentFooter = () => {
      return new Footer({
        children: [
          new Paragraph({
            spacing: { before: 200 },
            children: [
              new TextRun({
                text: '**Esta aceptación se ha realizado para expresar la voluntad expresa de o de las personas nombradas y de acuerdo con el Artículo 17, inciso 12) del Código de Comercio de Costa Rica aceptando todos los efectos legales de la misma.',
                size: 16,
                color: '666666',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 100 },
            children: [
              new TextRun({
                text: '**This acceptance letter was issued to expressly accept the position mention. It accordant to the article 17, part 12) of the',
                size: 16,
                color: '666666',
                italics: true,
              }),
            ],
          }),
        ],
      })
    }

    // Page 1 content
    const page1Content = [
      // Date - Spanish (moved from header to body)
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        border: {
          bottom: {
            color: '000000',
            size: 12,
            style: BorderStyle.SINGLE,
          },
        },
        children: [
          new TextRun({
            text: dateSpanish,
            size: 20,
            color: navyColor,
          }),
        ],
      }),
      // Date - English
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: dateEnglish,
            size: 18,
            color: '666666',
            italics: true,
          }),
        ],
      }),
      // Title - Spanish
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 100 },
        children: [
          new TextRun({
            text: 'CARTA DE ACEPTACIÓN A PUESTO DE GERENTE',
            bold: true,
            size: 24,
            color: navyColor,
            underline: {},
          }),
        ],
      }),
      // Title - English
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: 'ACCEPTANCE LETTER AS MANAGER',
            size: 20,
            color: '666666',
            italics: true,
          }),
        ],
      }),
      // Spanish greeting
      new Paragraph({
        spacing: { before: 300, after: 200 },
        children: [
          new TextRun({
            text: 'Señores Accionistas:',
            bold: true,
            size: 22,
          }),
        ],
      }),
      // Spanish paragraph
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 300 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'Quien suscribe, ',
            size: 22,
          }),
          new TextRun({
            text: managerFirstName.toUpperCase(),
            bold: true,
            size: 22,
          }),
          new TextRun({
            text: ' (nombre) ',
            size: 22,
            color: '666666',
          }),
          new TextRun({
            text: managerLastName.toUpperCase(),
            bold: true,
            size: 22,
          }),
          new TextRun({
            text: ' (apellido), de nacionalidad ',
            size: 22,
          }),
          new TextRun({
            text: managerNationality.toLowerCase(),
            size: 22,
          }),
          new TextRun({
            text: ', ',
            size: 22,
          }),
          new TextRun({
            text: managerMaritalStatus.toLowerCase(),
            size: 22,
          }),
          new TextRun({
            text: ', ',
            size: 22,
          }),
          new TextRun({
            text: managerOccupation.toLowerCase(),
            size: 22,
          }),
          new TextRun({
            text: ', con domicilio en ',
            size: 22,
          }),
          new TextRun({
            text: managerAddress,
            size: 22,
          }),
          new TextRun({
            text: '; portador del pasaporte de ',
            size: 22,
          }),
          new TextRun({
            text: managerNationality.toLowerCase(),
            size: 22,
          }),
          new TextRun({
            text: ' ',
            size: 22,
          }),
          new TextRun({
            text: managerId,
            size: 22,
          }),
          new TextRun({
            text: '; por este medio acepto mi cargo como ',
            size: 22,
          }),
          new TextRun({
            text: 'GERENTE',
            bold: true,
            size: 22,
          }),
          new TextRun({
            text: ' de la sociedad costarricense que se denominará legalmente con el número de cédula jurídica que le otorgue automáticamente el Registro Nacional:',
            size: 22,
          }),
        ],
      }),
      // English greeting
      new Paragraph({
        spacing: { before: 300, after: 200 },
        children: [
          new TextRun({
            text: 'Dear Shareholders:',
            size: 20,
            color: '666666',
            italics: true,
          }),
        ],
      }),
      // English paragraph
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 400 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'The undersigned ',
            size: 20,
            color: '666666',
            italics: true,
          }),
          new TextRun({
            text: managerFirstName.toUpperCase(),
            size: 20,
            color: '666666',
          }),
          new TextRun({
            text: ' (name) ',
            size: 20,
            color: '666666',
            italics: true,
          }),
          new TextRun({
            text: managerLastName.toUpperCase(),
            size: 20,
            color: '666666',
          }),
          new TextRun({
            text: ' (last name), of legal age, ',
            size: 20,
            color: '666666',
            italics: true,
          }),
          new TextRun({
            text: managerMaritalStatus.toLowerCase(),
            size: 20,
            color: '666666',
            italics: true,
          }),
          new TextRun({
            text: ', a ',
            size: 20,
            color: '666666',
            italics: true,
          }),
          new TextRun({
            text: managerOccupation.toLowerCase(),
            size: 20,
            color: '666666',
            italics: true,
          }),
          new TextRun({
            text: ', with domicile in ',
            size: 20,
            color: '666666',
            italics: true,
          }),
          new TextRun({
            text: managerAddress,
            size: 20,
            color: '666666',
            italics: true,
          }),
          new TextRun({
            text: '; bearer of the ',
            size: 20,
            color: '666666',
            italics: true,
          }),
          new TextRun({
            text: managerNationality,
            size: 20,
            color: '666666',
            italics: true,
          }),
          new TextRun({
            text: ' passport number ',
            size: 20,
            color: '666666',
            italics: true,
          }),
          new TextRun({
            text: managerId,
            size: 20,
            color: '666666',
          }),
          new TextRun({
            text: ', does hereby accept my position of MANAGER of the Costa Rican corporation to be registered and named with the corporate identification number granted automatically by the National Registry:',
            size: 20,
            color: '666666',
            italics: true,
          }),
        ],
      }),
      // Effective date - Spanish
      new Paragraph({
        spacing: { before: 400, after: 100 },
        children: [
          new TextRun({
            text: 'Aceptación que será efectiva a partir de la fecha: ',
            size: 22,
            color: goldColor,
          }),
          new TextRun({
            text: dateSpanish,
            size: 22,
          }),
        ],
      }),
      // Effective date - English
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: 'Such acceptance being effective from this date: ',
            size: 20,
            color: '666666',
            italics: true,
          }),
          new TextRun({
            text: dateEnglish,
            size: 20,
            color: '666666',
            italics: true,
          }),
        ],
      }),
    ]

    // Page 2 content
    const page2Content = [
      // Page break
      new Paragraph({
        children: [new PageBreak()],
      }),
      // Spacing
      new Paragraph({
        spacing: { before: 2000 },
        children: [],
      }),
      // Signature line
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: '_______________________________',
            size: 22,
          }),
        ],
      }),
      // Manager name
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        children: [
          new TextRun({
            text: managerFullName.toUpperCase(),
            bold: true,
            size: 24,
          }),
        ],
      }),
      // Internal reference label - Spanish
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 400 },
        children: [
          new TextRun({
            text: 'REFERENCIA INTERNA:',
            bold: true,
            size: 20,
            color: navyColor,
          }),
        ],
      }),
      // Internal reference label - English
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: 'INTERNAL REFERENCE:',
            size: 18,
            color: '666666',
            italics: true,
          }),
        ],
      }),
      // Reference code
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 100 },
        children: [
          new TextRun({
            text: tradeName,
            bold: true,
            size: 22,
            color: navyColor,
          }),
        ],
      }),
    ]

    // Page margins (in twips: 1 inch = 1440 twips)
    const topMargin = Math.round(0.98 * 1440)    // 0.98 inch
    const bottomMargin = Math.round(0.98 * 1440) // 0.98 inch
    const leftMargin = Math.round(1.18 * 1440)   // 1.18 inch
    const rightMargin = Math.round(1.18 * 1440)  // 1.18 inch

    // Page size (Letter: 8.5 x 11 inches)
    const pageWidth = Math.round(8.5 * 1440)     // 8.5 inch
    const pageHeight = Math.round(11 * 1440)     // 11 inch

    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: pageWidth,
                height: pageHeight,
              },
              margin: {
                top: topMargin,
                bottom: bottomMargin,
                left: leftMargin,
                right: rightMargin,
              },
            },
          },
          footers: {
            default: createDocumentFooter(),
          },
          children: [...page1Content, ...page2Content],
        },
      ],
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

    const fileName = `Acceptance_Letter_Manager_${tradeName || managerFullName.replace(/\s+/g, '_')}.docx`

    // Log export history
    await prisma.exportHistory.create({
      data: {
        exportType: 'word',
        fileName,
        recordCount: 1,
        filterCriteria: JSON.stringify({ customerId, type: 'acceptance', managerIndex }),
      },
    })

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Error generating acceptance letter:', error)
    return NextResponse.json({ error: 'Error generating acceptance letter' }, { status: 500 })
  }
}
