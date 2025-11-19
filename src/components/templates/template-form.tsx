'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DocumentTemplate } from '@/lib/types'
import { CUSTOMER_FIELDS } from '@/lib/types'

interface TemplateFormProps {
  template?: DocumentTemplate | null
  open: boolean
  onClose: () => void
  onSave: () => void
}

export function TemplateForm({ template, open, onClose, onSave }: TemplateFormProps) {
  const [loading, setLoading] = useState(false)
  const existingMappings = template?.fieldMappings
    ? JSON.parse(template.fieldMappings)
    : []

  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    content: template?.content || '',
    category: template?.category || '',
    fieldMappings: existingMappings as string[],
    isActive: template?.isActive ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = template
        ? `/api/templates/${template.id}`
        : '/api/templates'
      const method = template ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSave()
        onClose()
      }
    } catch (error) {
      console.error('Error saving template:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleField = (fieldKey: string) => {
    setFormData(prev => ({
      ...prev,
      fieldMappings: prev.fieldMappings.includes(fieldKey)
        ? prev.fieldMappings.filter(f => f !== fieldKey)
        : [...prev.fieldMappings, fieldKey]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Editar Plantilla' : 'Nueva Plantilla'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de Plantilla *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Contrato de Servicios"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ej: Contratos, Cartas, Facturas"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción breve de la plantilla"
            />
          </div>

          <div className="space-y-2">
            <Label>Campos a Utilizar</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Seleccione los campos del cliente que utilizará en esta plantilla
            </p>
            <div className="grid grid-cols-3 gap-2 p-4 border rounded-lg bg-muted/30">
              {CUSTOMER_FIELDS.map((field) => (
                <div key={field.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.key}
                    checked={formData.fieldMappings.includes(field.key)}
                    onCheckedChange={() => toggleField(field.key)}
                  />
                  <label
                    htmlFor={field.key}
                    className="text-sm cursor-pointer"
                  >
                    {field.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido de la Plantilla *</Label>
            <p className="text-sm text-muted-foreground">
              Use {'{{campo}}'} para insertar datos del cliente. Ejemplo: {'{{firstName}}'}, {'{{lastName}}'}, {'{{companyName}}'}
            </p>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={`# Contrato de Servicios

Fecha: {{date}}

Por medio del presente documento, {{firstName}} {{lastName}}, identificado con {{idType}} número {{idNumber}}, en representación de {{companyName}}, se compromete a...

Dirección: {{address}}, {{city}}, {{state}}, {{country}}

Firma: _____________________`}
              rows={12}
              className="font-mono text-sm"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked as boolean })
              }
            />
            <label htmlFor="isActive" className="text-sm">
              Plantilla activa
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
