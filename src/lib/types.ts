import { Customer, DocumentTemplate, GeneratedDocument, ExportHistory } from '@prisma/client'

export type { Customer, DocumentTemplate, GeneratedDocument, ExportHistory }

export interface CustomerFormData {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  mobile?: string
  idType?: string
  idNumber?: string
  address?: string
  city?: string
  state?: string
  country: string
  postalCode?: string
  companyName?: string
  companyId?: string
  position?: string
  notes?: string
  category?: string
  status: string
}

export interface TemplateFormData {
  name: string
  description?: string
  content: string
  category?: string
  fieldMappings: string[]
  isActive: boolean
}

export const CUSTOMER_FIELDS = [
  { key: 'firstName', label: 'Nombre', required: true },
  { key: 'lastName', label: 'Apellido', required: true },
  { key: 'email', label: 'Correo Electrónico', required: false },
  { key: 'phone', label: 'Teléfono', required: false },
  { key: 'mobile', label: 'Celular', required: false },
  { key: 'idType', label: 'Tipo de Identificación', required: false },
  { key: 'idNumber', label: 'Número de Identificación', required: false },
  { key: 'address', label: 'Dirección', required: false },
  { key: 'city', label: 'Ciudad', required: false },
  { key: 'state', label: 'Provincia', required: false },
  { key: 'country', label: 'País', required: false },
  { key: 'postalCode', label: 'Código Postal', required: false },
  { key: 'companyName', label: 'Nombre de Empresa', required: false },
  { key: 'companyId', label: 'Cédula Jurídica', required: false },
  { key: 'position', label: 'Puesto', required: false },
  { key: 'notes', label: 'Notas', required: false },
  { key: 'category', label: 'Categoría', required: false },
] as const

export const ID_TYPES = [
  'Cédula Nacional',
  'Cédula de Residencia',
  'Pasaporte',
  'DIMEX',
] as const

export const CUSTOMER_CATEGORIES = [
  'Cliente Regular',
  'Cliente VIP',
  'Proveedor',
  'Socio',
  'Prospecto',
] as const

export const CUSTOMER_STATUS = [
  'active',
  'inactive',
  'pending',
] as const
