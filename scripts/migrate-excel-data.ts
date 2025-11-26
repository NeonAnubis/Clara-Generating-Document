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
          companyName: row.getCell(1).value?.toString() || null,
          companyType: row.getCell(2).value?.toString() || null,
          abbreviation: row.getCell(3).value?.toString() || null,
          legalId: row.getCell(4).value?.toString() || null,
          shareCapital: row.getCell(5).value?.toString() || null,
          numberOfShares: row.getCell(6).value?.toString() || null,
          shareValue: row.getCell(7).value?.toString() || null,
          series: row.getCell(8).value?.toString() || null,
          registeredAddress: row.getCell(9).value?.toString() || null,
          companyTerm: typeof row.getCell(10).value === 'number' ? row.getCell(10).value : null,
          incorporationDate: row.getCell(11).value?.toString() || null,
          shareholderOne: row.getCell(12).value?.toString() || null,
          certificateNumber: typeof row.getCell(13).value === 'number' ? row.getCell(13).value : null,
          identification: row.getCell(14).value?.toString() || null,
          ownership: row.getCell(15).value?.toString() || null,
          numberOfSharesHeld: typeof row.getCell(16).value === 'number' ? row.getCell(16).value : null,
          date: typeof row.getCell(17).value === 'number' ? row.getCell(17).value : null,
          month: row.getCell(18).value?.toString() || null,
          year: typeof row.getCell(19).value === 'number' ? row.getCell(19).value : null,
          print: row.getCell(20).value?.toString() || null,
          excelId: typeof row.getCell(21).value === 'number' ? row.getCell(21).value : null,
          capitalNumber: row.getCell(22).value?.toString() || null,
          maritalStatus: row.getCell(23).value?.toString() || null,
          profession: row.getCell(24).value?.toString() || null,
          shareholder1Address: row.getCell(25).value?.toString() || null,
          reference: row.getCell(26).value?.toString() || null,
          sharesInWords1: row.getCell(27).value?.toString() || null,
          certificateNumber2: typeof row.getCell(28).value === 'number' ? row.getCell(28).value : null,
          reference2: row.getCell(29).value?.toString() || null,
          shareholder2Address: row.getCell(30).value?.toString() || null,
          profession2: row.getCell(31).value?.toString() || null,
          maritalStatus2: row.getCell(32).value?.toString() || null,
          shareholderTwo: row.getCell(33).value?.toString() || null,
          identification2: row.getCell(34).value?.toString() || null,
          ownership2: row.getCell(35).value?.toString() || null,
          percentage2: row.getCell(36).value?.toString() || null,
          sharesInNumbers2: row.getCell(37).value?.toString() || null,
          numberOfSharesHeld2: typeof row.getCell(38).value === 'number' ? row.getCell(38).value : null,
          field1: typeof row.getCell(39).value === 'number' ? row.getCell(39).value : null,
          legalIdInWords: row.getCell(40).value?.toString() || null,
          renewalStartDate: row.getCell(41).value?.toString() || null,
          active: typeof row.getCell(42).value === 'number' ? row.getCell(42).value : null,
          archived: typeof row.getCell(43).value === 'number' ? row.getCell(43).value : null,
          cooperator: row.getCell(44).value?.toString() || null,
          legalRepresentative: row.getCell(45).value?.toString() || null,
          representativeId: row.getCell(46).value?.toString() || null,
          activeTaxation: typeof row.getCell(47).value === 'number' ? row.getCell(47).value : null,
          managerFirstName: row.getCell(48).value?.toString() || null,
          managerId: row.getCell(49).value?.toString() || null,
          managerAddress: row.getCell(50).value?.toString() || null,
          managerOccupation: row.getCell(51).value?.toString() || null,
          managerMaritalStatus: row.getCell(52).value?.toString() || null,
          managerNationality: row.getCell(53).value?.toString() || null,
          denomination: row.getCell(54).value?.toString() || null,
          managerLastName: row.getCell(55).value?.toString() || null,
          idInNumbers: row.getCell(56).value?.toString() || null,
          dissolvedRecord: typeof row.getCell(57).value === 'number' ? row.getCell(57).value : null,
          bookLegalization: row.getCell(58).value?.toString() || null,
          percentage1: row.getCell(59).value?.toString() || null,
          email: row.getCell(60).value?.toString() || null,
          tradeName: row.getCell(61).value?.toString() || null,
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
