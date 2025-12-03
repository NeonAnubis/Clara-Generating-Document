import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  convertInchesToTwip,
  LineRuleType,
} from 'docx'

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
    const companyType = customer.companyType || 'Sociedad de Responsabilidad Limitada'
    const abbreviation = customer.abbreviation || 'S.R.L'
    const registeredAddress = customer.registeredAddress || 'la Provincia de San José, Cantón: Montes de Oca, Distrito: San Pedro, Barrio Dent, del Centro Cultural Costarricense Norteamericano, doscientos metros al norte y cincuenta al este, Edificio Ofident, oficina número tres'
    const email = customer.email || 'crcompanies@advantagecr.com'
    const companyTerm = customer.companyTerm || 120
    const shareCapital = customer.shareCapital || 'cien mil'
    const numberOfShares = customer.numberOfShares || '1000'
    const shareValue = customer.shareValue || '100'
    const currency = customer.currency || 'colones'

    // Shareholder 1
    const shareholderOne = customer.shareholderOne || 'SOCIO UNO'
    const maritalStatus = customer.maritalStatus || 'soltero'
    const profession = customer.profession || 'comerciante'
    const identification = customer.identification || '0-0000-0000'
    const shareholder1Address = customer.shareholder1Address || 'San José'
    const sharesInWords1 = customer.sharesInWords1 || 'quinientas'
    const percentage1 = customer.percentage1 || '50'

    // Shareholder 2
    const shareholderTwo = customer.shareholderTwo || 'SOCIO DOS'
    const maritalStatus2 = customer.maritalStatus2 || 'soltero'
    const profession2 = customer.profession2 || 'comerciante'
    const identification2 = customer.identification2 || '0-0000-0000'
    const shareholder2Address = customer.shareholder2Address || 'San José'
    const sharesInWords2 = customer.sharesInNumbers2 || 'quinientas'
    const percentage2 = customer.percentage2 || '50'

    // Manager 1 (Gerente)
    const managerFirstName = customer.managerFirstName || 'NOMBRE'
    const managerLastName = customer.managerLastName || 'APELLIDO'
    const managerNationality = customer.managerNationality || 'costarricense'
    const managerMaritalStatus = customer.managerMaritalStatus || 'soltero'
    const managerOccupation = customer.managerOccupation || 'gerente'
    const managerAddress = customer.managerAddress || 'San José'
    const managerId = customer.managerId || '0-0000-0000'

    // Sub-manager (Subgerente)
    const subManagerFirstName = customer.subManagerFirstName || 'NOMBRE'
    const subManagerLastName = customer.subManagerLastName || 'APELLIDO'
    const subManagerMaritalStatus = customer.subManagerMaritalStatus || 'soltera'
    const subManagerOccupation = customer.subManagerOccupation || 'abogada'
    const subManagerAddress = customer.subManagerAddress || 'San José'
    const subManagerId = customer.subManagerId || '0-0000-0000'

    // Administration type
    const administration = customer.administration || 'UN GERENTE Y UN SUBGERENTE'

    // Calculate capital amounts based on shares and percentage
    const totalCapital = parseInt(numberOfShares) * parseInt(shareValue)
    const shareholder1Capital = Math.round(totalCapital * parseFloat(percentage1) / 100)
    const shareholder2Capital = Math.round(totalCapital * parseFloat(percentage2) / 100)

    // Current date
    const currentDate = new Date()
    const day = currentDate.getDate()
    const month = currentDate.toLocaleDateString('es-CR', { month: 'long' })
    const year = currentDate.getFullYear()
    const hours = currentDate.getHours()

    // Get shareholder last names for subscription reference
    const shareholderOneLastName = shareholderOne.split(' ').filter(Boolean).pop()?.toUpperCase() || shareholderOne.toUpperCase()
    const shareholderTwoLastName = shareholderTwo.split(' ').filter(Boolean).pop()?.toUpperCase() || shareholderTwo.toUpperCase()

    // Build the document text matching the sample document structure
    const documentText = `NUMERO ${customer.reference || 'CIENTO DIECISIETE'} - DOCE: Ante mí, CLARA ALVARADO JIMÉNEZ, Notaria Pública con oficina abierta en la ciudad de San José, comparecen los señores: GUSTAVO ADOLFO JIMÉNEZ ARIAS, mayor, soltero, profesor, portador de la cédula de identidad número cuatro- ciento ochenta y siete- cuatrocientos treinta y seis con domicilio en San Rafael de Heredia Urbanización el Encanto, detrás del Cementerio segunda casa a mano izquierda; y MANIFIESTAN: Que han convenido en constituir una sociedad de Responsabilidad Limitada, la cual se regirá por las disposiciones correspondientes del Código de Comercio vigente y por las siguientes cláusulas: PRIMERA: DEL NOMBRE: La sociedad se denominará con el número de cédula jurídica que le asigne el Registro Nacional con sufijo ${companyType}, el cual es nombre de fantasía, pudiendo abreviarse la tres últimas palabras ${abbreviation}. SEGUNDA: DEL DOMICILIO: El domicilio social será en ${registeredAddress}, pudiendo establecer agencias y sucursales o ambas en cualquier lugar del país o fuera de él. DIRECCIÓN ELECTRÓNICA: se establece como dirección electrónica el correo ${email} TERCERA: DEL OBJETO: comercio, actividades de entretenimiento en línea, pasarelas de pago, procesamiento de datos, todo tipo de comercio y servicios en línea, comercio electrónico, entretenimiento de todo tipo, administrar plataformas de entretenimiento de todo tipo, a proveer servicios de informática de todo tipo, desarrollo de programas y plataformas, soporte técnico, soporte en recursos de información, comprar, vender, intercambiar y comercializar criptomonedas. Podrá abrir cuentas corrientes en bancos nacionales o extranjeros, participar en licitaciones individualmente o en asocio con otras personas físicas o jurídicas, obtener concesiones, franquicias y patentes, asumir la representación de firmas nacionales y extranjeras, así como realizar toda clase de contratos y gestiones administrativas, judiciales y extrajudiciales. CUARTA: DEL PLAZO SOCIAL: El plazo social es de ${numberToSpanishWords(companyTerm)} años a partir de la fecha de su constitución. QUINTA: DEL CAPITAL SOCIAL: El capital social será la suma de ${shareCapital} ${currency}, dividido en ${numberOfShares} cuotas o títulos nominativos de ${numberToSpanishWords(parseInt(shareValue))} ${currency} cada uno, totalmente suscrito y pagado de la siguiente manera: el socio ${shareholderOneLastName} suscribe y paga ${sharesInWords1} cuotas y la socia ${shareholderTwoLastName} suscribe y paga ${sharesInWords2}. La suscrita notaria da fe que lo anterior fue cancelado mediante dos letras de cambio emitidas a favor de la sociedad, emitidas a la vista y girada por los suscriptores y estimadas en ${numberToSpanishWords(shareholder1Capital)} ${currency} la primera y la segunda en la suma de ${numberToSpanishWords(shareholder2Capital)} ${currency} la segunda. SEXTA: DEL EJERCICIO ECONÓMICO: El ejercicio económico termina el treinta y uno de diciembre de cada año, fecha en que se practicaran inventarios y balances utilizando las prácticas contables usuales. En la confección del balance se estimarán los valores del activo por el precio del día y los créditos dudosos por su valor probable, y los créditos incobrables no figurarán dentro del activo. SÉPTIMA: DE LAS UTILIDADES: De las utilidades líquidas anuales se separará un cinco por ciento para la formación de un fondo de Reserva Legal, cesando esta obligación una vez que este fondo alcance el diez por ciento del capital social. Los dividendos se pagarán sobre utilidades realizadas y líquidas. OCTAVA: Las ganancias y pérdidas se repartirán en proporción a la cuota o cuotas de cada socio. NOVENA: Las cuotas sociales no podrán ser traspasadas a otras personas sin el acuerdo previo y expreso de los cuotistas que representen por lo menos tres cuartas partes del capital social. En caso de ser rechazada la cesión propuesta los socios tendrán quince días hábiles para adquirir las cuotas en iguales condiciones que las ofrecidas a terceros rechazados y en proporción al número de las cuotas de que sean propietarios. En caso de fallecimiento de un cuotista los herederos legalmente declarados entraran de pleno derecho a formar parte de la sociedad como cuotistas. DÉCIMA: La sociedad será administrada por ${administration}, quienes podrán ser socio o no de la compañía. EL GERENTE Y EL SUBGERENTE tendrán representación judicial y extrajudicial de la compañía, con facultades de apoderados generalísimos sin limitación de suma, de conformidad con el artículo mil doscientos cincuenta y tres del Código Civil, así como podrán otorgar nuevos poderes, sustituir su poder en todo o en parte, revocar sustituciones y hacer otras de nuevo, conservando en todo momento su poder. Queda facultado el GERENTE, para abrir cuentas de ahorros o corrientes en bancos del sistema bancario nacional e internacional, para girar cheques contra las cuentas corrientes que la sociedad tenga en bancos nacionales o extranjeros, efectuar y retirar depósitos a plazo fijo en dichas instituciones, así como autorizar a terceras personas para cualquier tipo de trámite relacionado con las anteriores cuentas. GERENTE durará en su cargo por todo el plazo social. El SUBGERENTE durará en su cargo tres meses a partir de la fecha de nombramiento. El nombramiento y la revocación del mismo se producirá por mayoría relativa de votos, computados según las cuotas sociales. DÉCIMO PRIMERA: SESIONES: Los socios celebrarán una reunión al año dentro de los primeros tres meses después de haber finalizado el año económico para hacer el nombramiento del GERENTE y el Subgerente, conocer del inventario y balance y tomar los acuerdos necesarios para la buena marcha de la sociedad. DÉCIMO SEGUNDA: La liquidación de la sociedad y reparto del haber social se harán mediante un liquidador nombrado por mayoría de los socios o en su defecto por el Juez Civil correspondiente. El liquidador confeccionará un inventario, balance y cuenta distributiva del fondo partible y tendrá las responsabilidades, facultades y deberes que la ley determine. DÉCIMO TERCERA: Toda discordia o dificultad que se suscite entre los socios con motivo de la ejecución de este contrato será resuelta por un árbitro nombrado de común acuerdo por los socios o en su defecto por el Juez que corresponda. DÉCIMO CUARTA: DE LA DISOLUCIÓN: La sociedad se disolverá por cualquiera de las causas estipuladas por el Código de Comercio y en tal caso la Asamblea de Cuotistas con el quórum de ley procederá al nombramiento de un liquidador, a quien en el mismo acto se le fijaran sus atribuciones. NOMBRAMIENTOS: por el plazo social establecido se nombra como GERENTE a ${managerFirstName.toUpperCase()} (nombre) ${managerLastName.toUpperCase()} (apellido), de nacionalidad ${managerNationality}, mayor, ${managerMaritalStatus}, ${managerOccupation}, con domicilio en ${managerAddress}, portadora del pasaporte ${managerId}, quien acepta su puesto por medio de carta de aceptación dirigida a los cuotistas y entra en posesión del mismo. Se Nombra por un plazo de tres meses como subgerente a ${subManagerFirstName.toUpperCase()} ${subManagerLastName.toUpperCase()}, mayor, ${subManagerMaritalStatus}, ${subManagerOccupation}, con domicilio en ${subManagerAddress}, portadora de la cédula de identidad número ${subManagerId}, quien acepta puesto por medio de carta de aceptación dirigía a los cuotistas. Los nombrados aceptan sus cargos y juran su fiel cumplimiento. Expido un primer testimonio. Leído lo anterior a los comparecientes lo aprueban y firmamos en San José, a las ${numberToSpanishWords(hours)} horas del ${numberToSpanishWords(day)} de ${month} del año dos mil ${numberToSpanishWords(year - 2000)}. `

    // Create the document with exact margins matching the sample
    // Page margins in twips (1 inch = 1440 twips)
    // Top: 1.77 inches = 2549 twips
    // Left: 1.22 inches = 1757 twips
    // Bottom: 1.97 inches = 2837 twips
    // Right: 0.83 inches = 1195 twips
    // Page size: 8.5 x 14 inches (Legal)
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: {
              width: convertInchesToTwip(8.5),
              height: convertInchesToTwip(14),
            },
            margin: {
              top: convertInchesToTwip(1.77),
              right: convertInchesToTwip(0.83),
              bottom: convertInchesToTwip(1.97),
              left: convertInchesToTwip(1.22),
            },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              after: 0,
              line: 482, // Exact line spacing matching sample
              lineRule: LineRuleType.EXACT,
            },
            indent: {
              left: 113, // 113 twips left indent
              right: -113, // -113 twips right indent
            },
            children: [
              new TextRun({
                text: documentText,
                font: 'Calibri',
                size: 20, // 10pt (20 half-points)
              }),
            ],
          }),
        ],
      }],
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

    const companyName = customer.companyName || customer.legalId || 'Acta'
    const fileName = `Acta_Constitutiva_${companyName.replace(/\s+/g, '_')}.docx`

    // Log export history
    await prisma.exportHistory.create({
      data: {
        exportType: 'word',
        fileName,
        recordCount: 1,
        filterCriteria: JSON.stringify({ customerId, type: 'acta-constitutiva' }),
      },
    })

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Error generating acta constitutiva:', error)
    return NextResponse.json({ error: 'Error generating acta constitutiva' }, { status: 500 })
  }
}

// Helper function to convert numbers to Spanish words
function numberToSpanishWords(num: number): string {
  const units = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve']
  const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve']
  const tens = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa']
  const hundreds = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos']

  if (num === 0) return 'cero'
  if (num === 100) return 'cien'

  let result = ''

  if (num >= 1000) {
    const thousands = Math.floor(num / 1000)
    if (thousands === 1) {
      result += 'mil '
    } else {
      result += numberToSpanishWords(thousands) + ' mil '
    }
    num %= 1000
  }

  if (num >= 100) {
    result += hundreds[Math.floor(num / 100)] + ' '
    num %= 100
  }

  if (num >= 20) {
    const ten = Math.floor(num / 10)
    const unit = num % 10
    if (unit === 0) {
      result += tens[ten]
    } else if (ten === 2) {
      result += 'veinti' + units[unit]
    } else {
      result += tens[ten] + ' y ' + units[unit]
    }
  } else if (num >= 10) {
    result += teens[num - 10]
  } else if (num > 0) {
    result += units[num]
  }

  return result.trim()
}
