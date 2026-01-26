import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Header,
  BorderStyle,
  PageBreak,
  ImageRun,
} from 'docx'
import * as fs from 'fs'
import * as path from 'path'

// Helper function to convert Spanish number words to numeric value
function spanishWordsToNumber(text: string): number {
  const normalized = text.toUpperCase().trim()

  // Map of Spanish number words to values
  const units: { [key: string]: number } = {
    'CERO': 0, 'UNO': 1, 'UN': 1, 'UNA': 1, 'DOS': 2, 'TRES': 3, 'CUATRO': 4,
    'CINCO': 5, 'SEIS': 6, 'SIETE': 7, 'OCHO': 8, 'NUEVE': 9, 'DIEZ': 10,
    'ONCE': 11, 'DOCE': 12, 'TRECE': 13, 'CATORCE': 14, 'QUINCE': 15,
    'DIECISEIS': 16, 'DIECISÉIS': 16, 'DIECISIETE': 17, 'DIECIOCHO': 18, 'DIECINUEVE': 19,
    'VEINTE': 20, 'VEINTIUNO': 21, 'VEINTIUNA': 21, 'VEINTIDOS': 22, 'VEINTIDÓS': 22,
    'VEINTITRES': 23, 'VEINTITRÉS': 23, 'VEINTICUATRO': 24, 'VEINTICINCO': 25,
    'VEINTISEIS': 26, 'VEINTISÉIS': 26, 'VEINTISIETE': 27, 'VEINTIOCHO': 28, 'VEINTINUEVE': 29,
    'TREINTA': 30, 'CUARENTA': 40, 'CINCUENTA': 50, 'SESENTA': 60,
    'SETENTA': 70, 'OCHENTA': 80, 'NOVENTA': 90,
    'CIEN': 100, 'CIENTO': 100, 'DOSCIENTOS': 200, 'DOSCIENTAS': 200,
    'TRESCIENTOS': 300, 'TRESCIENTAS': 300, 'CUATROCIENTOS': 400, 'CUATROCIENTAS': 400,
    'QUINIENTOS': 500, 'QUINIENTAS': 500, 'SEISCIENTOS': 600, 'SEISCIENTAS': 600,
    'SETECIENTOS': 700, 'SETECIENTAS': 700, 'OCHOCIENTOS': 800, 'OCHOCIENTAS': 800,
    'NOVECIENTOS': 900, 'NOVECIENTAS': 900
  }

  const multipliers: { [key: string]: number } = {
    'MIL': 1000,
    'MILLON': 1000000, 'MILLÓN': 1000000, 'MILLONES': 1000000
  }

  // Check if it's already a number
  const numericValue = Number(normalized.replace(/[\s,\.]/g, ''))
  if (!isNaN(numericValue)) {
    return numericValue
  }

  // Split by spaces and 'Y'
  const words = normalized.replace(/\s+Y\s+/g, ' ').split(/\s+/)

  let result = 0
  let current = 0

  for (const word of words) {
    if (units[word] !== undefined) {
      current += units[word]
    } else if (multipliers[word] !== undefined) {
      if (current === 0) current = 1
      current *= multipliers[word]
      if (word !== 'MIL' || words.indexOf(word) === words.length - 1 ||
        (words.indexOf(word) < words.length - 1 && multipliers[words[words.indexOf(word) + 1]] === undefined)) {
        result += current
        current = 0
      }
    }
  }

  return result + current
}

