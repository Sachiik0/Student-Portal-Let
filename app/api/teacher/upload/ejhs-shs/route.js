import { read } from 'xlsx';
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

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
    const subjectId = formData.get('subject_id');

    if (!file) {
      console.error('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.name.endsWith('.xlsx')) {
      console.error('Invalid file format:', file.name);
      return NextResponse.json({ error: 'Only .xlsx files are allowed' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = read(Buffer.from(buffer));
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    console.log('Extracting data from sheet:', sheetName);

    const rowData = [];
    const columnsToIgnore = [3, 9, 15, 21, 27, 33, 39, 45, 51, 57, 63, 69, 75]; // Columns to ignore

    for (let col = 2; col <= 74; col++) {
      if (!columnsToIgnore.includes(col)) {
        const colLetter = getColumnLetter(col);
        const cellAddress = `${colLetter}17`;
        const cellValue = sheet[cellAddress]?.v || null;
        console.log(`Cell ${cellAddress}:`, cellValue);
        rowData.push(cellValue);
      }
    }

    const extractedName = rowData.shift(); // The first value will be treated as the 'idnumber'
    const transformedData = rowData.map(value => (value === null ? null : value));

    const queryData = [subjectId, extractedName, ...transformedData];

    // Check if the query data has exactly 62 values
    console.log('Query Data:', queryData);
    console.log('Number of values to insert:', queryData.length);
    if (queryData.length !== 62) {
      console.error('Error: Mismatch in the number of query data values');
      return NextResponse.json({ error: 'Mismatch in the number of query data values' }, { status: 400 });
    }

    console.log('Connecting to database');

    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Letran',
    });

    const query = `
      INSERT INTO ejhs_shs_grades 
      (
        subject_id, idnumber, 
        WW1_criteria1_score, WW1_criteria2_score, WW1_criteria3_score, WW1_criteria4_score, WW1_criteria5_score, 
        WW2_criteria1_score, WW2_criteria2_score, WW2_criteria3_score, WW2_criteria4_score, WW2_criteria5_score, 
        WW3_criteria1_score, WW3_criteria2_score, WW3_criteria3_score, WW3_criteria4_score, WW3_criteria5_score, 
        WW4_criteria1_score, WW4_criteria2_score, WW4_criteria3_score, WW4_criteria4_score, WW4_criteria5_score, 
        WW5_criteria1_score, WW5_criteria2_score, WW5_criteria3_score, WW5_criteria4_score, WW5_criteria5_score, 
        WW6_criteria1_score, WW6_criteria2_score, WW6_criteria3_score, WW6_criteria4_score, WW6_criteria5_score, 
        WW7_criteria1_score, WW7_criteria2_score, WW7_criteria3_score, WW7_criteria4_score, WW7_criteria5_score, 
        PT1_criteria1_score, PT1_criteria2_score, PT1_criteria3_score, PT1_criteria4_score, PT1_criteria5_score, 
        PT2_criteria1_score, PT2_criteria2_score, PT2_criteria3_score, PT2_criteria4_score, PT2_criteria5_score, 
        PT3_criteria1_score, PT3_criteria2_score, PT3_criteria3_score, PT3_criteria4_score, PT3_criteria5_score, 
        QA1_criteria1_score, QA1_criteria2_score, QA1_criteria3_score, QA1_criteria4_score, QA1_criteria5_score, 
        QA2_criteria1_score, QA2_criteria2_score, QA2_criteria3_score, QA2_criteria4_score, QA2_criteria5_score
      ) 
      VALUES 
      (
        ?, ?, 
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
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