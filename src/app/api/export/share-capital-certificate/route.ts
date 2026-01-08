import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from 'docx'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      customerId,
      consecutiveNumber = '563-2025',
      notaryName = 'CLARA ALVARADO JIMÉNEZ',
      bookAuthorizationNumber = '4062001346173',
      destinationCountry = 'ESTADOS UNIDOS DE AMERICA',
      shareholderIndex = 0,
    } = data

    // Get customer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = await (prisma.customer as any).findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Helper function to convert numbers to Spanish words (simplified version)
    const numberToSpanishWords = (num: string | number): string => {
      // This is a simplified version - you may want to expand this
      const numStr = num.toString()
      const words: { [key: string]: string } = {
        '0': 'cero', '1': 'uno', '2': 'dos', '3': 'tres', '4': 'cuatro',
        '5': 'cinco', '6': 'seis', '7': 'siete', '8': 'ocho', '9': 'nueve',
      }

      return numStr.split('').map(digit => words[digit] || digit).join(' ')
    }

    // Extract company information
    const companyName = customer.companyName || 'TRES - CIENTO DOS – NOVECIENTOS TREINTA Y CINCO MIL NOVECIENTOS NOVENTA Y CUATRO LIMITADA'
    const legalId = customer.legalId || '3-102-935994'
    const legalIdInWords = numberToSpanishWords(legalId)

    // Capital information
    const shareCapitalWords = 'CIEN MIL COLONES' // You may want to convert this programmatically
    const numberOfSharesWords = 'MIL CUOTAS'
    const shareValueWords = 'CIEN COLONES CADA UNA'

    // Get shareholder information based on index
    const shareholderField = shareholderIndex === 0 ? 'One' : 'Two'
    const firstName = customer[`shareholderFirstName${shareholderField === 'One' ? '' : shareholderField}` as keyof typeof customer] as string || 'MARTA-IOLANDA'
    const lastName = customer[`shareholderLastName${shareholderField === 'One' ? '' : shareholderField}` as keyof typeof customer] as string || 'URSU'
    const fullName = `${firstName} ${lastName}`

    const nationality = customer[`nationality${shareholderField === 'One' ? '' : '2'}` as keyof typeof customer] as string || 'rumana'
    const maritalStatus = customer[`maritalStatus${shareholderField === 'One' ? '' : '2'}` as keyof typeof customer] as string || 'casada'
    const occupation = customer[`occupation${shareholderField === 'One' ? '' : '2'}` as keyof typeof customer] as string || 'fiscal financiera'
    const address = customer[`address${shareholderField === 'One' ? '' : '2'}` as keyof typeof customer] as string || 'veintiuno Kyriakou Neokleous, dos seis cuatro cinco Kapede, Chipre'
    const passport = customer[`passport${shareholderField === 'One' ? '' : '2'}` as keyof typeof customer] as string || '063054899'
    const passportWords = numberToSpanishWords(passport)

    const ownershipPercentage = customer[`ownershipPercentage${shareholderField === 'One' ? '' : '2'}` as keyof typeof customer] as string || 'CIEN POR CIENTO'

    // Date information
    const dateWords = `catorce horas con siete minutos del quince de diciembre del año dos mil veinticinco` // You may want to make this dynamic

    // Create the document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          // Title
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `CERTIFICACION CONSECUTIVO ${consecutiveNumber.toUpperCase()}: `,
                bold: true,
                size: 24,
              }),
            ],
          }),

          // Notary introduction
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `${notaryName}, NOTARIA PÚBLICA, CON OFICINA ABIERTA EN LA CIUDAD DE SAN JOSÉ, CERTIFICO: PRIMERO: `,
                bold: true,
                size: 24,
              }),
            ],
          }),

          // Main certification paragraph
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Con vista en el libro de Registro de Cuotistas, de la sociedad ${companyName.toUpperCase()}, con cedula de persona jurídica número ${legalIdInWords}, debidamente legalizado por el Registro Nacional de Costa Rica con número de autorización de libros ${numberToSpanishWords(bookAuthorizationNumber)}, asiento primero y segundo y último de dicho libro, en donde se indica que el capital social de esta compañía se encuentra conformado por la suma de ${shareCapitalWords} representado en ${numberOfSharesWords} comunes y nominativas de ${shareValueWords}, en donde consta que ${firstName.toUpperCase()} (nombre) ${lastName.toUpperCase()} (apellido), de nacionalidad ${nationality}, mayor, ${maritalStatus}, ${occupation}, con domicilio en ${address}, portadora del pasaporte ${nationality} ${passportWords}, es dueña de ${numberOfSharesWords} comunes y nominativas de mil colones cada una; y por lo tanto ${firstName.toUpperCase()} ${lastName.toUpperCase()} es dueña del ${ownershipPercentage} de las cuotas de la empresa. `,
                size: 24,
              }),
            ],
          }),

          // Legal disclaimer
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Los asientos certificados lo han sido en lo conducente y lo omitido no modifica, altera, condiciona, restringe ni desvirtúa lo transcrito bajo responsabilidad de la suscrita notaria. No existen endosos ni asientos posteriores al día de hoy. Es todo. `,
                size: 24,
              }),
            ],
          }),

          // Purpose statement
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Extiendo la presente a solicitud de ${companyName.toUpperCase()} PARA SER UTILIZADO EN ${destinationCountry.toUpperCase()}. `,
                size: 24,
              }),
            ],
          }),

          // Certification date and stamps
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Certificación expedida en la ciudad de San José, a las ${dateWords}. Agrego y cancelo las especies fiscales de ley.`,
                size: 24,
              }),
            ],
          }),

          // Spacing
          new Paragraph({
            spacing: { before: 400 },
            children: [new TextRun({ text: '' })],
          }),

          // Signature line
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `(F) Licda. ${notaryName}.`,
                size: 24,
                italics: true,
              }),
            ],
          }),
        ],
      }],
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

    const fileName = `Certificacion_Capital_Social_${fullName.replace(/\s+/g, '_')}.docx`

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
