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
    const columnsToIgnore = [8, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92, 98]; // Adjust this array as needed

    for (let col = 2; col <= 98; col++) { // Loop through columns 2 to 74
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
      INSERT INTO college_grades (
        name, 
        ORT1_criteria1_score, ORT1_criteria2_score, ORT1_criteria3_score, ORT1_criteria4_score, ORT1_criteria5_score,
        ORT2_criteria1_score, ORT2_criteria2_score, ORT2_criteria3_score, ORT2_criteria4_score, ORT2_criteria5_score,
        ORT3_criteria1_score, ORT3_criteria2_score, ORT3_criteria3_score, ORT3_criteria4_score, ORT3_criteria5_score,
        ORT4_criteria1_score, ORT4_criteria2_score, ORT4_criteria3_score, ORT4_criteria4_score, ORT4_criteria5_score,
        ORT5_criteria1_score, ORT5_criteria2_score, ORT5_criteria3_score, ORT5_criteria4_score, ORT5_criteria5_score,
        ORT6_criteria1_score, ORT6_criteria2_score, ORT6_criteria3_score, ORT6_criteria4_score, ORT6_criteria5_score,
        ORT7_criteria1_score, ORT7_criteria2_score, ORT7_criteria3_score, ORT7_criteria4_score, ORT7_criteria5_score,
        ORT8_criteria1_score, ORT8_criteria2_score, ORT8_criteria3_score, ORT8_criteria4_score, ORT8_criteria5_score,
        WA1_criteria1_score, WA1_criteria2_score, WA1_criteria3_score, WA1_criteria4_score, WA1_criteria5_score,
        WA2_criteria1_score, WA2_criteria2_score, WA2_criteria3_score, WA2_criteria4_score, WA2_criteria5_score,
        WA3_criteria1_score, WA3_criteria2_score, WA3_criteria3_score, WA3_criteria4_score, WA3_criteria5_score,
        WA4_criteria1_score, WA4_criteria2_score, WA4_criteria3_score, WA4_criteria4_score, WA4_criteria5_score,
        WA5_criteria1_score, WA5_criteria2_score, WA5_criteria3_score, WA5_criteria4_score, WA5_criteria5_score,
        WA6_criteria1_score, WA6_criteria2_score, WA6_criteria3_score, WA6_criteria4_score, WA6_criteria5_score,
        long_test_criteria1_score, long_test_criteria2_score, long_test_criteria3_score, long_test_criteria4_score, long_test_criteria5_score,
        midterm_criteria1_score, midterm_criteria2_score, midterm_criteria3_score, midterm_criteria4_score, midterm_criteria5_score
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
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
