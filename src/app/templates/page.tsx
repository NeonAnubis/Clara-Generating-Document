import { TemplateList } from '@/components/templates/template-list'

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Plantillas</h1>
        <p className="text-muted-foreground">
          Cree y administre plantillas para generar documentos automáticamente
        </p>
      </div>

      <TemplateList />
    </div>
  )
}
