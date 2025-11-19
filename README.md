# Sistema de Papelería - Document Management System

## Mission

Transform the way small and medium businesses in Costa Rica manage their customer documentation. Our goal is to eliminate the hours spent on manual data entry and repetitive document creation, allowing teams to focus on what truly matters: serving their customers.

## The Problem We Solve

Many businesses still rely on manual processes to generate routine documents - contracts, invoices, certificates, and reports. This leads to:
- Hours wasted copying information between systems
- Inconsistencies and errors in generated documents
- Difficulty maintaining up-to-date customer records
- No centralized system for document tracking

**Sistema de Papelería** automates the entire "papelería" workflow, from data entry to document generation.

---

## Pages & Functionality

### Dashboard
Your command center. View key metrics at a glance:
- Total customers registered
- Available document templates
- Export history and activity
- Quick access to common actions

### Clientes (Customers)
Complete customer relationship management:
- Add, edit, and delete customer records
- Search and filter by name, company, or ID
- Track customer status (active, inactive, pending)
- Store complete contact, identification, and company information
- Costa Rica-specific fields (Cédula Nacional, Cédula Jurídica, DIMEX)

### Plantillas (Templates)
Create reusable document templates with dynamic placeholders:
- Design templates using simple placeholder syntax: `{{firstName}}`, `{{companyName}}`
- Organize templates by category (contracts, letters, invoices)
- Select which customer fields each template uses
- Activate/deactivate templates as needed

### Exportar (Export)
The heart of the automation:
- **Excel Export**: Generate spreadsheets with selected customers and custom column selection
- **Word Export**: Select a customer + template to instantly generate a personalized document
- All placeholders automatically replaced with customer data

### Historial (History)
Complete audit trail:
- Track all generated documents
- View export dates, file types, and record counts
- Monitor system usage over time

---

## Core Features

### What Makes Us Different

1. **Designed for Non-Technical Users**
   - Clean, intuitive Spanish-language interface
   - No training required - start using immediately
   - Simple workflow: select customer → select template → download document

2. **Costa Rica-Specific**
   - Built-in support for Cédula Nacional, Cédula de Residencia, DIMEX, Pasaporte
   - Cédula Jurídica for company identification
   - Province/Canton address structure
   - Spanish date formatting

3. **Template Flexibility**
   - Create unlimited templates without coding
   - Modify templates anytime without developer help
   - Preview which fields are available for each template

4. **Instant Document Generation**
   - From customer data to finished Word document in seconds
   - Consistent formatting every time
   - No more copy-paste errors

5. **Excel Integration**
   - Export customer data for external workflows
   - Choose exactly which fields to include
   - Ready for import into other systems

---

## Future Expansion Plans

### Phase 2: Enhanced Templates
- Rich text editor for template creation
- Support for tables, images, and logos in templates
- Multiple document generation (batch processing)
- PDF export option

### Phase 3: Advanced Features
- Email integration - send documents directly to customers
- Digital signature support
- Document versioning and history per customer
- Template cloning and inheritance

### Phase 4: Collaboration
- Multi-user support with role-based permissions
- Activity logs per user
- Approval workflows for sensitive documents
- Team dashboards

### Phase 5: Intelligence
- Auto-suggestions based on document type
- Duplicate customer detection
- Document analytics and insights
- API for third-party integrations

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/NeonAnubis/Clara-Generating-Document.git
cd Clara-Generating-Document
```

2. Install dependencies
```bash
npm install
```

3. Configure environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Set up database
```bash
npx prisma db push
```

5. Run the application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the system.

---

## Support

For questions or issues, please open an issue on GitHub.

---

*Built with care for Costa Rican businesses*
