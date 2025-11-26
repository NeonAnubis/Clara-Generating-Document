# Sistema de Papeleria - Document Management System

A comprehensive document management system designed for Costa Rican businesses to automate customer documentation workflows, from data entry to document generation.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Tailwind CSS, shadcn/ui components
- **Document Generation**: docx library for Word documents
- **Internationalization**: next-intl (English & Spanish)
- **Authentication**: Custom JWT-based authentication

---

## Features

### Authentication System
- **User Registration**: Sign up with email, password, and WhatsApp number
- **User Login**: Secure JWT-based authentication with HTTP-only cookies
- **Protected Routes**: Middleware-based route protection for all pages and APIs
- **Session Management**: Auto-redirect for authenticated/unauthenticated users

### Dashboard
- Real-time statistics display:
  - Total customers registered
  - Available document templates
  - Total exports generated
- Recent exports activity feed
- Quick action buttons for common tasks:
  - Add new customer
  - Export data
  - Manage templates

### Customer Management (61 Fields)
Full customer relationship management with comprehensive data fields:

**Company Information:**
- Company name, type, and abbreviation
- Legal ID (Cedula Juridica)
- Share capital, number of shares, share value
- Registered address and company term
- Incorporation date

**Shareholder 1 Information:**
- Name, identification, profession, marital status
- Address, certificate number, ownership percentage
- Number of shares held, shares in words

**Shareholder 2 Information:**
- Full duplicate of shareholder 1 fields

**Manager Information:**
- First name, last name, ID
- Address, occupation, marital status, nationality

**Additional Fields:**
- Legal representative, taxation status
- Renewal dates, book legalization
- Active/archived status, email, trade name

**Features:**
- Tabbed interface: Register Customer / Customer List
- Excel-like registration form with all 61 fields
- Sortable and searchable customer list
- Click to view/edit individual customer details
- Delete customers with confirmation

### Template Management
- Create document templates with placeholder syntax: `{{fieldName}}`
- Template fields:
  - Name, description, category
  - Content with placeholders
  - Active/inactive status
- Available placeholders map to all 61 customer fields
- Edit and delete templates
- Category-based organization

### Document Export System

#### Quota Certificate (Certificado de Cuotas)
- Professional Word document generation
- Select customer and cuotaholder (shareholder 1 or 2)
- Configurable certificate number and series
- Includes:
  - Company header with logo
  - Certificate details with cuotaholder information
  - Share ownership details
  - Manager signature section

#### Acta Constitutiva
- Legal incorporation document generation
- Complete company constitution text in Spanish
- Auto-populated with:
  - Company details
  - Both shareholders' information
  - Manager appointment
  - Resident agent information
- Numbers automatically converted to Spanish words
- Current date/time insertion

#### Portada (Book Covers)
- Two-page book cover document generation
- Page 1: ASAMBLEA DE CUOTISTAS (Shareholder Assembly)
- Page 2: REGISTRO DE CUOTISTAS (Shareholder Registry)
- Professional styling:
  - Custom header image support
  - Navy and gold color scheme
  - Centered content boxes
  - Book legalization details

#### Word Export (Template-based)
- Select customer + template combination
- Auto-replace all placeholders with customer data
- Download as .docx file

#### Excel Export
- Export customer data to spreadsheet
- Select specific fields to include
- Bulk customer selection

### Export History
- Complete audit trail of all generated documents
- Tracks:
  - Export type (Excel/Word)
  - File name
  - Record count
  - Date/time
  - Filter criteria used

### Internationalization
- Full support for English and Spanish
- All UI elements translated
- Locale-specific formatting

---

## Database Schema

### Customer (61 fields)
Complete company and shareholder information storage

### DocumentTemplate
Reusable templates with placeholder support

### GeneratedDocument
Audit trail linking customers to generated documents

### ExportHistory
Log of all export operations

### User
Authentication with email, password, and WhatsApp number

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user

### Customers
- `GET /api/customers` - List customers (with search and field selection)
- `POST /api/customers` - Create customer
- `GET /api/customers/[id]` - Get customer by ID
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer

### Templates
- `GET /api/templates` - List templates (with active/minimal filters)
- `POST /api/templates` - Create template
- `GET /api/templates/[id]` - Get template by ID
- `PUT /api/templates/[id]` - Update template
- `DELETE /api/templates/[id]` - Delete template

### Export
- `POST /api/export/excel` - Export customers to Excel
- `POST /api/export/word` - Generate Word document from template
- `POST /api/export/quota-certificate` - Generate quota certificate
- `POST /api/export/acta-constitutiva` - Generate incorporation document
- `POST /api/export/portada` - Generate book cover pages

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
# Edit .env with your database credentials:
# DATABASE_URL="postgresql://user:password@host:port/database"
# JWT_SECRET="your-secret-key"
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

### Build for Production
```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── customers/     # Customer CRUD
│   │   ├── templates/     # Template CRUD
│   │   └── export/        # Document generation
│   ├── customers/         # Customer pages
│   ├── export/            # Export page
│   ├── history/           # History page
│   ├── templates/         # Templates page
│   ├── signin/            # Login page
│   └── signup/            # Registration page
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── customers/         # Customer form and list
│   ├── templates/         # Template form and list
│   ├── history/           # History display
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities
│   ├── prisma.ts          # Database client
│   ├── auth.ts            # Authentication helpers
│   └── types.ts           # TypeScript types
├── assets/                # Static assets (header images)
└── middleware.ts          # Route protection
messages/
├── en.json                # English translations
└── es.json                # Spanish translations
prisma/
└── schema.prisma          # Database schema
```

---

## Future Roadmap

### Phase 2: Enhanced Templates
- Rich text editor for template creation
- Support for tables, images, and logos
- Batch document generation
- PDF export option

### Phase 3: Advanced Features
- Email integration - send documents directly
- Digital signature support
- Document versioning
- Template cloning

### Phase 4: Collaboration
- Multi-user support with roles
- Activity logs per user
- Approval workflows
- Team dashboards

### Phase 5: Intelligence
- Auto-suggestions based on document type
- Duplicate customer detection
- Document analytics
- Third-party API integrations

---

## Support

For questions or issues, please open an issue on GitHub.

---

*Built for Costa Rican businesses*
