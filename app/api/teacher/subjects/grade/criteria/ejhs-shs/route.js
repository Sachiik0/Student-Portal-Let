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

    const activityTitles = [];
    const criteriaTitles = [];

    // Define column ranges for Activity Titles and Criteria Titles
    const activityColumnRanges = [
      [4, 9],  // WW1
      [10, 15], // WW2
      [16, 21], // WW3
      [22, 27], // WW4
      [28, 33], // WW5
      [34, 39], // WW6
      [40, 45], // WW7
      [46, 51], // WW8
      [52, 57], // PT1
      [58, 63], // PT2
      [64, 69], // QA3
      [70, 75], // QA4
    ];

    const criteriaColumnsToIgnore = [9, 15, 21, 27, 33, 39, 45, 51, 57, 63, 69, 75];

    // Extract Activity Titles from Row 14
    for (let i = 0; i < activityColumnRanges.length; i++) {
      let range = activityColumnRanges[i];
      let colStart = range[0];
      let colEnd = range[1];

      let activityTitle = '';
      // Loop through the defined column range for each activity
      for (let col = colStart; col <= colEnd; col++) {
        const colLetter = getColumnLetter(col);
        const cellAddress = `${colLetter}14`;  // Extracting title from row 14
        const cellValue = sheet[cellAddress]?.v || '';  // Get the cell value or default to empty string
        activityTitle += cellValue + ' ';
      }

      // Assign the activity title to the correct index in the activityTitles array
      activityTitles[i] = activityTitle.trim();  // Trim to remove extra spaces
    }

    // Extract Criteria Titles from Row 15
    for (let col = 4; col <= 74; col++) {
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
              host: process.env.DB_HOST, // e.g., 'localhost'
              user: process.env.DB_USER, // e.g., 'root'
              password: process.env.DB_PASSWORD, // e.g., 'password'
              database: process.env.DB_NAME, // e.g., 'school_database'
              port: process.env.DB_PORT, // e.g., 3308
            });

    // Construct the query dynamically
    const columns = [
      "subject_id",
      "WW1_Title", "WW2_Title", "WW3_Title", "WW4_Title", "WW5_Title", "WW6_Title", "WW7_Title",
      "PT1_Title", "PT2_Title", "PT3_Title",
      "QA1_Title", "QA2_Title",
      "WW1_criteria1_title", "WW1_criteria2_title", "WW1_criteria3_title", "WW1_criteria4_title", "WW1_criteria5_title",
      "WW2_criteria1_title", "WW2_criteria2_title", "WW2_criteria3_title", "WW2_criteria4_title", "WW2_criteria5_title",
      "WW3_criteria1_title", "WW3_criteria2_title", "WW3_criteria3_title", "WW3_criteria4_title", "WW3_criteria5_title",
      "WW4_criteria1_title", "WW4_criteria2_title", "WW4_criteria3_title", "WW4_criteria4_title", "WW4_criteria5_title",
      "WW5_criteria1_title", "WW5_criteria2_title", "WW5_criteria3_title", "WW5_criteria4_title", "WW5_criteria5_title",
      "WW6_criteria1_title", "WW6_criteria2_title", "WW6_criteria3_title", "WW6_criteria4_title", "WW6_criteria5_title",
      "WW7_criteria1_title", "WW7_criteria2_title", "WW7_criteria3_title", "WW7_criteria4_title", "WW7_criteria5_title",
      "PT1_criteria1_title", "PT1_criteria2_title", "PT1_criteria3_title", "PT1_criteria4_title", "PT1_criteria5_title",
      "PT2_criteria1_title", "PT2_criteria2_title", "PT2_criteria3_title", "PT2_criteria4_title", "PT2_criteria5_title",
      "PT3_criteria1_title", "PT3_criteria2_title", "PT3_criteria3_title", "PT3_criteria4_title", "PT3_criteria5_title",
      "QA1_criteria1_title", "QA1_criteria2_title", "QA1_criteria3_title", "QA1_criteria4_title", "QA1_criteria5_title",
      "QA2_criteria1_title", "QA2_criteria2_title", "QA2_criteria3_title", "QA2_criteria4_title", "QA2_criteria5_title",
    ];
    

    const placeholders = columns.map(() => '?').join(',');
    const query = `INSERT INTO shs_activities_criteria_titles (${columns.join(', ')}) 
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
