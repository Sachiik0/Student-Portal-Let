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

    // Check if both subjectId and idNumber are provided
    if (!subjectId || !idNumber) {
      console.error('Missing subject_id or student_id');
      return NextResponse.json({ error: 'Missing subject_id or student_id' }, { status: 400 });
    }

    console.log(`Fetching grades for student ${idNumber} in subject ${subjectId}`);

    // Query to fetch the student's grades based on subject_id and student_id
    const query = `
      SELECT 
        subject_id,
        idnumber,
        ORT1_criteria1_score, ORT1_criteria2_score, ORT1_criteria3_score, ORT1_criteria4_score, ORT1_criteria5_score,
        ORT1_total,
        ORT2_criteria1_score, ORT2_criteria2_score, ORT2_criteria3_score, ORT2_criteria4_score, ORT2_criteria5_score,
        ORT2_total,
        ORT3_criteria1_score, ORT3_criteria2_score, ORT3_criteria3_score, ORT3_criteria4_score, ORT3_criteria5_score,
        ORT3_total,
        ORT4_criteria1_score, ORT4_criteria2_score, ORT4_criteria3_score, ORT4_criteria4_score, ORT4_criteria5_score,
        ORT4_total,
        ORT5_criteria1_score, ORT5_criteria2_score, ORT5_criteria3_score, ORT5_criteria4_score, ORT5_criteria5_score,
        ORT5_total,
        ORT6_criteria1_score, ORT6_criteria2_score, ORT6_criteria3_score, ORT6_criteria4_score, ORT6_criteria5_score,
        ORT6_total,
        ORT7_criteria1_score, ORT7_criteria2_score, ORT7_criteria3_score, ORT7_criteria4_score, ORT7_criteria5_score,
        ORT7_total,
        ORT8_criteria1_score, ORT8_criteria2_score, ORT8_criteria3_score, ORT8_criteria4_score, ORT8_criteria5_score,
        ORT8_total,
        WA1_criteria1_score, WA1_criteria2_score, WA1_criteria3_score, WA1_criteria4_score, WA1_criteria5_score,
        WA1_total,
        WA2_criteria1_score, WA2_criteria2_score, WA2_criteria3_score, WA2_criteria4_score, WA2_criteria5_score,
        WA2_total,
        WA3_criteria1_score, WA3_criteria2_score, WA3_criteria3_score, WA3_criteria4_score, WA3_criteria5_score,
        WA3_total,
        WA4_criteria1_score, WA4_criteria2_score, WA4_criteria3_score, WA4_criteria4_score, WA4_criteria5_score,
        WA4_total,
        WA5_criteria1_score, WA5_criteria2_score, WA5_criteria3_score, WA5_criteria4_score, WA5_criteria5_score,
        WA5_total,
        WA6_criteria1_score, WA6_criteria2_score, WA6_criteria3_score, WA6_criteria4_score, WA6_criteria5_score,
        WA6_total,
        long_test_criteria1_score, long_test_criteria2_score, long_test_criteria3_score, long_test_criteria4_score, long_test_criteria5_score,
        long_test_total,
        midterm_criteria1_score, midterm_criteria2_score, midterm_criteria3_score, midterm_criteria4_score, midterm_criteria5_score,
        midterm_total,
        last_updated
      FROM 
        college_grades
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