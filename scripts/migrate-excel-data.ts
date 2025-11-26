import ExcelJS from 'exceljs';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function migrateExcelData() {
  try {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.join(__dirname, '../src/assets/1.xlsx');

    console.log('Reading Excel file...');
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];
    console.log(`Found ${worksheet.rowCount - 1} rows to import`);

    let importedCount = 0;
    let skippedCount = 0;

    // Start from row 2 (skip header)
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);

      // Skip empty rows
      if (!row.getCell(1).value) {
        skippedCount++;
        continue;
      }

      try {
        const customerData = {
          nombreDeLaSociedad: row.getCell(1).value?.toString() || null,
          tipoDeSociedad: row.getCell(2).value?.toString() || null,
          abreviatura: row.getCell(3).value?.toString() || null,
          cedulaJuridica: row.getCell(4).value?.toString() || null,
          capitalSocial: row.getCell(5).value?.toString() || null,
          cantidadCuotas: row.getCell(6).value?.toString() || null,
          valorDeCuotas: row.getCell(7).value?.toString() || null,
          serie: row.getCell(8).value?.toString() || null,
          domicilio: row.getCell(9).value?.toString() || null,
          plazoSocial: typeof row.getCell(10).value === 'number' ? row.getCell(10).value : null,
          fechaDeConstitucion: row.getCell(11).value?.toString() || null,
          cuotistaUno: row.getCell(12).value?.toString() || null,
          numeroDeCertificado: typeof row.getCell(13).value === 'number' ? row.getCell(13).value : null,
          identificacion: row.getCell(14).value?.toString() || null,
          propiedad: row.getCell(15).value?.toString() || null,
          numeroDeCuotas: typeof row.getCell(16).value === 'number' ? row.getCell(16).value : null,
          fecha: typeof row.getCell(17).value === 'number' ? row.getCell(17).value : null,
          mes: row.getCell(18).value?.toString() || null,
          ano: typeof row.getCell(19).value === 'number' ? row.getCell(19).value : null,
          imprimir: row.getCell(20).value?.toString() || null,
          excelId: typeof row.getCell(21).value === 'number' ? row.getCell(21).value : null,
          capitalNumero: row.getCell(22).value?.toString() || null,
          estadoCivil: row.getCell(23).value?.toString() || null,
          profesion: row.getCell(24).value?.toString() || null,
          domicilioCuotista1: row.getCell(25).value?.toString() || null,
          referencia: row.getCell(26).value?.toString() || null,
          enLetrasCuotas1: row.getCell(27).value?.toString() || null,
          numeroDeCertificado2: typeof row.getCell(28).value === 'number' ? row.getCell(28).value : null,
          referencia2: row.getCell(29).value?.toString() || null,
          domicilioCuotista2: row.getCell(30).value?.toString() || null,
          profesion2: row.getCell(31).value?.toString() || null,
          estadoCivil2: row.getCell(32).value?.toString() || null,
          cuotista2: row.getCell(33).value?.toString() || null,
          identificacion2: row.getCell(34).value?.toString() || null,
          propiedad2: row.getCell(35).value?.toString() || null,
          porcentaje2: row.getCell(36).value?.toString() || null,
          enNumerosCuotas2: row.getCell(37).value?.toString() || null,
          numeroDeCuotas2: typeof row.getCell(38).value === 'number' ? row.getCell(38).value : null,
          campo1: typeof row.getCell(39).value === 'number' ? row.getCell(39).value : null,
          cedulaLetras: row.getCell(40).value?.toString() || null,
          fechaInicioRenovacion: row.getCell(41).value?.toString() || null,
          activa: typeof row.getCell(42).value === 'number' ? row.getCell(42).value : null,
          archivado: typeof row.getCell(43).value === 'number' ? row.getCell(43).value : null,
          cooperador: row.getCell(44).value?.toString() || null,
          representanteLegal: row.getCell(45).value?.toString() || null,
          identificacionRepresentante: row.getCell(46).value?.toString() || null,
          tributacionActiva: typeof row.getCell(47).value === 'number' ? row.getCell(47).value : null,
          nombreGerente: row.getCell(48).value?.toString() || null,
          idGerente: row.getCell(49).value?.toString() || null,
          domicilioGerente: row.getCell(50).value?.toString() || null,
          ocupacionGerente: row.getCell(51).value?.toString() || null,
          estadoCivilGerente: row.getCell(52).value?.toString() || null,
          nacionalidadGerente: row.getCell(53).value?.toString() || null,
          denominacion: row.getCell(54).value?.toString() || null,
          apellidoGerente: row.getCell(55).value?.toString() || null,
          idEnNumeros: row.getCell(56).value?.toString() || null,
          disueltaRegistro: typeof row.getCell(57).value === 'number' ? row.getCell(57).value : null,
          legalizacionLibros: row.getCell(58).value?.toString() || null,
          porcentaje1: row.getCell(59).value?.toString() || null,
          correoElectronico: row.getCell(60).value?.toString() || null,
          nombreComercial: row.getCell(61).value?.toString() || null,
        };

        await prisma.customer.create({
          data: customerData,
        });

        importedCount++;
        if (importedCount % 50 === 0) {
          console.log(`Imported ${importedCount} records...`);
        }
      } catch (error) {
        console.error(`Error importing row ${rowNumber}:`, error);
        skippedCount++;
      }
    }

    console.log('\n=== Migration Complete ===');
    console.log(`Successfully imported: ${importedCount} records`);
    console.log(`Skipped: ${skippedCount} records`);
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateExcelData();
