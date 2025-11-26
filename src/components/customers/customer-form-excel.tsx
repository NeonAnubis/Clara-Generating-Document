'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface CustomerFormExcelProps {
  onSave?: () => void
}

export function CustomerFormExcel({ onSave }: CustomerFormExcelProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Company Information
  const [nombreDeLaSociedad, setNombreDeLaSociedad] = useState('')
  const [tipoDeSociedad, setTipoDeSociedad] = useState('')
  const [abreviatura, setAbreviatura] = useState('')
  const [cedulaJuridica, setCedulaJuridica] = useState('')
  const [capitalSocial, setCapitalSocial] = useState('')
  const [cantidadCuotas, setCantidadCuotas] = useState('')
  const [valorDeCuotas, setValorDeCuotas] = useState('')
  const [serie, setSerie] = useState('')
  const [domicilio, setDomicilio] = useState('')
  const [plazoSocial, setPlazoSocial] = useState('')
  const [fechaDeConstitucion, setFechaDeConstitucion] = useState('')

  // Cuotista 1
  const [cuotistaUno, setCuotistaUno] = useState('')
  const [numeroDeCertificado, setNumeroDeCertificado] = useState('')
  const [identificacion, setIdentificacion] = useState('')
  const [propiedad, setPropiedad] = useState('')
  const [numeroDeCuotas, setNumeroDeCuotas] = useState('')
  const [fecha, setFecha] = useState('')
  const [mes, setMes] = useState('')
  const [ano, setAno] = useState('')
  const [imprimir, setImprimir] = useState('')
  const [capitalNumero, setCapitalNumero] = useState('')
  const [estadoCivil, setEstadoCivil] = useState('')
  const [profesion, setProfesion] = useState('')
  const [domicilioCuotista1, setDomicilioCuotista1] = useState('')
  const [referencia, setReferencia] = useState('')
  const [enLetrasCuotas1, setEnLetrasCuotas1] = useState('')
  const [porcentaje1, setPorcentaje1] = useState('')

  // Cuotista 2
  const [numeroDeCertificado2, setNumeroDeCertificado2] = useState('')
  const [referencia2, setReferencia2] = useState('')
  const [domicilioCuotista2, setDomicilioCuotista2] = useState('')
  const [profesion2, setProfesion2] = useState('')
  const [estadoCivil2, setEstadoCivil2] = useState('')
  const [cuotista2, setCuotista2] = useState('')
  const [identificacion2, setIdentificacion2] = useState('')
  const [propiedad2, setPropiedad2] = useState('')
  const [porcentaje2, setPorcentaje2] = useState('')
  const [enNumerosCuotas2, setEnNumerosCuotas2] = useState('')
  const [numeroDeCuotas2, setNumeroDeCuotas2] = useState('')

  // Additional Fields
  const [campo1, setCampo1] = useState('')
  const [cedulaLetras, setCedulaLetras] = useState('')
  const [fechaInicioRenovacion, setFechaInicioRenovacion] = useState('')
  const [activa, setActiva] = useState('')
  const [archivado, setArchivado] = useState('')
  const [cooperador, setCooperador] = useState('')
  const [representanteLegal, setRepresentanteLegal] = useState('')
  const [identificacionRepresentante, setIdentificacionRepresentante] = useState('')
  const [tributacionActiva, setTributacionActiva] = useState('')

  // Gerente (Manager)
  const [nombreGerente, setNombreGerente] = useState('')
  const [idGerente, setIdGerente] = useState('')
  const [domicilioGerente, setDomicilioGerente] = useState('')
  const [ocupacionGerente, setOcupacionGerente] = useState('')
  const [estadoCivilGerente, setEstadoCivilGerente] = useState('')
  const [nacionalidadGerente, setNacionalidadGerente] = useState('')
  const [apellidoGerente, setApellidoGerente] = useState('')

  // Other
  const [denominacion, setDenominacion] = useState('')
  const [idEnNumeros, setIdEnNumeros] = useState('')
  const [disueltaRegistro, setDisueltaRegistro] = useState('')
  const [legalizacionLibros, setLegalizacionLibros] = useState('')
  const [correoElectronico, setCorreoElectronico] = useState('')
  const [nombreComercial, setNombreComercial] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreDeLaSociedad,
          tipoDeSociedad,
          abreviatura,
          cedulaJuridica,
          capitalSocial,
          cantidadCuotas,
          valorDeCuotas,
          serie,
          domicilio,
          plazoSocial: plazoSocial ? parseInt(plazoSocial) : null,
          fechaDeConstitucion,
          cuotistaUno,
          numeroDeCertificado: numeroDeCertificado ? parseInt(numeroDeCertificado) : null,
          identificacion,
          propiedad,
          numeroDeCuotas: numeroDeCuotas ? parseInt(numeroDeCuotas) : null,
          fecha: fecha ? parseInt(fecha) : null,
          mes,
          ano: ano ? parseInt(ano) : null,
          imprimir,
          capitalNumero,
          estadoCivil,
          profesion,
          domicilioCuotista1,
          referencia,
          enLetrasCuotas1,
          porcentaje1,
          numeroDeCertificado2: numeroDeCertificado2 ? parseInt(numeroDeCertificado2) : null,
          referencia2,
          domicilioCuotista2,
          profesion2,
          estadoCivil2,
          cuotista2,
          identificacion2,
          propiedad2,
          porcentaje2,
          enNumerosCuotas2,
          numeroDeCuotas2: numeroDeCuotas2 ? parseInt(numeroDeCuotas2) : null,
          campo1: campo1 ? parseInt(campo1) : null,
          cedulaLetras,
          fechaInicioRenovacion,
          activa: activa ? parseInt(activa) : null,
          archivado: archivado ? parseInt(archivado) : null,
          cooperador,
          representanteLegal,
          identificacionRepresentante,
          tributacionActiva: tributacionActiva ? parseInt(tributacionActiva) : null,
          nombreGerente,
          idGerente,
          domicilioGerente,
          ocupacionGerente,
          estadoCivilGerente,
          nacionalidadGerente,
          apellidoGerente,
          denominacion,
          idEnNumeros,
          disueltaRegistro: disueltaRegistro ? parseInt(disueltaRegistro) : null,
          legalizacionLibros,
          correoElectronico,
          nombreComercial,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save customer')
      }

      toast({
        title: 'Success',
        description: 'Customer registered successfully',
      })

      onSave?.()
    } catch (error) {
      console.error('Error saving customer:', error)
      toast({
        title: 'Error',
        description: 'Failed to save customer',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombreDeLaSociedad">NOMBRE DE LA SOCIEDAD *</Label>
            <Input
              id="nombreDeLaSociedad"
              value={nombreDeLaSociedad}
              onChange={(e) => setNombreDeLaSociedad(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipoDeSociedad">TIPO DE SOCIEDAD</Label>
            <Input
              id="tipoDeSociedad"
              value={tipoDeSociedad}
              onChange={(e) => setTipoDeSociedad(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="abreviatura">ABREVIATURA</Label>
            <Input
              id="abreviatura"
              value={abreviatura}
              onChange={(e) => setAbreviatura(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cedulaJuridica">CÉDULA JURÍDICA</Label>
            <Input
              id="cedulaJuridica"
              value={cedulaJuridica}
              onChange={(e) => setCedulaJuridica(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capitalSocial">CAPITAL SOCIAL</Label>
            <Input
              id="capitalSocial"
              value={capitalSocial}
              onChange={(e) => setCapitalSocial(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cantidadCuotas">CANTIDAD CUOTAS</Label>
            <Input
              id="cantidadCuotas"
              value={cantidadCuotas}
              onChange={(e) => setCantidadCuotas(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valorDeCuotas">VALOR DE CUOTAS</Label>
            <Input
              id="valorDeCuotas"
              value={valorDeCuotas}
              onChange={(e) => setValorDeCuotas(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serie">SERIE</Label>
            <Input
              id="serie"
              value={serie}
              onChange={(e) => setSerie(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domicilio">DOMICILIO</Label>
            <Input
              id="domicilio"
              value={domicilio}
              onChange={(e) => setDomicilio(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plazoSocial">PLAZO SOCIAL</Label>
            <Input
              id="plazoSocial"
              type="number"
              value={plazoSocial}
              onChange={(e) => setPlazoSocial(e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fechaDeConstitucion">FECHA DE CONSTITUCIÓN</Label>
            <Input
              id="fechaDeConstitucion"
              value={fechaDeConstitucion}
              onChange={(e) => setFechaDeConstitucion(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Cuotista 1 Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">Cuotista 1</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cuotistaUno">CUOTISTA UNO</Label>
            <Input
              id="cuotistaUno"
              value={cuotistaUno}
              onChange={(e) => setCuotistaUno(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="identificacion">IDENTIFICACIÓN</Label>
            <Input
              id="identificacion"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numeroDeCertificado">NUMERO DE CERTIFICADO</Label>
            <Input
              id="numeroDeCertificado"
              type="number"
              value={numeroDeCertificado}
              onChange={(e) => setNumeroDeCertificado(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="propiedad">PROPIEDAD</Label>
            <Input
              id="propiedad"
              value={propiedad}
              onChange={(e) => setPropiedad(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numeroDeCuotas">NUMERO DE CUOTAS</Label>
            <Input
              id="numeroDeCuotas"
              type="number"
              value={numeroDeCuotas}
              onChange={(e) => setNumeroDeCuotas(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="porcentaje1">PORCENTAJE</Label>
            <Input
              id="porcentaje1"
              value={porcentaje1}
              onChange={(e) => setPorcentaje1(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estadoCivil">ESTADO CIVIL</Label>
            <Input
              id="estadoCivil"
              value={estadoCivil}
              onChange={(e) => setEstadoCivil(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profesion">PROFESION</Label>
            <Input
              id="profesion"
              value={profesion}
              onChange={(e) => setProfesion(e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="domicilioCuotista1">DOMICILIO CUOTISTA1</Label>
            <Input
              id="domicilioCuotista1"
              value={domicilioCuotista1}
              onChange={(e) => setDomicilioCuotista1(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referencia">REFERENCIA</Label>
            <Input
              id="referencia"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="enLetrasCuotas1">EN LETRAS CUOTAS1</Label>
            <Input
              id="enLetrasCuotas1"
              value={enLetrasCuotas1}
              onChange={(e) => setEnLetrasCuotas1(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Cuotista 2 Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">Cuotista 2</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cuotista2">CUOTISTA 2</Label>
            <Input
              id="cuotista2"
              value={cuotista2}
              onChange={(e) => setCuotista2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="identificacion2">IDENTIFICACION2</Label>
            <Input
              id="identificacion2"
              value={identificacion2}
              onChange={(e) => setIdentificacion2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numeroDeCertificado2">NUMERO DE CERTIFICADO2</Label>
            <Input
              id="numeroDeCertificado2"
              type="number"
              value={numeroDeCertificado2}
              onChange={(e) => setNumeroDeCertificado2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="propiedad2">PROPIEDAD2</Label>
            <Input
              id="propiedad2"
              value={propiedad2}
              onChange={(e) => setPropiedad2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numeroDeCuotas2">NUMERO DE CUOTAS2</Label>
            <Input
              id="numeroDeCuotas2"
              type="number"
              value={numeroDeCuotas2}
              onChange={(e) => setNumeroDeCuotas2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="porcentaje2">PORCENTAJE2</Label>
            <Input
              id="porcentaje2"
              value={porcentaje2}
              onChange={(e) => setPorcentaje2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estadoCivil2">ESTADO CIVIL2</Label>
            <Input
              id="estadoCivil2"
              value={estadoCivil2}
              onChange={(e) => setEstadoCivil2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profesion2">PROFESION2</Label>
            <Input
              id="profesion2"
              value={profesion2}
              onChange={(e) => setProfesion2(e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="domicilioCuotista2">DOMICILIO CUOTISTA2</Label>
            <Input
              id="domicilioCuotista2"
              value={domicilioCuotista2}
              onChange={(e) => setDomicilioCuotista2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referencia2">REFERENCIA2</Label>
            <Input
              id="referencia2"
              value={referencia2}
              onChange={(e) => setReferencia2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="enNumerosCuotas2">EN NUMEROS CUOTAS2</Label>
            <Input
              id="enNumerosCuotas2"
              value={enNumerosCuotas2}
              onChange={(e) => setEnNumerosCuotas2(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Gerente Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">Gerente (Manager)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombreGerente">Nombre Gerente</Label>
            <Input
              id="nombreGerente"
              value={nombreGerente}
              onChange={(e) => setNombreGerente(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apellidoGerente">Apellido Gerente</Label>
            <Input
              id="apellidoGerente"
              value={apellidoGerente}
              onChange={(e) => setApellidoGerente(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idGerente">ID Gerente</Label>
            <Input
              id="idGerente"
              value={idGerente}
              onChange={(e) => setIdGerente(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estadoCivilGerente">Estado Civil Gerente</Label>
            <Input
              id="estadoCivilGerente"
              value={estadoCivilGerente}
              onChange={(e) => setEstadoCivilGerente(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ocupacionGerente">Ocupación Gerente</Label>
            <Input
              id="ocupacionGerente"
              value={ocupacionGerente}
              onChange={(e) => setOcupacionGerente(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nacionalidadGerente">Nacionalidad Gerente</Label>
            <Input
              id="nacionalidadGerente"
              value={nacionalidadGerente}
              onChange={(e) => setNacionalidadGerente(e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="domicilioGerente">Domicilio Gerente</Label>
            <Input
              id="domicilioGerente"
              value={domicilioGerente}
              onChange={(e) => setDomicilioGerente(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="campo1">Campo1</Label>
            <Input
              id="campo1"
              type="number"
              value={campo1}
              onChange={(e) => setCampo1(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cedulaLetras">CÉDULA LETRAS</Label>
            <Input
              id="cedulaLetras"
              value={cedulaLetras}
              onChange={(e) => setCedulaLetras(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fechaInicioRenovacion">Fecha Inicio Renovación</Label>
            <Input
              id="fechaInicioRenovacion"
              value={fechaInicioRenovacion}
              onChange={(e) => setFechaInicioRenovacion(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activa">Activa</Label>
            <Input
              id="activa"
              type="number"
              value={activa}
              onChange={(e) => setActiva(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="archivado">Archivado</Label>
            <Input
              id="archivado"
              type="number"
              value={archivado}
              onChange={(e) => setArchivado(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cooperador">COOPERADOR</Label>
            <Input
              id="cooperador"
              value={cooperador}
              onChange={(e) => setCooperador(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="representanteLegal">Representante Legal</Label>
            <Input
              id="representanteLegal"
              value={representanteLegal}
              onChange={(e) => setRepresentanteLegal(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="identificacionRepresentante">Identificación Representante</Label>
            <Input
              id="identificacionRepresentante"
              value={identificacionRepresentante}
              onChange={(e) => setIdentificacionRepresentante(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tributacionActiva">Tributación Activa</Label>
            <Input
              id="tributacionActiva"
              type="number"
              value={tributacionActiva}
              onChange={(e) => setTributacionActiva(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disueltaRegistro">Disuelta Registro</Label>
            <Input
              id="disueltaRegistro"
              type="number"
              value={disueltaRegistro}
              onChange={(e) => setDisueltaRegistro(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legalizacionLibros">Legalización Libros</Label>
            <Input
              id="legalizacionLibros"
              value={legalizacionLibros}
              onChange={(e) => setLegalizacionLibros(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idEnNumeros">ID en numeros</Label>
            <Input
              id="idEnNumeros"
              value={idEnNumeros}
              onChange={(e) => setIdEnNumeros(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="correoElectronico">Correo Electrónico</Label>
            <Input
              id="correoElectronico"
              type="email"
              value={correoElectronico}
              onChange={(e) => setCorreoElectronico(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nombreComercial">Nombre Comercial</Label>
            <Input
              id="nombreComercial"
              value={nombreComercial}
              onChange={(e) => setNombreComercial(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="denominacion">Denominación</Label>
            <Input
              id="denominacion"
              value={denominacion}
              onChange={(e) => setDenominacion(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end border-t pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Register Customer'
          )}
        </Button>
      </div>
    </form>
  )
}
