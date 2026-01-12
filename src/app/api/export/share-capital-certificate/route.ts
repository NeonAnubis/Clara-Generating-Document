import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  UnderlineType,
} from 'docx'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      customerId,
      consecutiveNumber = 'CERO ONCE- DOS MIL VEINTISÉIS',
      notaryName = 'CLARA ALVARADO JIMENEZ',
      notaryAddress = 'SAN JOSE, SAN PEDRO, BARRIO DENT, DEL AUTOMERCADO LOS YOSES CUATROCIENTOS METROS AL NORTE Y CINCUENTA AL ESTE',
      bookNumber = 'primero',
      seatNumber = 'segundo',
      bookAuthorizationNumber = 'cuatro cero seis dos cero cero uno tres cero ocho seis seis ocho',
      certificationDateTime = 'diez horas con cuarenta y ocho minutos del nueve de enero del año dos mil veintiséis',
    } = data

    // Get customer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = await (prisma.customer as any).findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Extract company information from database
    const companyName = customer.companyName || 'EVEREDGE MARKETING SOLUTIONS SOCIEDAD DE RESPONSABILIDAD LIMITADA'
    const legalId = customer.legalId || 'tres - ciento dos – ochocientos ochenta y dos mil seiscientos ochenta y seis'
    const shareCapital = customer.shareCapital || 'CIEN MIL COLONES'
    const numberOfShares = customer.numberOfShares || 'MIL CUOTAS'
    const shareValue = customer.shareValue || 'CIEN COLONES CADA UNA'

    // Shareholder information (the company/person who owns shares)
    const shareholderName = customer.shareholderOne || 'MAXIMUS DECIMUS LTD'
    const shareholderType = customer.shareholderType || 'una sociedad inscrita y registrada en las Islas Vírgenes Británicas'
    const shareholderCompanyNumber = customer.shareholderCompanyNumber || 'dos uno seis dos dos uno nueve'
    const shareholderAddress = customer.shareholderAddress || 'Woodbourne Hall, Road Town, Tortola, VG uno uno uno cero, Islas Vírgenes Británicas'
    const shareholderShares = customer.shareholderShares || 'MIL CUOTAS'
    const shareholderShareValue = customer.shareholderShareValue || 'mil colones cada una'
    const ownershipPercentage = customer.percentage1 || 'CIEN POR CIENTO'

    // Destination
    const destinationCountry = customer.destinationCountry || 'EUROPA Y ESTADOS UNIDOS'

    // Font size: 12pt = 24 half-points
    const fontSize = 24

    // Create the document with exact format matching original.jpeg
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          // Main content - single justified paragraph with mixed formatting
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 0, line: 276 },
            children: [
              // Opening certification header
              new TextRun({
                text: `CERTIFICACIÓN CONSECUTIVO ${consecutiveNumber}: ${notaryName}, NOTARIA PUBLICA CON OFICINA ABIERTA EN LA CIUDAD DE ${notaryAddress}; CERTIFICA: `,
                bold: true,
                size: fontSize,
              }),
              new TextRun({
                text: `Con vista en el tomo ${bookNumber}, asiento ${seatNumber} del libro de Registro de `,
                size: fontSize,
              }),
              new TextRun({
                text: `Cuotistas`,
                underline: { type: UnderlineType.SINGLE },
                size: fontSize,
              }),
              new TextRun({
                text: ` de la sociedad `,
                size: fontSize,
              }),
              new TextRun({
                text: `${companyName}`,
                bold: true,
                size: fontSize,
              }),
              new TextRun({
                text: `, con cédula jurídica ${legalId}, debidamente legalizados por Registro Nacional mediante autorización de libros digitales número ${bookAuthorizationNumber}, se indica que el capital social de esta compañía se encuentra conformado por la suma de `,
                size: fontSize,
              }),
              new TextRun({
                text: `${shareCapital}`,
                bold: true,
                size: fontSize,
              }),
              new TextRun({
                text: ` representado en `,
                size: fontSize,
              }),
              new TextRun({
                text: `${numberOfShares}`,
                bold: true,
                size: fontSize,
              }),
              new TextRun({
                text: ` comunes y nominativas de `,
                size: fontSize,
              }),
              new TextRun({
                text: `${shareValue}`,
                bold: true,
                size: fontSize,
              }),
              new TextRun({
                text: ` cada una, en donde consta que `,
                size: fontSize,
              }),
              new TextRun({
                text: `${shareholderName}`,
                bold: true,
                size: fontSize,
              }),
              new TextRun({
                text: `, ${shareholderType}, con número de compañía ${shareholderCompanyNumber}, con domicilio en `,
                size: fontSize,
              }),
              new TextRun({
                text: `${shareholderAddress}`,
                size: fontSize,
              }),
              new TextRun({
                text: `, es dueña de `,
                size: fontSize,
              }),
              new TextRun({
                text: `${shareholderShares}`,
                bold: true,
                size: fontSize,
              }),
              new TextRun({
                text: ` comunes y nominativas de  ${shareholderShareValue} cada una; y por lo tanto la compañía `,
                size: fontSize,
              }),
              new TextRun({
                text: `${shareholderName}`,
                bold: true,
                size: fontSize,
              }),
              new TextRun({
                text: ` es dueña del `,
                size: fontSize,
              }),
              new TextRun({
                text: `  ${ownershipPercentage}`,
                bold: true,
                size: fontSize,
              }),
              new TextRun({
                text: ` de las cuotas de la empresa. Los asientos certificados lo han sido en lo conducente y lo omitido no modifica, altera, condiciona, restringe ni desvirtúa lo transcrito bajo responsabilidad de la suscrita notaria. No existen endosos ni asientos posteriores al día de hoy. Es todo. Extiendo la presente a solicitud de `,
                size: fontSize,
              }),
              new TextRun({
                text: `${companyName} PARA SER UTILIZADO EN ${destinationCountry}`,
                bold: true,
                size: fontSize,
              }),
              new TextRun({
                text: `. Certificación expedida en la ciudad de San José, a las ${certificationDateTime}. Agrego y cancelo las especies fiscales de `,
                size: fontSize,
              }),
              new TextRun({
                text: `ley`,
                underline: { type: UnderlineType.SINGLE },
                size: fontSize,
              }),
              new TextRun({
                text: `.`,
                size: fontSize,
              }),
              // Add asterisks line
              new TextRun({
                text: `*`.repeat(100),
                size: fontSize,
              }),
            ],
          }),

          // Spacing before signature
          new Paragraph({
            spacing: { before: 600 },
            children: [new TextRun({ text: '' })],
          }),
          new Paragraph({
            spacing: { before: 200 },
            children: [new TextRun({ text: '' })],
          }),
          new Paragraph({
            spacing: { before: 200 },
            children: [new TextRun({ text: '' })],
          }),

          // Signature - Licda. name
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Licda. Clara Alvarado Jiménez`,
                bold: true,
                italics: true,
                size: fontSize,
              }),
            ],
          }),

          // Title - Abogada y Notaria
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Abogada y Notaria`,
                bold: true,
                italics: true,
                size: fontSize,
              }),
            ],
          }),
        ],
      }],
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

    const fileName = `Certificacion_Capital_Social_${companyName.replace(/\s+/g, '_').substring(0, 30)}.docx`

    // Log export history
    await prisma.exportHistory.create({
      data: {
        exportType: 'word',
        fileName,
        recordCount: 1,
        filterCriteria: JSON.stringify({ customerId, type: 'share-capital-certificate' }),
      },
    })

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Error generating share capital certificate:', error)
    return NextResponse.json({ error: 'Error generating share capital certificate' }, { status: 500 })
  }
}
