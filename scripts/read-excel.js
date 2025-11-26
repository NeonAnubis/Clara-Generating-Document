const ExcelJS = require('exceljs');
const path = require('path');

async function readExcel() {
  const workbook = new ExcelJS.Workbook();
  const filePath = path.join(__dirname, '../src/assets/1.xlsx');

  await workbook.xlsx.readFile(filePath);

  // Get the first worksheet
  const worksheet = workbook.worksheets[0];

  console.log('Worksheet name:', worksheet.name);
  console.log('Total rows:', worksheet.rowCount);
  console.log('\nColumn Headers:');

  // Get headers from first row
  const headers = [];
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell, colNumber) => {
    headers.push({
      column: colNumber,
      name: cell.value
    });
  });

  console.log(JSON.stringify(headers, null, 2));

  // Show first few rows as sample data
  console.log('\nSample data (first 3 rows):');
  for (let i = 2; i <= Math.min(4, worksheet.rowCount); i++) {
    const row = worksheet.getRow(i);
    const rowData = {};
    row.eachCell((cell, colNumber) => {
      rowData[headers[colNumber - 1]?.name] = cell.value;
    });
    console.log(JSON.stringify(rowData, null, 2));
  }
}

readExcel().catch(console.error);
