import { CustomerList } from '@/components/customers/customer-list'

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clientes</h1>
        <p className="text-muted-foreground">
          Gestione la información de sus clientes
        </p>
      </div>

      <CustomerList />
    </div>
  )
}
