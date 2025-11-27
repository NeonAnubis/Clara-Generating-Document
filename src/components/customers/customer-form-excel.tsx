'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Upload } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface CustomerFormExcelProps {
  onSave?: () => void
}

export function CustomerFormExcel({ onSave }: CustomerFormExcelProps) {
  const { toast } = useToast()
  const t = useTranslations('customerForm')
  const [loading, setLoading] = useState(false)

  // Company Information
  const [companyName, setCompanyName] = useState('')
  const [companyType, setCompanyType] = useState('')
  const [abbreviation, setAbbreviation] = useState('')
  const [legalId, setLegalId] = useState('')
  const [shareCapital, setShareCapital] = useState('')
  const [numberOfShares, setNumberOfShares] = useState('')
  const [shareValue, setShareValue] = useState('')
  const [series, setSeries] = useState('')
  const [registeredAddress, setRegisteredAddress] = useState('')
  const [companyTerm, setCompanyTerm] = useState('')
  const [incorporationDate, setIncorporationDate] = useState('')
  const [currency, setCurrency] = useState('')
  const [administration, setAdministration] = useState('')

  // Shareholder 1
  const [shareholderOne, setShareholderOne] = useState('')
  const [certificateNumber, setCertificateNumber] = useState('')
  const [identification, setIdentification] = useState('')
  const [ownership, setOwnership] = useState('')
  const [numberOfSharesHeld, setNumberOfSharesHeld] = useState('')
  const [date, setDate] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [print, setPrint] = useState('')
  const [excelId, setExcelId] = useState('')
  const [capitalNumber, setCapitalNumber] = useState('')
  const [maritalStatus, setMaritalStatus] = useState('')
  const [profession, setProfession] = useState('')
  const [shareholder1Address, setShareholder1Address] = useState('')
  const [reference, setReference] = useState('')
  const [sharesInWords1, setSharesInWords1] = useState('')
  const [percentage1, setPercentage1] = useState('')

  // Shareholder 2
  const [certificateNumber2, setCertificateNumber2] = useState('')
  const [reference2, setReference2] = useState('')
  const [shareholder2Address, setShareholder2Address] = useState('')
  const [profession2, setProfession2] = useState('')
  const [maritalStatus2, setMaritalStatus2] = useState('')
  const [shareholderTwo, setShareholderTwo] = useState('')
  const [identification2, setIdentification2] = useState('')
  const [ownership2, setOwnership2] = useState('')
  const [percentage2, setPercentage2] = useState('')
  const [sharesInNumbers2, setSharesInNumbers2] = useState('')
  const [numberOfSharesHeld2, setNumberOfSharesHeld2] = useState('')

  // Additional Fields
  const [field1, setField1] = useState('')
  const [legalIdInWords, setLegalIdInWords] = useState('')
  const [renewalStartDate, setRenewalStartDate] = useState('')
  const [active, setActive] = useState('')
  const [archived, setArchived] = useState('')
  const [cooperator, setCooperator] = useState('')
  const [legalRepresentative, setLegalRepresentative] = useState('')
  const [representativeId, setRepresentativeId] = useState('')
  const [activeTaxation, setActiveTaxation] = useState('')

  // Manager 1
  const [managerFirstName, setManagerFirstName] = useState('')
  const [managerId, setManagerId] = useState('')
  const [managerAddress, setManagerAddress] = useState('')
  const [managerOccupation, setManagerOccupation] = useState('')
  const [managerMaritalStatus, setManagerMaritalStatus] = useState('')
  const [managerNationality, setManagerNationality] = useState('')
  const [managerLastName, setManagerLastName] = useState('')

  // Manager 2
  const [manager2FirstName, setManager2FirstName] = useState('')
  const [manager2LastName, setManager2LastName] = useState('')
  const [manager2Id, setManager2Id] = useState('')
  const [manager2Address, setManager2Address] = useState('')
  const [manager2Occupation, setManager2Occupation] = useState('')
  const [manager2MaritalStatus, setManager2MaritalStatus] = useState('')
  const [manager2Nationality, setManager2Nationality] = useState('')

  // Sub-manager
  const [subManagerFirstName, setSubManagerFirstName] = useState('')
  const [subManagerLastName, setSubManagerLastName] = useState('')
  const [subManagerId, setSubManagerId] = useState('')
  const [subManagerAddress, setSubManagerAddress] = useState('')
  const [subManagerOccupation, setSubManagerOccupation] = useState('')
  const [subManagerMaritalStatus, setSubManagerMaritalStatus] = useState('')
  const [subManagerNationality, setSubManagerNationality] = useState('')

  // Other
  const [denomination, setDenomination] = useState('')
  const [idInNumbers, setIdInNumbers] = useState('')
  const [dissolvedRecord, setDissolvedRecord] = useState('')
  const [bookLegalization, setBookLegalization] = useState('')
  const [email, setEmail] = useState('')
  const [tradeName, setTradeName] = useState('')

  const handleImportMockData = () => {
    // Populate with mock data for testing
    setCompanyName('VISIONGLASS')
    setCompanyType('SOCIEDAD DE RESPONSABILIDAD LIMITADA')
    setAbbreviation('S.R.L')
    setLegalId('3-102-694610')
    setShareCapital('CIEN MIL')
    setNumberOfShares('MIL')
    setShareValue('CIEN')
    setSeries('AB')
    setRegisteredAddress('SAN JOSÉ')
    setCompanyTerm('450')
    setIncorporationDate('31 de marzo del 2015')
    setCurrency('Colones')
    setAdministration('Gerente')
    setShareholderOne('CHRISTIAN FERNANDO BAEZA HASBÚN')
    setCertificateNumber('1')
    setIdentification('pasaporte venezolano número 042269762')
    setOwnership('propietario')
    setNumberOfSharesHeld('500')
    setDate('1')
    setMonth('abril')
    setYear('2015')
    setPrint('*')
    setExcelId('22')
    setCapitalNumber('100 000')
    setMaritalStatus('casado')
    setProfession('ingeniero civil')
    setShareholder1Address('Venezuela, Anzoátegui, Lechería, av. Camejo Octavio, Urb. Las Villas')
    setReference('EL COMPRADOR')
    setSharesInWords1('QUINIENTAS')
    setPercentage1('50')
    setCertificateNumber2('2')
    setReference2('LA COMPRADORA')
    setShareholder2Address('Venezuela, Anzoátegui, Lechería, av. Camejo Octavio, Urb. Las Villas')
    setProfession2('licenciada en Contaduría')
    setMaritalStatus2('casada')
    setShareholderTwo('YENNY MAR CRUZ DE PAZ')
    setIdentification2('pasaporte venezolano número 108254545')
    setOwnership2('propietaria')
    setPercentage2('50')
    setSharesInNumbers2('QUINIENTAS')
    setNumberOfSharesHeld2('500')
    setField1('22')
    setLegalIdInWords('tres-uno cero dos-seis nueve cuatro seis uno cero')
    setRenewalStartDate('04/30/15 00:00:00')
    setActive('1')
    setArchived('0')
    setCooperator('STERLING LEGAL SERVICES LTD')
    setLegalRepresentative('Juan Pérez')
    setRepresentativeId('1-0234-0567')
    setActiveTaxation('0')

    // Manager 1 data
    setManagerFirstName('Carlos')
    setManagerLastName('Rodríguez')
    setManagerId('1-0987-0654')
    setManagerMaritalStatus('casado')
    setManagerOccupation('administrador')
    setManagerNationality('costarricense')
    setManagerAddress('San José, Escazú, Calle Principal')

    // Manager 2 data
    setManager2FirstName('María')
    setManager2LastName('González')
    setManager2Id('1-1234-5678')
    setManager2MaritalStatus('soltera')
    setManager2Occupation('contadora')
    setManager2Nationality('costarricense')
    setManager2Address('San José, Santa Ana, Calle Segunda')

    // Sub-manager data
    setSubManagerFirstName('José')
    setSubManagerLastName('Hernández')
    setSubManagerId('1-5678-9012')
    setSubManagerMaritalStatus('casado')
    setSubManagerOccupation('abogado')
    setSubManagerNationality('costarricense')
    setSubManagerAddress('San José, Moravia, Avenida Central')

    // Other fields
    setDenomination('VISIONGLASS SOCIEDAD DE RESPONSABILIDAD LIMITADA')
    setIdInNumbers('3102694610')
    setDissolvedRecord('0')
    setBookLegalization('Libro 1, Folio 234')
    setEmail('info@visionglass.com')
    setTradeName('VisionGlass CR')

    toast({
      title: 'Success',
      description: 'Mock data imported successfully',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          companyType,
          abbreviation,
          legalId,
          shareCapital,
          numberOfShares,
          shareValue,
          series,
          registeredAddress,
          companyTerm: companyTerm ? parseInt(companyTerm) : null,
          incorporationDate,
          currency,
          administration,
          shareholderOne,
          certificateNumber: certificateNumber ? parseInt(certificateNumber) : null,
          identification,
          ownership,
          numberOfSharesHeld: numberOfSharesHeld ? parseInt(numberOfSharesHeld) : null,
          date: date ? parseInt(date) : null,
          month,
          year: year ? parseInt(year) : null,
          print,
          excelId: excelId ? parseInt(excelId) : null,
          capitalNumber,
          maritalStatus,
          profession,
          shareholder1Address,
          reference,
          sharesInWords1,
          percentage1,
          certificateNumber2: certificateNumber2 ? parseInt(certificateNumber2) : null,
          reference2,
          shareholder2Address,
          profession2,
          maritalStatus2,
          shareholderTwo,
          identification2,
          ownership2,
          percentage2,
          sharesInNumbers2,
          numberOfSharesHeld2: numberOfSharesHeld2 ? parseInt(numberOfSharesHeld2) : null,
          field1: field1 ? parseInt(field1) : null,
          legalIdInWords,
          renewalStartDate,
          active: active ? parseInt(active) : null,
          archived: archived ? parseInt(archived) : null,
          cooperator,
          legalRepresentative,
          representativeId,
          activeTaxation: activeTaxation ? parseInt(activeTaxation) : null,
          managerFirstName,
          managerId,
          managerAddress,
          managerOccupation,
          managerMaritalStatus,
          managerNationality,
          managerLastName,
          // Manager 2
          manager2FirstName,
          manager2LastName,
          manager2Id,
          manager2Address,
          manager2Occupation,
          manager2MaritalStatus,
          manager2Nationality,
          // Sub-manager
          subManagerFirstName,
          subManagerLastName,
          subManagerId,
          subManagerAddress,
          subManagerOccupation,
          subManagerMaritalStatus,
          subManagerNationality,
          denomination,
          idInNumbers,
          dissolvedRecord: dissolvedRecord ? parseInt(dissolvedRecord) : null,
          bookLegalization,
          email,
          tradeName,
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
      {/* Import Data Button */}
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={handleImportMockData}>
          <Upload className="mr-2 h-4 w-4" />
          {t('importData')}
        </Button>
      </div>

      {/* Company Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('companyInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">{t('companyName')} *</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyType">{t('companyType')}</Label>
            <Input
              id="companyType"
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="abbreviation">{t('abbreviation')}</Label>
            <Input
              id="abbreviation"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legalId">{t('legalId')}</Label>
            <Input
              id="legalId"
              value={legalId}
              onChange={(e) => setLegalId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shareCapital">{t('shareCapital')}</Label>
            <Input
              id="shareCapital"
              value={shareCapital}
              onChange={(e) => setShareCapital(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numberOfShares">{t('numberOfShares')}</Label>
            <Input
              id="numberOfShares"
              value={numberOfShares}
              onChange={(e) => setNumberOfShares(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shareValue">{t('shareValue')}</Label>
            <Input
              id="shareValue"
              value={shareValue}
              onChange={(e) => setShareValue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="series">{t('series')}</Label>
            <Input
              id="series"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registeredAddress">{t('registeredAddress')}</Label>
            <Input
              id="registeredAddress"
              value={registeredAddress}
              onChange={(e) => setRegisteredAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyTerm">{t('companyTerm')}</Label>
            <Input
              id="companyTerm"
              type="number"
              value={companyTerm}
              onChange={(e) => setCompanyTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="incorporationDate">{t('incorporationDate')}</Label>
            <Input
              id="incorporationDate"
              value={incorporationDate}
              onChange={(e) => setIncorporationDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">{t('currency')}</Label>
            <Input
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="administration">{t('administration')}</Label>
            <Input
              id="administration"
              value={administration}
              onChange={(e) => setAdministration(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Shareholder 1 Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">{t('shareholder1')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shareholderOne">{t('shareholderOne')}</Label>
            <Input
              id="shareholderOne"
              value={shareholderOne}
              onChange={(e) => setShareholderOne(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="identification">{t('identification')}</Label>
            <Input
              id="identification"
              value={identification}
              onChange={(e) => setIdentification(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="certificateNumber">{t('certificateNumber')}</Label>
            <Input
              id="certificateNumber"
              type="number"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownership">{t('ownership')}</Label>
            <Input
              id="ownership"
              value={ownership}
              onChange={(e) => setOwnership(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numberOfSharesHeld">{t('numberOfSharesHeld')}</Label>
            <Input
              id="numberOfSharesHeld"
              type="number"
              value={numberOfSharesHeld}
              onChange={(e) => setNumberOfSharesHeld(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="percentage1">{t('percentage1')}</Label>
            <Input
              id="percentage1"
              value={percentage1}
              onChange={(e) => setPercentage1(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">{t('maritalStatus')}</Label>
            <Input
              id="maritalStatus"
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profession">{t('profession')}</Label>
            <Input
              id="profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="shareholder1Address">{t('shareholder1Address')}</Label>
            <Input
              id="shareholder1Address"
              value={shareholder1Address}
              onChange={(e) => setShareholder1Address(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reference">{t('reference')}</Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sharesInWords1">{t('sharesInWords1')}</Label>
            <Input
              id="sharesInWords1"
              value={sharesInWords1}
              onChange={(e) => setSharesInWords1(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">{t('date')}</Label>
            <Input
              id="date"
              type="number"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="month">{t('month')}</Label>
            <Input
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">{t('year')}</Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="print">{t('print')}</Label>
            <Input
              id="print"
              value={print}
              onChange={(e) => setPrint(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excelId">{t('excelId')}</Label>
            <Input
              id="excelId"
              type="number"
              value={excelId}
              onChange={(e) => setExcelId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capitalNumber">{t('capitalNumber')}</Label>
            <Input
              id="capitalNumber"
              value={capitalNumber}
              onChange={(e) => setCapitalNumber(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Shareholder 2 Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">{t('shareholder2')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shareholderTwo">{t('shareholderTwo')}</Label>
            <Input
              id="shareholderTwo"
              value={shareholderTwo}
              onChange={(e) => setShareholderTwo(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="identification2">{t('identification2')}</Label>
            <Input
              id="identification2"
              value={identification2}
              onChange={(e) => setIdentification2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="certificateNumber2">{t('certificateNumber2')}</Label>
            <Input
              id="certificateNumber2"
              type="number"
              value={certificateNumber2}
              onChange={(e) => setCertificateNumber2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownership2">{t('ownership2')}</Label>
            <Input
              id="ownership2"
              value={ownership2}
              onChange={(e) => setOwnership2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numberOfSharesHeld2">{t('numberOfSharesHeld2')}</Label>
            <Input
              id="numberOfSharesHeld2"
              type="number"
              value={numberOfSharesHeld2}
              onChange={(e) => setNumberOfSharesHeld2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="percentage2">{t('percentage2')}</Label>
            <Input
              id="percentage2"
              value={percentage2}
              onChange={(e) => setPercentage2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maritalStatus2">{t('maritalStatus2')}</Label>
            <Input
              id="maritalStatus2"
              value={maritalStatus2}
              onChange={(e) => setMaritalStatus2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profession2">{t('profession2')}</Label>
            <Input
              id="profession2"
              value={profession2}
              onChange={(e) => setProfession2(e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="shareholder2Address">{t('shareholder2Address')}</Label>
            <Input
              id="shareholder2Address"
              value={shareholder2Address}
              onChange={(e) => setShareholder2Address(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reference2">{t('reference2')}</Label>
            <Input
              id="reference2"
              value={reference2}
              onChange={(e) => setReference2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sharesInNumbers2">{t('sharesInNumbers2')}</Label>
            <Input
              id="sharesInNumbers2"
              value={sharesInNumbers2}
              onChange={(e) => setSharesInNumbers2(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Manager 1 Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">{t('manager1')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="managerFirstName">{t('managerFirstName')}</Label>
            <Input
              id="managerFirstName"
              value={managerFirstName}
              onChange={(e) => setManagerFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="managerLastName">{t('managerLastName')}</Label>
            <Input
              id="managerLastName"
              value={managerLastName}
              onChange={(e) => setManagerLastName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="managerId">{t('managerId')}</Label>
            <Input
              id="managerId"
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="managerMaritalStatus">{t('managerMaritalStatus')}</Label>
            <Input
              id="managerMaritalStatus"
              value={managerMaritalStatus}
              onChange={(e) => setManagerMaritalStatus(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="managerOccupation">{t('managerOccupation')}</Label>
            <Input
              id="managerOccupation"
              value={managerOccupation}
              onChange={(e) => setManagerOccupation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="managerNationality">{t('managerNationality')}</Label>
            <Input
              id="managerNationality"
              value={managerNationality}
              onChange={(e) => setManagerNationality(e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="managerAddress">{t('managerAddress')}</Label>
            <Input
              id="managerAddress"
              value={managerAddress}
              onChange={(e) => setManagerAddress(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Manager 2 Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">{t('manager2')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="manager2FirstName">{t('manager2FirstName')}</Label>
            <Input
              id="manager2FirstName"
              value={manager2FirstName}
              onChange={(e) => setManager2FirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manager2LastName">{t('manager2LastName')}</Label>
            <Input
              id="manager2LastName"
              value={manager2LastName}
              onChange={(e) => setManager2LastName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manager2Id">{t('manager2Id')}</Label>
            <Input
              id="manager2Id"
              value={manager2Id}
              onChange={(e) => setManager2Id(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manager2MaritalStatus">{t('manager2MaritalStatus')}</Label>
            <Input
              id="manager2MaritalStatus"
              value={manager2MaritalStatus}
              onChange={(e) => setManager2MaritalStatus(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manager2Occupation">{t('manager2Occupation')}</Label>
            <Input
              id="manager2Occupation"
              value={manager2Occupation}
              onChange={(e) => setManager2Occupation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manager2Nationality">{t('manager2Nationality')}</Label>
            <Input
              id="manager2Nationality"
              value={manager2Nationality}
              onChange={(e) => setManager2Nationality(e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="manager2Address">{t('manager2Address')}</Label>
            <Input
              id="manager2Address"
              value={manager2Address}
              onChange={(e) => setManager2Address(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sub-manager Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">{t('subManager')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subManagerFirstName">{t('subManagerFirstName')}</Label>
            <Input
              id="subManagerFirstName"
              value={subManagerFirstName}
              onChange={(e) => setSubManagerFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subManagerLastName">{t('subManagerLastName')}</Label>
            <Input
              id="subManagerLastName"
              value={subManagerLastName}
              onChange={(e) => setSubManagerLastName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subManagerId">{t('subManagerId')}</Label>
            <Input
              id="subManagerId"
              value={subManagerId}
              onChange={(e) => setSubManagerId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subManagerMaritalStatus">{t('subManagerMaritalStatus')}</Label>
            <Input
              id="subManagerMaritalStatus"
              value={subManagerMaritalStatus}
              onChange={(e) => setSubManagerMaritalStatus(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subManagerOccupation">{t('subManagerOccupation')}</Label>
            <Input
              id="subManagerOccupation"
              value={subManagerOccupation}
              onChange={(e) => setSubManagerOccupation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subManagerNationality">{t('subManagerNationality')}</Label>
            <Input
              id="subManagerNationality"
              value={subManagerNationality}
              onChange={(e) => setSubManagerNationality(e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="subManagerAddress">{t('subManagerAddress')}</Label>
            <Input
              id="subManagerAddress"
              value={subManagerAddress}
              onChange={(e) => setSubManagerAddress(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">{t('additionalInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="field1">{t('field1')}</Label>
            <Input
              id="field1"
              type="number"
              value={field1}
              onChange={(e) => setField1(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legalIdInWords">{t('legalIdInWords')}</Label>
            <Input
              id="legalIdInWords"
              value={legalIdInWords}
              onChange={(e) => setLegalIdInWords(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="renewalStartDate">{t('renewalStartDate')}</Label>
            <Input
              id="renewalStartDate"
              value={renewalStartDate}
              onChange={(e) => setRenewalStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="active">{t('active')}</Label>
            <Input
              id="active"
              type="number"
              value={active}
              onChange={(e) => setActive(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="archived">{t('archived')}</Label>
            <Input
              id="archived"
              type="number"
              value={archived}
              onChange={(e) => setArchived(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cooperator">{t('cooperator')}</Label>
            <Input
              id="cooperator"
              value={cooperator}
              onChange={(e) => setCooperator(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legalRepresentative">{t('legalRepresentative')}</Label>
            <Input
              id="legalRepresentative"
              value={legalRepresentative}
              onChange={(e) => setLegalRepresentative(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="representativeId">{t('representativeId')}</Label>
            <Input
              id="representativeId"
              value={representativeId}
              onChange={(e) => setRepresentativeId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activeTaxation">{t('activeTaxation')}</Label>
            <Input
              id="activeTaxation"
              type="number"
              value={activeTaxation}
              onChange={(e) => setActiveTaxation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dissolvedRecord">{t('dissolvedRecord')}</Label>
            <Input
              id="dissolvedRecord"
              type="number"
              value={dissolvedRecord}
              onChange={(e) => setDissolvedRecord(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookLegalization">{t('bookLegalization')}</Label>
            <Input
              id="bookLegalization"
              value={bookLegalization}
              onChange={(e) => setBookLegalization(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idInNumbers">{t('idInNumbers')}</Label>
            <Input
              id="idInNumbers"
              value={idInNumbers}
              onChange={(e) => setIdInNumbers(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tradeName">{t('tradeName')}</Label>
            <Input
              id="tradeName"
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="denomination">{t('denomination')}</Label>
            <Input
              id="denomination"
              value={denomination}
              onChange={(e) => setDenomination(e.target.value)}
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
              {t('notes')}...
            </>
          ) : (
            t('registerCustomer')
          )}
        </Button>
      </div>
    </form>
  )
}
