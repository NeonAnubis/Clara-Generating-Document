'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { DocumentTemplate } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TemplateForm } from './template-form'
import { Plus, MoreHorizontal, Pencil, Trash2, FileText } from 'lucide-react'

interface TemplateListProps {
  onSelectTemplate?: (template: DocumentTemplate) => void
  selectable?: boolean
}

export function TemplateList({ onSelectTemplate, selectable }: TemplateListProps) {
  const t = useTranslations('templates')
  const tCommon = useTranslations('common')

  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null)

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      if (!response.ok) {
        throw new Error('Failed to fetch templates')
      }
      const data = await response.json()
      setTemplates(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching templates:', error)
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return

    try {
      await fetch(`/api/templates/${id}`, { method: 'DELETE' })
      fetchTemplates()
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const handleEdit = (template: DocumentTemplate) => {
    setEditingTemplate(template)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingTemplate(null)
  }

  if (loading) {
    return <div className="text-center py-8">{t('loadingTemplates')}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('newTemplate')}
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>{t('noTemplates')}</p>
          <p className="text-sm">{t('createToStart')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={selectable ? 'cursor-pointer hover:border-primary transition-colors' : ''}
              onClick={() => selectable && onSelectTemplate?.(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.description && (
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    )}
                  </div>
                  {!selectable && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(template)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          {tCommon('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(template.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {tCommon('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.category && (
                    <Badge variant="secondary">{template.category}</Badge>
                  )}
                  <Badge variant={template.isActive ? 'default' : 'outline'}>
                    {template.isActive ? t('active') : t('inactive')}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {template.content.substring(0, 100)}...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TemplateForm
        template={editingTemplate}
        open={formOpen}
        onClose={handleFormClose}
        onSave={fetchTemplates}
      />
    </div>
  )
}
