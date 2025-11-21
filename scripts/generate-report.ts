import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TableOfContents,
  PageBreak,
} from 'docx'
import * as fs from 'fs'
import * as path from 'path'

async function generateReport() {
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: 'Calibri',
            size: 24, // 12pt
          },
          paragraph: {
            spacing: {
              after: 200,
              line: 276, // 1.15 line spacing
            },
          },
        },
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: 'Calibri Light',
            size: 40, // 20pt
            bold: true,
            color: '2E74B5',
          },
          paragraph: {
            spacing: {
              before: 400,
              after: 200,
            },
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: 'Calibri Light',
            size: 32, // 16pt
            bold: true,
            color: '2E74B5',
          },
          paragraph: {
            spacing: {
              before: 300,
              after: 100,
            },
          },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: 'Calibri',
            size: 26, // 13pt
            bold: true,
            color: '1F4E79',
          },
          paragraph: {
            spacing: {
              before: 200,
              after: 100,
            },
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Title Page
          new Paragraph({
            children: [],
            spacing: { before: 2000 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Sistema de Papelería',
                font: 'Calibri Light',
                size: 72, // 36pt
                bold: true,
                color: '2E74B5',
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Document Management System',
                font: 'Calibri Light',
                size: 40, // 20pt
                color: '5B9BD5',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                color: 'CCCCCC',
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Project Overview & Roadmap',
                font: 'Calibri',
                size: 28, // 14pt
                italics: true,
                color: '666666',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 2000 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Built with care for Costa Rican businesses',
                font: 'Calibri',
                size: 22, // 11pt
                italics: true,
                color: '888888',
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),

          // Page break before content
          new Paragraph({
            children: [new PageBreak()],
          }),

          // Mission
          new Paragraph({
            text: 'Mission',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Transform the way small and medium businesses in Costa Rica manage their customer documentation. Our goal is to eliminate the hours spent on manual data entry and repetitive document creation, allowing teams to focus on what truly matters: serving their customers.',
                size: 24,
              }),
            ],
            spacing: { after: 400 },
          }),

          // The Problem We Solve
          new Paragraph({
            text: 'The Problem We Solve',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Many businesses still rely on manual processes to generate routine documents - contracts, invoices, certificates, and reports. This leads to:',
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '•  Hours wasted copying information between systems', size: 24 }),
            ],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '•  Inconsistencies and errors in generated documents', size: 24 }),
            ],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '•  Difficulty maintaining up-to-date customer records', size: 24 }),
            ],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '•  No centralized system for document tracking', size: 24 }),
            ],
            indent: { left: 720 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Sistema de Papelería',
                bold: true,
                size: 24,
              }),
              new TextRun({
                text: ' automates the entire "papelería" workflow, from data entry to document generation.',
                size: 24,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Pages & Functionality
          new Paragraph({
            text: 'Pages & Functionality',
            heading: HeadingLevel.HEADING_1,
          }),

          // Dashboard
          new Paragraph({
            text: 'Dashboard',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Your command center. View key metrics at a glance:',
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Total customers registered', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Available document templates', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Export history and activity', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Quick access to common actions', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 300 },
          }),

          // Clientes
          new Paragraph({
            text: 'Clientes (Customers)',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Complete customer relationship management:',
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Add, edit, and delete customer records', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Search and filter by name, company, or ID', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Track customer status (active, inactive, pending)', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Store complete contact, identification, and company information', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Costa Rica-specific fields (Cédula Nacional, Cédula Jurídica, DIMEX)', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 300 },
          }),

          // Plantillas
          new Paragraph({
            text: 'Plantillas (Templates)',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Create reusable document templates with dynamic placeholders:',
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Design templates using simple placeholder syntax: {{firstName}}, {{companyName}}', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Organize templates by category (contracts, letters, invoices)', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Select which customer fields each template uses', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Activate/deactivate templates as needed', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 300 },
          }),

          // Exportar
          new Paragraph({
            text: 'Exportar (Export)',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'The heart of the automation:',
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '•  Excel Export: ', bold: true, size: 24 }),
              new TextRun({ text: 'Generate spreadsheets with selected customers and custom column selection', size: 24 }),
            ],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '•  Word Export: ', bold: true, size: 24 }),
              new TextRun({ text: 'Select a customer + template to instantly generate a personalized document', size: 24 }),
            ],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  All placeholders automatically replaced with customer data', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 300 },
          }),

          // Historial
          new Paragraph({
            text: 'Historial (History)',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Complete audit trail:',
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Track all generated documents', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  View export dates, file types, and record counts', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Monitor system usage over time', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 400 },
          }),

          // Core Features
          new Paragraph({
            text: 'Core Features',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: 'What Makes Us Different',
            heading: HeadingLevel.HEADING_2,
          }),

          // Feature 1
          new Paragraph({
            children: [
              new TextRun({
                text: '1. Designed for Non-Technical Users',
                bold: true,
                size: 26,
                color: '1F4E79',
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Clean, intuitive Spanish-language interface', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  No training required - start using immediately', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Simple workflow: select customer → select template → download document', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 200 },
          }),

          // Feature 2
          new Paragraph({
            children: [
              new TextRun({
                text: '2. Costa Rica-Specific',
                bold: true,
                size: 26,
                color: '1F4E79',
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Built-in support for Cédula Nacional, Cédula de Residencia, DIMEX, Pasaporte', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Cédula Jurídica for company identification', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Province/Canton address structure', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Spanish date formatting', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 200 },
          }),

          // Feature 3
          new Paragraph({
            children: [
              new TextRun({
                text: '3. Template Flexibility',
                bold: true,
                size: 26,
                color: '1F4E79',
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Create unlimited templates without coding', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Modify templates anytime without developer help', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Preview which fields are available for each template', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 200 },
          }),

          // Feature 4
          new Paragraph({
            children: [
              new TextRun({
                text: '4. Instant Document Generation',
                bold: true,
                size: 26,
                color: '1F4E79',
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  From customer data to finished Word document in seconds', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Consistent formatting every time', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  No more copy-paste errors', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 200 },
          }),

          // Feature 5
          new Paragraph({
            children: [
              new TextRun({
                text: '5. Excel Integration',
                bold: true,
                size: 26,
                color: '1F4E79',
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Export customer data for external workflows', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Choose exactly which fields to include', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Ready for import into other systems', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 400 },
          }),

          // Future Expansion Plans
          new Paragraph({
            text: 'Future Expansion Plans',
            heading: HeadingLevel.HEADING_1,
          }),

          // Phase 2
          new Paragraph({
            text: 'Phase 2: Enhanced Templates',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Rich text editor for template creation', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Support for tables, images, and logos in templates', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Multiple document generation (batch processing)', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  PDF export option', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 300 },
          }),

          // Phase 3
          new Paragraph({
            text: 'Phase 3: Advanced Features',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Email integration - send documents directly to customers', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Digital signature support', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Document versioning and history per customer', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Template cloning and inheritance', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 300 },
          }),

          // Phase 4
          new Paragraph({
            text: 'Phase 4: Collaboration',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Multi-user support with role-based permissions', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Activity logs per user', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Approval workflows for sensitive documents', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Team dashboards', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 300 },
          }),

          // Phase 5
          new Paragraph({
            text: 'Phase 5: Intelligence',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Auto-suggestions based on document type', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Duplicate customer detection', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  Document analytics and insights', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '•  API for third-party integrations', size: 24 })],
            indent: { left: 720 },
            spacing: { after: 600 },
          }),

          // Footer
          new Paragraph({
            children: [
              new TextRun({
                text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                color: 'CCCCCC',
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Built with care for Costa Rican businesses',
                font: 'Calibri',
                size: 22,
                italics: true,
                color: '888888',
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)
  const outputPath = path.join(process.cwd(), 'Sistema_de_Papeleria_Report.docx')
  fs.writeFileSync(outputPath, buffer)
}

generateReport().catch(console.error)
