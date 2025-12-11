import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak,
} from 'docx'

// Helper function to format Spanish date
function formatSpanishDate(date: Date): string {
  const day = date.getDate()
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ]
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} de ${month} del año ${year}`
}

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

    // Extract customer data
    const legalId = customer.legalId || '3-102-949120'
    const reference = customer.reference || 'CR00058'
    const shareCapital = customer.shareCapital || 'CIEN MIL'
    const numberOfShares = customer.numberOfShares || 'MIL'
    const shareValue = customer.shareValue || 'CIEN'

    // Seller 1 (fixed as per document)
    const seller1Name = 'CARLOS VÍLCHEZ PRIETO'
    const seller1MaritalStatus = customer.maritalStatus || 'divorciado una vez'
    const seller1Profession = customer.profession || 'asistente'
    const seller1Id = customer.identification || 'ocho- cien - cero cincuenta y dos'
    const seller1Address = customer.shareholder1Address || 'Santo Rafael de Heredia, ciento setenta y cinco metros al este del Restaurante Oasis'
    const seller1Shares = customer.sharesInWords1 || 'SETECIENTAS CINCUENTA'

    // Seller 2 (fixed as per document)
    const seller2Name = 'NURIA PATRICIA MENDEZ RAMIREZ'
    const seller2MaritalStatus = customer.maritalStatus2 || 'casada en primeras nupcias'
    const seller2Profession = customer.profession2 || 'ama de casa'
    const seller2Address = customer.shareholder2Address || 'San Pablo de Heredia, Residencial Lomas de San Pablo de las Piscinas Aquafit cien sur y doscientos cincuenta al oeste'
    const seller2Id = customer.identification2 || 'uno-setecientos- trescientos noventa y ocho'
    const seller2Shares = customer.sharesInWords2 || 'DOSCIENTAS CINCUENTA'

    // Buyer
    const buyerName = customer.managerFirstName && customer.managerLastName
      ? `${customer.managerFirstName} ${customer.managerLastName}`.toUpperCase()
      : 'SLADANA ANDELKOVIC'
    const buyerMaritalStatus = customer.managerMaritalStatus || 'soltera'
    const buyerProfession = customer.managerOccupation || 'operadora'
    const buyerAddress = customer.managerAddress || '30 Belostenska, Borca- Belgrade, 11211, Serbia'
    const buyerPassport = customer.managerId || '012878969'
    const buyerNationality = customer.managerNationality || 'serbio'

    // Current date
    const currentDate = new Date()
    const formattedDate = formatSpanishDate(currentDate)

    // Define text size and font
    const bodySize = 24 // 12pt
    const fontFamily = 'Arial'

    // Create the document with line numbering
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: 12240, // 8.5 inches in twips
                height: 15840, // 11 inches in twips
              },
              margin: {
                top: 1440, // 1 inch
                right: 1440, // 1 inch
                bottom: 1440, // 1 inch
                left: 1440, // 1 inch
              },
            },
            lineNumbers: {
              countBy: 1,
              restart: 'newPage' as const,
            },
          },
          children: [
            // Page 1 - Asiento Número Uno
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 0, line: 360 }, // 1.5 line spacing
              children: [
                new TextRun({
                  text: 'Asiento Número uno: ',
                  bold: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `Se hace constar que la sociedad a la cual corresponde este libro, ${legalId} `,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: 'SOCIEDAD DE RESPONSABILIDAD LIMITADA',
                  bold: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `, con referencia interna ${reference}, quedó inscrita en la sección mercantil del Registro Público bajo la cédula jurídica número (${legalId})`,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `    TRES- CIENTO DOS- NOVECIENTOS CUARENTA Y NUEVE MIL CIENTO VEINTE`,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `, la cual de acuerdo al pacto constitutivo posee un capital social de ${shareCapital} COLONES, dividido en ${numberOfShares} cuotas o títulos nominativos de ${shareValue} colones cada uno, totalmente suscrito y pagado de la siguiente manera: el señor `,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: seller1Name,
                  bold: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `, mayor, ${seller1MaritalStatus}, ${seller1Profession}, portador de la cédula de identidad número ${seller1Id}, con domicilio en ${seller1Address}, suscribe y paga `,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `${seller1Shares}`,
                  bold: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: ' cuotas; y ',
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: seller2Name,
                  bold: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `, mayor, ${seller2MaritalStatus}, ${seller2Profession}, con domicilio en ${seller2Address}, portadora de la cédula de identidad ${seller2Id}, suscribe y paga `,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `${seller2Shares}`,
                  bold: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: ` cuotas. San José, a las nueve horas del ${formattedDate}.`,
                  size: bodySize,
                  font: fontFamily,
                }),
              ],
            }),
            // Signature line for Seller 1
            new Paragraph({
              spacing: { before: 400, after: 0 },
              children: [
                new TextRun({
                  text: `${seller1Name} ________________________`,
                  size: bodySize,
                  font: fontFamily,
                }),
              ],
            }),
            // Signature line for Seller 2
            new Paragraph({
              spacing: { before: 200, after: 0 },
              children: [
                new TextRun({
                  text: `${seller2Name} ________________________`,
                  size: bodySize,
                  font: fontFamily,
                }),
              ],
            }),
            // Notary authentication
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: 200, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: 'Las anteriores dos firmas son auténticas y fueron puestas en mi presencia. ',
                  italics: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: 'Licda. Clara Alvarado Jiménez.',
                  bold: true,
                  italics: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: ` ${currentDate.getDate()} de ${['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][currentDate.getMonth()]} del ${currentDate.getFullYear()}.`,
                  italics: true,
                  size: bodySize,
                  font: fontFamily,
                }),
              ],
            }),
            // Empty line
            new Paragraph({
              spacing: { before: 200, after: 0 },
              children: [],
            }),
            // Asiento Número Dos
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: 200, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: 'Asiento Número Dos: ',
                  bold: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `Se toma nota del acuerdo mediante el cual los señores `,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `${seller1Name} y ${seller2Name}`,
                  bold: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `, en sus calidades de legítimos propietarios en forma conjunta del cien por ciento de las cuotas de esta empresa, sea de los certificados de cuotas número cero cero uno y cero cero dos respectivamente, los cuales amparan la totalidad de las cuotas o títulos nominativos; traspasan y ceden por el valor nominal la totalidad de las cuotas de su propiedad, de la siguiente manera: Los actuales cuotistas en conjunto ceden por su `,
                  size: bodySize,
                  font: fontFamily,
                }),
              ],
            }),
            // Page break
            new Paragraph({
              children: [new PageBreak()],
            }),
            // Page 2 continuation
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 0, line: 360 },
              children: [
                new TextRun({
                  text: `valor nominal `,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `${numberOfShares} CUOTAS`,
                  bold: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: ` de su propiedad a favor de `,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `LA COMPRADORA ${buyerName}`,
                  bold: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `, mayor, ${buyerMaritalStatus}, ${buyerProfession}, con domicilio en ${buyerAddress}, con pasaporte ${buyerNationality} número ${buyerPassport}, correspondiente a un 100% del capital social. La nueva Cuotista manifiesta la aceptación de dicho traspaso con la firma de la presente acta y a partir de este momento es la legítima propietaria de `,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `${numberOfShares} CUOTAS`,
                  bold: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `, lo cual corresponde al `,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: `CIEN POR CIENTO`,
                  bold: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: ` del capital social de la empresa. Manifiestan los comparecientes vendedores que se autorizan mutuamente para realizar la cesión de cuotas a terceras personas, y que la cesión, endoso y entrega de las cuotas se ha planteado en condiciones de mutua conveniencia, y como producto de la voluntad de los legítimos propietarios. Asimismo, se realiza de conformidad con el artículo veintitrés de la Ley Reguladora del Mercado de Valores, y con el artículo cuatro de las disposiciones para la realización de compraventa y reportos y recompras de valores objeto de oferta pública fuera de Bolsa, aprobado por el Consejo Nacional de Supervisión del Sistema Financiero. Se emiten nuevos certificados de cuotas con la serie AB y se entregan los anteriores certificados al gerente de la sociedad para su incineración. San José, a las doce horas del ${formattedDate}.`,
                  size: bodySize,
                  font: fontFamily,
                }),
              ],
            }),
            // VENDEDORES section
            new Paragraph({
              spacing: { before: 400, after: 200 },
              children: [
                new TextRun({
                  text: 'VENDEDORES:',
                  bold: true,
                  size: bodySize,
                  font: fontFamily,
                }),
              ],
            }),
            // Seller 1 signature
            new Paragraph({
              spacing: { before: 200, after: 0 },
              children: [
                new TextRun({
                  text: `${seller1Name} ________________________`,
                  size: bodySize,
                  font: fontFamily,
                }),
              ],
            }),
            // Seller 2 signature
            new Paragraph({
              spacing: { before: 200, after: 0 },
              children: [
                new TextRun({
                  text: `${seller2Name} ________________________`,
                  size: bodySize,
                  font: fontFamily,
                }),
              ],
            }),
            // Notary authentication for page 2
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: 200, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: 'Las anteriores dos firmas son auténticas y fueron puestas en mi presencia. ',
                  italics: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: 'Licda. Clara Alvarado Jiménez.',
                  bold: true,
                  italics: true,
                  size: bodySize,
                  font: fontFamily,
                }),
                new TextRun({
                  text: ` ${currentDate.getDate()} de ${['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][currentDate.getMonth()]} del ${currentDate.getFullYear()}.`,
                  italics: true,
                  size: bodySize,
                  font: fontFamily,
                }),
              ],
            }),
            // COMPRADOR section
            new Paragraph({
              spacing: { before: 400, after: 200 },
              children: [
                new TextRun({
                  text: 'COMPRADOR:',
                  bold: true,
                  size: bodySize,
                  font: fontFamily,
                }),
              ],
            }),
            // Buyer signature
            new Paragraph({
              spacing: { before: 200, after: 0 },
              children: [
                new TextRun({
                  text: `${buyerName} ________________________`,
                  size: bodySize,
                  font: fontFamily,
                }),
              ],
            }),
          ],
        },
      ],
    })

    // Generate document buffer
    const buffer = await Packer.toBuffer(doc)

    // Log to export history
    await prisma.exportHistory.create({
      data: {
        exportType: 'seat-number',
        fileName: `Seat_Number_${customer.tradeName || customer.companyName || 'document'}.docx`,
        recordCount: 1,
        filterCriteria: JSON.stringify({ customerId }),
      },
    })

    // Return as downloadable file
    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="Seat_Number_${customer.tradeName || 'document'}.docx"`,
      },
    })
  } catch (error) {
    console.error('Error generating seat number document:', error)
    return NextResponse.json(
      { error: 'Failed to generate seat number document' },
      { status: 500 }
    )
  }
}
