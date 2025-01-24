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
        WW1_Title, WW2_Title, WW3_Title, WW4_Title, WW5_Title, WW6_Title, WW7_Title,
        PT1_Title, PT2_Title, PT3_Title,
        QA1_Title, QA2_Title,
        WW1_criteria1_title, WW1_criteria2_title, WW1_criteria3_title, WW1_criteria4_title, WW1_criteria5_title,
        WW2_criteria1_title, WW2_criteria2_title, WW2_criteria3_title, WW2_criteria4_title, WW2_criteria5_title,
        WW3_criteria1_title, WW3_criteria2_title, WW3_criteria3_title, WW3_criteria4_title, WW3_criteria5_title,
        WW4_criteria1_title, WW4_criteria2_title, WW4_criteria3_title, WW4_criteria4_title, WW4_criteria5_title,
        WW5_criteria1_title, WW5_criteria2_title, WW5_criteria3_title, WW5_criteria4_title, WW5_criteria5_title,
        WW6_criteria1_title, WW6_criteria2_title, WW6_criteria3_title, WW6_criteria4_title, WW6_criteria5_title,
        WW7_criteria1_title, WW7_criteria2_title, WW7_criteria3_title, WW7_criteria4_title, WW7_criteria5_title,
        PT1_criteria1_title, PT1_criteria2_title, PT1_criteria3_title, PT1_criteria4_title, PT1_criteria5_title,
        PT2_criteria1_title, PT2_criteria2_title, PT2_criteria3_title, PT2_criteria4_title, PT2_criteria5_title,
        PT3_criteria1_title, PT3_criteria2_title, PT3_criteria3_title, PT3_criteria4_title, PT3_criteria5_title,
        QA1_criteria1_title, QA1_criteria2_title, QA1_criteria3_title, QA1_criteria4_title, QA1_criteria5_title,
        QA2_criteria1_title, QA2_criteria2_title, QA2_criteria3_title, QA2_criteria4_title, QA2_criteria5_title
      FROM shs_activities_criteria_titles 
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
