import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const pool = mysql.createPool({
  host: process.env.DB_HOST, // e.g., 'localhost'
  user: process.env.DB_USER, // e.g., 'root'
  password: process.env.DB_PASSWORD, // e.g., 'password'
  database: process.env.DB_NAME, // e.g., 'school_database'
  port: process.env.DB_PORT, // e.g., 3308
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


export async function POST(req) {
  let connection;
  try {
    // Parse the request body
    const { subjectId, idNumber } = await req.json();

    // Check if subjectId or idNumber is missing
    if (!subjectId && !idNumber) {
      console.error('Missing both subjectid and studentid');
      return NextResponse.json({ error: 'Missing both subjectid and studentid' }, { status: 400 });
    }

    if (!subjectId) {
      console.error('Missing subjectid');
      return NextResponse.json({ error: 'Missing subjectid' }, { status: 400 });
    }

    if (!idNumber) {
      console.error('Missing student_id');
      return NextResponse.json({ error: 'Missing studentid' }, { status: 400 });
    }

    console.log(`Fetching grades for student ${idNumber} in subject ${subjectId}`);

    // Query to fetch the student's grades based on subjectid and studentid
    const query = `
      SELECT 
        subject_id,
        idnumber,
        WW1_criteria1_score, WW1_criteria2_score, WW1_criteria3_score, WW1_criteria4_score, WW1_criteria5_score, WW1_total,
        WW2_criteria1_score, WW2_criteria2_score, WW2_criteria3_score, WW2_criteria4_score, WW2_criteria5_score, WW2_total,
        WW3_criteria1_score, WW3_criteria2_score, WW3_criteria3_score, WW3_criteria4_score, WW3_criteria5_score, WW3_total,
        WW4_criteria1_score, WW4_criteria2_score, WW4_criteria3_score, WW4_criteria4_score, WW4_criteria5_score, WW4_total,
        WW5_criteria1_score, WW5_criteria2_score, WW5_criteria3_score, WW5_criteria4_score, WW5_criteria5_score, WW5_total,
        WW6_criteria1_score, WW6_criteria2_score, WW6_criteria3_score, WW6_criteria4_score, WW6_criteria5_score, WW6_total,
        WW7_criteria1_score, WW7_criteria2_score, WW7_criteria3_score, WW7_criteria4_score, WW7_criteria5_score, WW7_total,
        PT1_criteria1_score, PT1_criteria2_score, PT1_criteria3_score, PT1_criteria4_score, PT1_criteria5_score, PT1_total,
        PT2_criteria1_score, PT2_criteria2_score, PT2_criteria3_score, PT2_criteria4_score, PT2_criteria5_score, PT2_total,
        PT3_criteria1_score, PT3_criteria2_score, PT3_criteria3_score, PT3_criteria4_score, PT3_criteria5_score, PT3_total,
        QA1_criteria1_score, QA1_criteria2_score, QA1_criteria3_score, QA1_criteria4_score, QA1_criteria5_score, QA1_total,
        QA2_criteria1_score, QA2_criteria2_score, QA2_criteria3_score, QA2_criteria4_score, QA2_criteria5_score, QA2_total,
        last_updated
      FROM 
        ejhs_shs_grades
      WHERE 
        subject_id = ? AND idnumber = ?
    `;

    

    // Using pool to get a connection
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, [subjectId, idNumber]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No grades found for the specified subject and student' }, { status: 404 });
    }

    console.log('Student grades fetched successfully');
    return NextResponse.json({ grades: rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching student grades:', error);
    return NextResponse.json({ error: 'Failed to fetch student grades: ' + error.message }, { status: 500 });
  } finally {
    if (connection) {
      connection.release(); // Release connection back to pool
    }
  }
}
