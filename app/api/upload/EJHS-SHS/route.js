import { read } from 'xlsx';
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Function to convert column number to Excel-style column letter
function getColumnLetter(col) {
  let letter = '';
  while (col > 0) {
    const remainder = (col - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    col = Math.floor((col - 1) / 26);
  }
  return letter;
}

export async function POST(req) {
  let connection;
  try {
    console.log('Received file upload request');

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      console.error('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.name.endsWith('.xlsx')) {
      console.error('Invalid file format');
      return NextResponse.json({ error: 'Only .xlsx files are allowed' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = read(Buffer.from(buffer)); // Ensure `read` is used properly
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    console.log('Extracting data from sheet:', sheetName);

    const rowData = [];
    const columnsToIgnore = [8, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74]; // Corresponding to H, N, T, Z, AF, AL, AR, AX, BD, BJ, BP, BV

    for (let col = 2; col <= 74; col++) { // Loop through columns 2 to 74
      if (!columnsToIgnore.includes(col)) { // Check if the column should be ignored
        const colLetter = getColumnLetter(col); // Use the correct column letter calculation
        const cellAddress = `${colLetter}17`;
        const cellValue = sheet[cellAddress]?.v || null; // Set to null if the cell is empty
        console.log(`Cell ${cellAddress}:`, cellValue); // Log the cell address and value
        rowData.push(cellValue);
      }
    }

    const extractedName = rowData.shift(); // Extract name from rowData

    // Transform rowData: replace empty with NULL, keep 0 as-is
    const transformedData = rowData.map(value => (value === null ? null : value));

    const queryData = [extractedName, ...transformedData]; // Ensure only necessary values are included

    console.log('Query Data:', queryData); // Log the contents of queryData
    console.log('Query Data Length:', queryData.length); // Log the length of queryData

    console.log('Connecting to database');

    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'test',
    });

    const query = `
      INSERT INTO EJHS_SHS_grades (
        name, 
        WW1_criteria1, WW1_criteria2, WW1_criteria3, WW1_criteria4, WW1_criteria5,
        WW2_criteria1, WW2_criteria2, WW2_criteria3, WW2_criteria4, WW2_criteria5,
        WW3_criteria1, WW3_criteria2, WW3_criteria3, WW3_criteria4, WW3_criteria5,
        WW4_criteria1, WW4_criteria2, WW4_criteria3, WW4_criteria4, WW4_criteria5,
        WW5_criteria1, WW5_criteria2, WW5_criteria3, WW5_criteria4, WW5_criteria5,
        WW6_criteria1, WW6_criteria2, WW6_criteria3, WW6_criteria4, WW6_criteria5,
        WW7_criteria1, WW7_criteria2, WW7_criteria3, WW7_criteria4, WW7_criteria5,
        PT1_criteria1, PT1_criteria2, PT1_criteria3, PT1_criteria4, PT1_criteria5,
        PT2_criteria1, PT2_criteria2, PT2_criteria3, PT2_criteria4, PT2_criteria5,
        PT3_criteria1, PT3_criteria2, PT3_criteria3, PT3_criteria4, PT3_criteria5,
        QA1_criteria1, QA1_criteria2, QA1_criteria3, QA1_criteria4, QA1_criteria5,
        QA2_criteria1, QA2_criteria2, QA2_criteria3, QA2_criteria4, QA2_criteria5
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `;

    console.log('Executing database query');
    await connection.execute(query, queryData);

    console.log('Data inserted successfully');
    return NextResponse.json({ message: 'Data inserted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json({ error: 'Failed to upload file: ' + error.message }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
