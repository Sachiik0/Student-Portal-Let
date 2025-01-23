import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req) { // Change GET to POST
  let connection;
  try {
    const { subjectid: subjectId } = await req.json();

    console.log("Received subjectId:", subjectId); // Log the subject ID

    if (!subjectId) {
      console.error("Missing subject_id in request body");
      return NextResponse.json({ error: 'Missing subject_id' }, { status: 400 });
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    console.log("Database connection established");

    const query = `
      SELECT 
        ORT1_Title, ORT2_Title, ORT3_Title, ORT4_Title, ORT5_Title, ORT6_Title, ORT7_Title, ORT8_Title,
        WA1_Title, WA2_Title, WA3_Title, WA4_Title, WA5_Title, WA6_Title,
        long_test_Title, midterm_Title,
        ORT1_criteria1_title, ORT1_criteria2_title, ORT1_criteria3_title, ORT1_criteria4_title, ORT1_criteria5_title,
        ORT2_criteria1_title, ORT2_criteria2_title, ORT2_criteria3_title, ORT2_criteria4_title, ORT2_criteria5_title,
        ORT3_criteria1_title, ORT3_criteria2_title, ORT3_criteria3_title, ORT3_criteria4_title, ORT3_criteria5_title,
        ORT4_criteria1_title, ORT4_criteria2_title, ORT4_criteria3_title, ORT4_criteria4_title, ORT4_criteria5_title,
        ORT5_criteria1_title, ORT5_criteria2_title, ORT5_criteria3_title, ORT5_criteria4_title, ORT5_criteria5_title,
        ORT6_criteria1_title, ORT6_criteria2_title, ORT6_criteria3_title, ORT6_criteria4_title, ORT6_criteria5_title,
        ORT7_criteria1_title, ORT7_criteria2_title, ORT7_criteria3_title, ORT7_criteria4_title, ORT7_criteria5_title,
        ORT8_criteria1_title, ORT8_criteria2_title, ORT8_criteria3_title, ORT8_criteria4_title, ORT8_criteria5_title,
        WA1_criteria1_title, WA1_criteria2_title, WA1_criteria3_title, WA1_criteria4_title, WA1_criteria5_title,
        WA2_criteria1_title, WA2_criteria2_title, WA2_criteria3_title, WA2_criteria4_title, WA2_criteria5_title,
        WA3_criteria1_title, WA3_criteria2_title, WA3_criteria3_title, WA3_criteria4_title, WA3_criteria5_title,
        WA4_criteria1_title, WA4_criteria2_title, WA4_criteria3_title, WA4_criteria4_title, WA4_criteria5_title,
        WA5_criteria1_title, WA5_criteria2_title, WA5_criteria3_title, WA5_criteria4_title, WA5_criteria5_title,
        WA6_criteria1_title, WA6_criteria2_title, WA6_criteria3_title, WA6_criteria4_title, WA6_criteria5_title,
        long_test_criteria1_title, long_test_criteria2_title, long_test_criteria3_title, long_test_criteria4_title, long_test_criteria5_title,
        midterm_criteria1_title, midterm_criteria2_title, midterm_criteria3_title, midterm_criteria4_title, midterm_criteria5_title
      FROM college_activities_criteria_titles 
      WHERE subject_id = ?`;

    console.log("Executing SQL Query with subjectId:", subjectId);

    const [rows] = await connection.execute(query, [subjectId]);

    console.log("Query executed successfully. Rows retrieved:", rows.length);

    if (rows.length === 0) {
      console.warn("No records found for subjectId:", subjectId);
      return NextResponse.json({ error: 'No records found' }, { status: 404 });
    }

    // Remove null values from the result
    const filteredData = Object.fromEntries(
      Object.entries(rows[0]).filter(([_, value]) => value !== null)
    );

    console.log("Filtered Data:", filteredData);

    return NextResponse.json({ data: filteredData }, { status: 200 });

  } catch (error) {
    console.error('Error fetching criteria:', error);
    return NextResponse.json({ error: 'Failed to fetch criteria: ' + error.message }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}
