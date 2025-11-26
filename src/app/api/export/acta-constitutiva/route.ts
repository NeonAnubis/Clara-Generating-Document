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
    const registeredAddress = customer.registeredAddress || 'San José'
    const companyTerm = customer.companyTerm || 120
    const shareCapital = customer.shareCapital || 'cien mil'
    const numberOfShares = customer.numberOfShares || '1000'
    const shareValue = customer.shareValue || '100'

    // Shareholder 1
    const shareholderOne = customer.shareholderOne || 'SOCIO UNO'
    const maritalStatus = customer.maritalStatus || 'soltero'
    const profession = customer.profession || 'comerciante'
    const identification = customer.identification || '0-0000-0000'
    const shareholder1Address = customer.shareholder1Address || 'San José'
    const sharesInWords1 = customer.sharesInWords1 || 'quinientas'

    // Shareholder 2
    const shareholderTwo = customer.shareholderTwo || 'SOCIO DOS'
    const maritalStatus2 = customer.maritalStatus2 || 'soltero'
    const profession2 = customer.profession2 || 'comerciante'
    const identification2 = customer.identification2 || '0-0000-0000'
    const shareholder2Address = customer.shareholder2Address || 'San José'
    const sharesInWords2 = customer.sharesInNumbers2 || 'quinientas'

    // Manager info
    const managerFirstName = customer.managerFirstName || 'NOMBRE'
    const managerLastName = customer.managerLastName || 'APELLIDO'
    const managerNationality = customer.managerNationality || 'costarricense'
    const managerMaritalStatus = customer.managerMaritalStatus || 'soltero'
    const managerOccupation = customer.managerOccupation || 'comerciante'
    const managerAddress = customer.managerAddress || 'San José'
    const managerId = customer.managerId || '0-0000-0000'

    // Current date
    const currentDate = new Date()
    const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
    const formattedDate = currentDate.toLocaleDateString('es-CR', dateOptions)
    const hours = currentDate.getHours()
    const hoursInWords = numberToSpanishWords(hours)

    // Build the document text
    const documentText = `NUMERO ********** DIEZ: Ante mí, CLARA ALVARADO JIMÉNEZ, Notaria Pública con oficina abierta en la ciudad de San José, comparecen los señores: ${shareholderOne.toUpperCase()}, mayor, ${maritalStatus}, ${profession}, portador de la cédula de identidad número ${identification}, con domicilio en ${shareholder1Address}; y ${shareholderTwo.toUpperCase()}, mayor, ${maritalStatus2}, ${profession2}, portador de la cédula de identidad número ${identification2}, con domicilio en ${shareholder2Address} y MANIFIESTAN: Que han convenido en constituir una sociedad de Responsabilidad Limitada, la cual se regirá por las disposiciones correspondientes del Código de Comercio vigente y por las siguientes cláusulas: PRIMERA: DEL NOMBRE: La sociedad se denominará ${companyName.toUpperCase()} SOCIEDAD DE RESPONSABILIDAD LIMITADA, el cual es nombre de fantasía, pudiendo abreviarse las tres últimas palabras SRL. SEGUNDA: DEL DOMICILIO: El domicilio social será en ${registeredAddress}, pudiendo establecer agencias y sucursales o ambas en cualquier lugar del país o fuera de él. TERCERA: DEL OBJETO: comercio, actividades de entretenimiento en línea, procesamiento de datos, todo tipo de comercio y servicios en línea, comercio electrónico, entretenimiento de todo tipo, administrar plataformas de entretenimiento de todo tipo, a proveer servicios de informática de todo tipo, desarrollo de programas y plataformas, soporte técnico, soporte en recursos de información, comprar, vender, intercambiar y comercializar criptomonedas. Podrá abrir cuentas corrientes en bancos nacionales o extranjeros, participar en licitaciones individualmente o en asocio con otras personas físicas o jurídicas, obtener concesiones, franquicias y patentes, asumir la representación de firmas nacionales y extranjeras, así como realizar toda clase de contratos y gestiones administrativas, judiciales y extrajudiciales. CUARTA: DEL PLAZO SOCIAL: El plazo social es de ${numberToSpanishWords(companyTerm)} años a partir de la fecha de su constitución. QUINTA: DEL CAPITAL SOCIAL: El capital social será la suma de ${shareCapital} colones, dividido en ${numberToSpanishWords(parseInt(numberOfShares))} cuotas o títulos nominativos de ${numberToSpanishWords(parseInt(shareValue))} colones cada uno, totalmente suscrito y pagado de la siguiente manera: el socio ${shareholderOne.split(' ').pop()?.toUpperCase() || shareholderOne.toUpperCase()} suscribe y paga ${sharesInWords1} cuotas y el socio ${shareholderTwo.split(' ').pop()?.toUpperCase() || shareholderTwo.toUpperCase()} suscribe y paga ${sharesInWords2}. La suscrita notaria da fe que lo anterior fue cancelado mediante una letra de cambio emitida a favor de la sociedad, emitida a la vista y girada por los suscriptores. SEXTA: DEL EJERCICIO ECONÓMICO: El ejercicio económico termina el treinta y uno de diciembre de cada año, fecha en que se practicarán inventarios y balances utilizando las prácticas contables usuales. En la confección del balance se estimarán los valores del activo por el precio del día y los créditos dudosos por su valor probable, y los créditos incobrables no figurarán dentro del activo. SÉPTIMA: DE LAS UTILIDADES: De las utilidades líquidas anuales se separará un cinco por ciento para la formación de un fondo de Reserva Legal, cesando esta obligación una vez que este fondo alcance el diez por ciento del capital social. Los dividendos se pagarán sobre utilidades realizadas y líquidas. OCTAVA: Las ganancias y pérdidas se repartirán en proporción a la cuota o cuotas de cada socio. NOVENA: Las cuotas sociales no podrán ser traspasadas a otras personas sin el acuerdo previo y expreso de los cuotistas que representen por lo menos tres cuartas partes del capital social. En caso de ser rechazada la cesión propuesta los socios tendrán quince días hábiles para adquirir las cuotas en iguales condiciones que las ofrecidas a terceros rechazados y en proporción al número de las cuotas de que sean propietarios. En caso de fallecimiento de un cuotista los herederos legalmente declarados entrarán de pleno derecho a formar parte de la sociedad como cuotistas. DÉCIMA: La sociedad será administrada por DOS GERENTES, quienes podrán ser socios o no de la compañía, denominados GERENTE UNO y GERENTE DOS. EL GERENTE UNO y GERENTE DOS tendrán representación judicial y extrajudicial de la compañía, con facultades de apoderados generalísimos sin limitación de suma, conforme con el artículo mil doscientos cincuenta y tres del Código Civil, pudiendo actuar conjunta o separadamente, así como podrán otorgar nuevos poderes, sustituir su poder en todo o en parte, revocar sustituciones y hacer otras de nuevo, conservando en todo momento su poder. Quedan además facultados el GERENTE UNO y GERENTE DOS, para abrir cuentas de ahorros o corrientes en bancos del sistema bancario nacional e internacional, para girar cheques contra las cuentas corrientes que la sociedad tenga en bancos nacionales o extranjeros, efectuar y retirar depósitos a plazo fijo en dichas instituciones, así como autorizar a terceras personas para cualquier tipo de trámite relacionado con las anteriores cuentas. GERENTE UNO y GERENTE DOS durarán en sus cargos por todo el plazo social. El nombramiento y la revocación de los mismos se producirán por mayoría relativa de votos, computados según las cuotas sociales. DÉCIMO PRIMERA: SESIONES: Los socios celebrarán una reunión al año dentro de los primeros tres meses después de haber finalizado el año económico para hacer el nombramiento del GERENTE UNO y GERENTE DOS, conocer del inventario y balance y tomar los acuerdos necesarios para la buena marcha de la sociedad. DÉCIMO SEGUNDA: La liquidación de la sociedad y reparto del haber social se harán mediante un liquidador nombrado por mayoría de los socios o en su defecto por el Juez Civil correspondiente. El liquidador confeccionará un inventario, balance y cuenta distributiva del fondo partible y tendrá las responsabilidades, facultades y deberes que la ley determine. DÉCIMO TERCERA: Toda discordia o dificultad que se suscite entre los socios con motivo de la ejecución de este contrato será resuelta por un árbitro nombrado de común acuerdo por los socios o en su defecto por el Juez que corresponda. DÉCIMO CUARTA: DE LA DISOLUCIÓN: La sociedad se disolverá por cualquiera de las causas estipuladas por el Código de Comercio y en tal caso la Asamblea de Cuotistas con el quórum de ley procederá al nombramiento de un liquidador, a quien en el mismo acto se le fijarán sus atribuciones. NOMBRAMIENTOS: por el plazo social establecido se nombra como GERENTE UNO al señor ${managerFirstName.toUpperCase()} (nombre) ${managerLastName.toUpperCase()} (apellido), de nacionalidad ${managerNationality}, mayor, ${managerMaritalStatus}, ${managerOccupation}, con domicilio en ${managerAddress}, portador de la identificación ${managerId}, quien acepta su puesto por medio de carta de aceptación dirigida a los cuotistas y entra en posesión del mismo. AGENTE RESIDENTE: por el plazo de un año se nombra a CLARA ALVARADO JIMÉNEZ, mayor, soltera, abogada, portadora de la cédula de identidad número cuatro- ciento sesenta y tres- cuatrocientos ochenta y ocho, con domicilio en San Pablo de Heredia, y con oficina abierta para atender notificaciones en San José, Montes de Oca, San Pedro, cuatrocientos metros al norte y veinticinco al este del Automercado Los Yoses, Edificio Ofident, oficina número tres. Los nombrados aceptan sus cargos y juran su fiel cumplimiento. Expido un primer testimonio. Leído lo anterior a los comparecientes lo aprueban y firmamos en San José, a las ${hoursInWords} horas del ${formattedDate}.`

    // Create the document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1417,
              bottom: 1417,
              left: 1701,
              right: 1701,
            },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: documentText,
                size: 24, // 12pt
              }),
            ],
          }),
        ],
      }],
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

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
