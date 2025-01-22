import { read } from 'xlsx';
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

function getColumnLetter(col) {
  let letter = '';
  while (col > 0) {
    const remainder = (col - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter; // A-Z is 65-90 in ASCII
    col = Math.floor((col - 1) / 26);
  }
  return letter;
}

// Define your POST function
export async function POST(req) {
  let connection;
  try {
    console.log('Received file upload request');

    // Get form data from the request
    const formData = await req.formData();
    const file = formData.get('file');
    const subjectId = formData.get('subject_id');

    // Validate file existence and type
    if (!file) {
      console.error('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.name.endsWith('.xlsx')) {
      console.error('Invalid file format:', file.name);
      return NextResponse.json({ error: 'Only .xlsx files are allowed' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = read(Buffer.from(buffer), { type: 'buffer' }); // Indicate buffer type
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    console.log('Extracting data from sheet:', sheetName);

    const activityTitles = [];
    const criteriaTitles = [];

    // Define column ranges for Activity Titles and Criteria Titles
    const activityColumnRanges = [
      [4, 9],   // ORT1
      [10, 15], // ORT2
      [16, 21], // ORT3
      [22, 27], // ORT4
      [28, 33], // ORT5
      [34, 39], // ORT6
      [40, 45], // ORT7
      [46, 51], // ORT8
      [52, 57], // WA1
      [58, 63], // WA2
      [64, 69], // WA3
      [70, 75], // WA4
      [76, 81], // WA5
      [82, 87], // WA6
      [88, 93], // CJ to CO (Long Test)
      [94, 99]  // CP to CU (Midterm)
    ];

    const criteriaColumnsToIgnore = [9, 15, 21, 27, 33, 39, 45, 51, 57, 63, 69, 75, 81, 87, 93, 99];

    // Extract Activity Titles from Row 14
    for (let i = 0; i < activityColumnRanges.length; i++) {
      let range = activityColumnRanges[i];
      let colStart = range[0];
      let colEnd = range[1];

      let activityTitle = '';
      for (let col = colStart; col <= colEnd; col++) {
        const colLetter = getColumnLetter(col);
        const cellAddress = `${colLetter}14`;  // Extracting title from row 14
        const cellValue = sheet[cellAddress]?.v || '';  // Get the cell value or default to empty string
        activityTitle += cellValue + ' ';
      }
      activityTitles[i] = activityTitle.trim();  // Store activity title, trimmed
    }

    // Extract Criteria Titles from Row 15
    for (let col = 4; col <= 99; col++) {
      if (!criteriaColumnsToIgnore.includes(col)) {
        const colLetter = getColumnLetter(col);
        const cellAddress = `${colLetter}15`;
        const cellValue = sheet[cellAddress]?.v || null;
        criteriaTitles.push(cellValue);
      }
    }

    const transformedCriteriaData = criteriaTitles.map(value => (value === null ? null : value));

    // Ensure queryData length matches placeholders
    const queryData = [subjectId, ...activityTitles, ...transformedCriteriaData];

    console.log('Query Data:', queryData);

    connection = await mysql.createConnection({
              host: process.env.DB_HOST, 
              user: process.env.DB_USER, 
              password: process.env.DB_PASSWORD, 
              database: process.env.DB_NAME, 
              port: process.env.DB_PORT,
            });

    // Construct the query dynamically
    const columns = [
      "subject_id",
      "ORT1_Title", "ORT2_Title", "ORT3_Title", "ORT4_Title", "ORT5_Title", "ORT6_Title", "ORT7_Title", "ORT8_Title",
      "WA1_Title", "WA2_Title", "WA3_Title", "WA4_Title", "WA5_Title", "WA6_Title",
      "long_test_Title", "midterm_Title",
      "ORT1_criteria1_title", "ORT1_criteria2_title", "ORT1_criteria3_title", "ORT1_criteria4_title", "ORT1_criteria5_title",
      "ORT2_criteria1_title", "ORT2_criteria2_title", "ORT2_criteria3_title", "ORT2_criteria4_title", "ORT2_criteria5_title",
      "ORT3_criteria1_title", "ORT3_criteria2_title", "ORT3_criteria3_title", "ORT3_criteria4_title", "ORT3_criteria5_title",
      "ORT4_criteria1_title", "ORT4_criteria2_title", "ORT4_criteria3_title", "ORT4_criteria4_title", "ORT4_criteria5_title",
      "ORT5_criteria1_title", "ORT5_criteria2_title", "ORT5_criteria3_title", "ORT5_criteria4_title", "ORT5_criteria5_title",
      "ORT6_criteria1_title", "ORT6_criteria2_title", "ORT6_criteria3_title", "ORT6_criteria4_title", "ORT6_criteria5_title",
      "ORT7_criteria1_title", "ORT7_criteria2_title", "ORT7_criteria3_title", "ORT7_criteria4_title", "ORT7_criteria5_title",
      "ORT8_criteria1_title", "ORT8_criteria2_title", "ORT8_criteria3_title", "ORT8_criteria4_title", "ORT8_criteria5_title",
      "WA1_criteria1_title", "WA1_criteria2_title", "WA1_criteria3_title", "WA1_criteria4_title", "WA1_criteria5_title",
      "WA2_criteria1_title", "WA2_criteria2_title", "WA2_criteria3_title", "WA2_criteria4_title", "WA2_criteria5_title",
      "WA3_criteria1_title", "WA3_criteria2_title", "WA3_criteria3_title", "WA3_criteria4_title", "WA3_criteria5_title",
      "WA4_criteria1_title", "WA4_criteria2_title", "WA4_criteria3_title", "WA4_criteria4_title", "WA4_criteria5_title",
      "WA5_criteria1_title", "WA5_criteria2_title", "WA5_criteria3_title", "WA5_criteria4_title", "WA5_criteria5_title",
      "WA6_criteria1_title", "WA6_criteria2_title", "WA6_criteria3_title", "WA6_criteria4_title", "WA6_criteria5_title",
      "long_test_criteria1_title", "long_test_criteria2_title", "long_test_criteria3_title", "long_test_criteria4_title", "long_test_criteria5_title",
      "midterm_criteria1_title", "midterm_criteria2_title", "midterm_criteria3_title", "midterm_criteria4_title", "midterm_criteria5_title"
    ];

    const placeholders = columns.map(() => '?').join(',');
    const query = `INSERT INTO college_activities_criteria_titles (${columns.join(', ')}) 
                   VALUES (${placeholders}) 
                   ON DUPLICATE KEY UPDATE 
                   ${columns.map(col => `${col} = VALUES(${col})`).join(', ')}`;

    console.log('Executing query...');
    await connection.execute(query, queryData);

    console.log('File uploaded successfully');
    return NextResponse.json({ message: 'File uploaded successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file: ' + error.message }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}