// Helper function to format date with ordinal suffix
function formatDateWithOrdinal(date: Date): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  const suffix = (day === 1 || day === 21 || day === 31) ? 'st' :
    (day === 2 || day === 22) ? 'nd' :
      (day === 3 || day === 23) ? 'rd' : 'th'

  return `${month} ${day}${suffix}, ${year}`
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
    const tradeName = customer.tradeName || ''
    const legalId = customer.legalId || ''
    const shareCapital = customer.shareCapital || '100 000'
    const numberOfShares = customer.numberOfShares || '1000'
    const shareValue = customer.shareValue || '100'
    const currency = customer.currency || 'colons'

    // Seller 1 (Shareholder 1)
    const seller1Name = customer.shareholderOne || ''
    const seller1Id = customer.identification || ''
    const seller1Address = customer.shareholder1Address || ''
    const seller1Profession = customer.profession || ''

    // Seller 2 (Shareholder 2)
    const seller2Shares = customer.numberOfSharesHeld2?.toString() || '250'
    const seller2SharesInWords = customer.sharesInNumbers2 || 'TWO HUNDRED AND FIFTY'

    // Buyer (Manager or designated buyer)
    const buyerMaritalStatus = customer.managerMaritalStatus || 'soltero'

    // Current date
    const currentDate = new Date()
    const formattedDate = formatDateWithOrdinal(currentDate)

    // Define colors
    const navyColor = '2C3E50'

    // Load header image
    let headerImageData: Buffer | null = null
    try {
      const headerImagePath = path.join(process.cwd(), 'src', 'assets', 'header.png')
      headerImageData = fs.readFileSync(headerImagePath)
    } catch {
      console.warn('Header image not found, proceeding without it')
    }

    // Create header with logo
    const createDocumentHeader = () => {
      const headerChildren: Paragraph[] = []

      if (headerImageData) {
        // Original image dimensions for header.png
        // Full page width: 8.5 inches = 612 points at 72 DPI
        // Image should span full page width (outside margins)
        // Using negative indent to pull image outside margin area
        const imageWidth = 615 // Full page width in points
        const imageHeight = 45 // 0.56 inches (0.56 * 72 ≈ 40 points)

        // Left margin is 1.18 inches = ~85 points, use negative indent to compensate
        const negativeIndent = -Math.round(1.18 * 720) // Convert to twips (1 inch = 720 twips for indent)

        headerChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            indent: {
              left: negativeIndent,
              right: negativeIndent,
            },
            children: [
              new ImageRun({
                data: headerImageData,
                transformation: {
                  width: imageWidth,
                  height: imageHeight,
                },
                type: 'png',
              }),
            ],
          })
        )
      }

      // Trade name reference on the right
      headerChildren.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 0 },
          children: [
            new TextRun({
              text: tradeName,
              size: 20,
              color: navyColor,
            }),
          ],
        })
      )

      return new Header({
        children: headerChildren,
      })
    }

    // Page margins (in twips: 1 inch = 1440 twips)
    const topMargin = Math.round(0.98 * 1440)
    const bottomMargin = Math.round(0.98 * 1440)
    const leftMargin = Math.round(1.18 * 1440)
    const rightMargin = Math.round(1.18 * 1440)

    // Page size (Letter: 8.5 x 11 inches)
    const pageWidth = Math.round(8.5 * 1440)
    const pageHeight = Math.round(11 * 1440)

    // Font size for body text
    const bodySize = 22
    const grayColor = '666666'

    // PAGE 1 CONTENT
    const page1Content = [
      // Title
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({
            text: `STOCK PURCHASE AND SALE AGREEMENT ${legalId} LIMITADA`,
            bold: true,
            size: 24,
            color: navyColor,
          }),
        ],
      }),
      // First bordered section - Introduction (single box with all borders and padding)
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        border: {
          top: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 8 },
          left: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 8 },
          right: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 8 },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 8 },
        },
        spacing: { before: 200, after: 200, line: 276 },
        indent: { left: 144, right: 144 },
        children: [
          new TextRun({
            text: 'The Undersigned, ',
            size: bodySize,
          }),
          new TextRun({
            text: 'CARLOS VÍLCHEZ PRIETO',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ', of legal age, unmarried, a teacher, bearer of the identification document number four- one hundred and eighty-seven- four hundred and thirty-six, with domicile in San Rafael of Heredia, El Encanto residential, behind the cemetery, second house; and  ',
            size: bodySize,
          }),
          new TextRun({
            text: 'NURIA PATRICIA MENDEZ RAMIREZ',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ', of legal age, married, housewife, with domicile in San Pablo de Heredia, Residencial Lomas de San Pablo, from Aquafit pools one hundred meters south and two hundred and fifty meters west, bearer of the identification document one- seven hundred- three hundred and ninety-eight, hereinafter designated the "',
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLERS',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: '"; and ',
            size: bodySize,
          }),
          new TextRun({
            text: seller1Name.toUpperCase(),
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: `, of legal age, ${buyerMaritalStatus.toLowerCase()}, a ${seller1Profession.toLowerCase()}, bearer of the passport number ${seller1Id}, with domicile in ${seller1Address}; hereinafter designated as the "`,
            size: bodySize,
          }),
          new TextRun({
            text: 'BUYER',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: '", hereby enter into this ',
            size: bodySize,
          }),
          new TextRun({
            text: 'Stock Purchase and Sale Agreement',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' (the Agreement) to be regulated by the Costa Rican Code of Commerce, Costa Rican Civil Code, applicable laws and the following covenants ',
            size: bodySize,
          }),
          new TextRun({
            text: 'following covenants:',
            size: bodySize,
            color: grayColor,
          }),
        ],
      }),
      // WHEREAS section
      new Paragraph({
        spacing: { before: 300, after: 200 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'WHEREAS:',
            bold: true,
            size: bodySize,
          }),
        ],
      }),
      // Whereas paragraph
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'The ',
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLER CARLOS VÍLCHEZ PRIETO',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' is the legitimate and sole owner of ',
            size: bodySize,
          }),
          new TextRun({
            text: 'SEVEN HUNDRED AND FIFTY QUOTAS (750)',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' and the ',
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLER NURIA PATRICIA MENDEZ RAMIREZ',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' is the legitimate and sole owner ',
            size: bodySize,
          }),
          new TextRun({
            text: `${seller2SharesInWords} QUOTAS (${seller2Shares})`,
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ` that are the capital stock of the Costa Rican company named `,
            size: bodySize,
          }),
          new TextRun({
            text: `${legalId} LIMITADA`,
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: `, a corporation organized and existing under the laws of the Republic of Costa Rica, with name and corporate identification number ${legalId.replace(/-/g, '- ').replace(/(\d)(?=\d)/g, '$1 ')}, internal reference `,
            size: bodySize,
          }),
          new TextRun({
            text: tradeName,
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: `, registered before the Mercantile Registry, (hereinafter the "Company"), which has a capital stock of `,
            size: bodySize,
          }),
          new TextRun({
            text: `one hundred thousand ${currency} (¢${shareCapital})`,
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ', divided into ',
            size: bodySize,
          }),
          new TextRun({
            text: `one thousand QUOTAS (${numberOfShares})`,
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ` of one hundred ${currency} (¢${shareValue}) each one (hereinafter the "`,
            size: bodySize,
          }),
          new TextRun({
            text: 'STOCK',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: '"). The ',
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLERS',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' are the owners of the aforementioned capital based on the Stockholder\'s Registry Minutes; Book: one, page: two, entry: one.',
            size: bodySize,
          }),
        ],
      }),
      // Sellers guarantee paragraph
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'The ',
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLERS',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' guarantee that the Company is not involved in any litigation whatsoever, is up to date on all taxes and duties to any government or municipal agencies of the Republic of Costa Rica. They also guarantee that quotas or stocks are free from any burden, annotations, conditions, contracts, pawns, or any other conditions that might affect the ownership of the quotas or shares of the buyers.',
            size: bodySize,
          }),
        ],
      }),
    ]

    // PAGE 2 CONTENT
    const page2Content = [
      new Paragraph({
        children: [new PageBreak()],
      }),
      // THEREFORE section header (single box with all borders and padding)
      new Paragraph({
        border: {
          top: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 8 },
          left: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 8 },
          right: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 8 },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 8 },
        },
        spacing: { before: 200, after: 200 },
        indent: { left: 144, right: 144 },
        children: [
          new TextRun({
            text: 'THEREFORE, IT IS AGREED AS FOLLOWS:',
            bold: true,
            size: bodySize,
          }),
        ],
      }),
      // FIRST: TRANSACTION
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 200, after: 200 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'FIRST: TRANSACTION:',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' The ',
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLERS CARLOS VÍLCHEZ PRIETO and NURIA PATRICIA MENDEZ RAMIREZ',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' wish to sell to the ',
            size: bodySize,
          }),
          new TextRun({
            text: 'BUYER',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' the total of the ',
            size: bodySize,
          }),
          new TextRun({
            text: 'quotas',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' of the corporation, which belong in their entirety to the ',
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLERS, according to the following distribution:',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ` The `,
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLER CARLOS VÍLCHEZ PRIETO',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' and the ',
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLER NURIA PATRICIA MENDEZ RAMIREZ',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' sell, jointly, to the ',
            size: bodySize,
          }),
          new TextRun({
            text: `BUYER ${seller1Name.toUpperCase()}`,
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' the amount of ',
            size: bodySize,
          }),
          new TextRun({
            text: `ONE THOUSAND QUOTAS (${numberOfShares})`,
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' and according to this new distribution, the ',
            size: bodySize,
          }),
          new TextRun({
            text: `BUYER ${seller1Name.toUpperCase()}`,
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' is, hereinafter, the owner of ',
            size: bodySize,
          }),
          new TextRun({
            text: `ONE THOUSAND QUOTAS`,
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' and 100% of the STOCK of the Corporation.',
            size: bodySize,
          }),
        ],
      }),
      // SECOND: PURCHASE PRICE
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 200, after: 200 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'SECOND: PURCHASE PRICE:',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' The purchase price of the ',
            size: bodySize,
          }),
          new TextRun({
            text: 'STOCK',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ` is the sum of ¢${shareCapital} Costa Rican Colons (one hundred thousand ${currency}) hereby "the Purchase Price", to be paid by the `,
            size: bodySize,
          }),
          new TextRun({
            text: 'BUYER',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' to the ',
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLERS',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' under the following terms:',
            size: bodySize,
          }),
        ],
      }),
      // THIRD: Payment terms
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 200, after: 200 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'THIRD:',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ` A single payment of ¢${spanishWordsToNumber(shareCapital).toLocaleString('en-US')} (One hundred thousand Costa Rican colones) at the same moment of signature of this document.`,
            size: bodySize,
          }),
        ],
      }),
      // FOURTH: TITLE
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 200, after: 200 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'FOURTH: TITLE:',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' Regarding the company\'s ',
            size: bodySize,
          }),
          new TextRun({
            text: 'STOCK',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ', the ',
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLERS',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' are the owner of the ',
            size: bodySize,
          }),
          new TextRun({
            text: 'STOCK',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ', free and clear of any taxes, security interests, options, warrants, purchase rights contracts, commitments, equities, liens, claims and demands. The ',
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLERS',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' are not a party to any option, warrant, purchase right or other contract or commitment that could require ',
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLERS',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' to sell, transfer, or otherwise dispose of any of the ',
            size: bodySize,
          }),
          new TextRun({
            text: 'STOCK',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: '. The ',
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLERS',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' are not a party to any voting trust, proxy, or other agreement or understanding with respect to the voting of any of the ',
            size: bodySize,
          }),
          new TextRun({
            text: 'STOCK',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ';',
            size: bodySize,
          }),
        ],
      }),
      // FIFTH
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 200, after: 200 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'FIFTH',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ': The Sellers manifest they are due and expressly authorized to make the sale of quotas of shares of the company to third parties by the other quote-holders in accordance with Article 85 of the Commerce Code. In confirmation, the sellers authorized each to sell the quotas or shares transmitted in this contract to the person or persons who buy them in this act.',
            size: bodySize,
          }),
        ],
      }),
      // SIXTH: MISCELLANEOUS
      new Paragraph({
        spacing: { before: 200, after: 100 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'SIXTH: MISCELLANEOUS:',
            bold: true,
            size: bodySize,
          }),
        ],
      }),
      // a) Notarization
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'a) Notarization of this Contract:',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' The parties are free to notarize this Agreement and/or to authenticate its date and signatures, without being required to give prior notice to the other parties.',
            size: bodySize,
          }),
        ],
      }),
    ]

    // PAGE 3 CONTENT
    const page3Content = [
      new Paragraph({
        children: [new PageBreak()],
      }),
      // b) Amendment
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 200, after: 200 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'b) Amendment:',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' Any and all agreements by the Parties to amend, change, extend, review or discharge this Agreement, in whole or in part, shall be binding on the parties, so long as such agreements have been made in writing and executed jointly by all the parties.',
            size: bodySize,
          }),
        ],
      }),
      // c) Entire Agreement
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'c) Entire Agreement:',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' This Agreement constitutes and expresses the entire agreement of the parties as to all the matters herein referred to. All previous discussions, promises, representations and understandings relative thereto among the Parties are thus inapplicable.',
            size: bodySize,
          }),
        ],
      }),
      // c) Applicable Jurisdiction
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'c) Applicable Jurisdiction:',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' For all purposes all the parties agree that any claim, dispute, lawsuit or any other type of legal action will be resolved in the Costa Rica Legal System.',
            size: bodySize,
          }),
        ],
      }),
      // d) If any term...
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: 'd)',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: ' If any term, provision, covenant, or condition of this Agreement is held by a Costa Rica court of competent jurisdiction to be invalid, void, or unenforceable, the rest of the agreement shall remain in full force and effect and shall in no way be affected, impaired or invalidated.',
            size: bodySize,
          }),
        ],
      }),
      // Agreement date
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 200, after: 400 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: `Agreed with any specification of this document both parties sign the contract in full agreement on ${formattedDate}.`,
            size: bodySize,
          }),
        ],
      }),
      // Signature section header - "By the SELLERS" and "By the BUYER"
      new Paragraph({
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({
            text: 'By the ',
            size: bodySize,
          }),
          new TextRun({
            text: 'SELLERS',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: '\t\t\t\t\t\t\tBy the ',
            size: bodySize,
          }),
          new TextRun({
            text: 'BUYER',
            bold: true,
            size: bodySize,
          }),
        ],
      }),
      // Signature lines - Seller 1 and Buyer
      new Paragraph({
        spacing: { before: 400, after: 0 },
        children: [
          new TextRun({
            text: '__________________________',
            size: bodySize,
          }),
          new TextRun({
            text: '\t\t\t\t',
            size: bodySize,
          }),
          new TextRun({
            text: '_'.repeat(seller1Name.length + 5),
            size: bodySize,
          }),
        ],
      }),
      // Names row - CARLOS VÍLCHEZ PRIETO and CLARA ALVARADO JIMENEZ
      new Paragraph({
        spacing: { before: 0, after: 200 },
        children: [
          new TextRun({
            text: 'CARLOS VÍLCHEZ PRIETO',
            bold: true,
            size: bodySize,
          }),
          new TextRun({
            text: '\t\t\t\t',
            size: bodySize,
          }),
          new TextRun({
            text: seller1Name.toUpperCase(),
            bold: true,
            size: bodySize,
          }),
        ],
      }),
      // Seller 2 signature line
      new Paragraph({
        spacing: { before: 400, after: 0 },
        children: [
          new TextRun({
            text: '______________________________________',
            size: bodySize,
          }),
        ],
      }),
      // Seller 2 name - NURIA PATRICIA MENDEZ RAMIREZ
      new Paragraph({
        spacing: { before: 0, after: 400 },
        children: [
          new TextRun({
            text: 'NURIA PATRICIA MENDEZ RAMIREZ',
            bold: true,
            size: bodySize,
          }),
        ],
      }),
      // Notary section - italic gray text
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({
            text: `The undersigned Notary authenticates the signature of the two sellers only. San José, ${formattedDate}:`,
            size: bodySize,
            italics: true,
            color: grayColor,
          }),
        ],
      }),
      // Notary signature line
      new Paragraph({
        spacing: { before: 400, after: 0 },
        children: [
          new TextRun({
            text: '________________________',
            size: bodySize,
          }),
        ],
      }),
      // Notary name
      new Paragraph({
        spacing: { before: 0, after: 0 },
        children: [
          new TextRun({
            text: 'Licda. Clara Alvarado Jiménez',
            bold: true,
            size: bodySize,
          }),
        ],
      }),
      // Notary title
      new Paragraph({
        spacing: { before: 0, after: 0 },
        children: [
          new TextRun({
            text: 'Attorney at Law and Notary Public',
            size: bodySize,
          }),
        ],
      }),
    ]

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
          headers: {
            default: createDocumentHeader(),
            first: createDocumentHeader(),
          },
          children: [...page1Content, ...page2Content, ...page3Content],
        },
      ],
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

    const fileName = `STOCK_PURCHASE_AND_SALE_AGREEMENT_${tradeName || legalId.replace(/[^a-zA-Z0-9]/g, '')}.docx`

    // Log export history
    await prisma.exportHistory.create({
      data: {
        exportType: 'word',
        fileName,
        recordCount: 1,
        filterCriteria: JSON.stringify({ customerId, type: 'stock-agreement' }),
      },
    })

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Error generating stock agreement:', error)
    return NextResponse.json({ error: 'Error generating stock agreement' }, { status: 500 })
  }
}
