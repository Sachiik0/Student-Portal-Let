import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db'; // Ensure correct import path

// API handler function to get students by subject_id
export async function GET(request) {
  let connection;

  try {
    // Get subject_id from query parameters
    const { searchParams } = new URL(request.url);
    const subject_id = searchParams.get('subject_id');

    // Validate subject_id
    if (!subject_id) {
      return NextResponse.json({ message: 'Subject ID is required' }, { status: 400 });
    }

    // Get a database connection
    connection = await getConnection();

    // Fetch the enrolled students' names and idnumber by joining the grades table with the users table
    const [students] = await connection.query(
      `
      SELECT u.idnumber, u.name
      FROM e g
      JOIN users u ON g.idnumber = u.idnumber
      WHERE g.subjectid = ?
      `,
      [subject_id]
    );

    // If no students are found for this subject
    if (students.length === 0) {
      return NextResponse.json({ message: 'No students enrolled for this subject' }, { status: 404 });
    }

    // Return the list of enrolled students
    return NextResponse.json({ students }, { status: 200 });

  } catch (error) {
    console.error('Error retrieving students:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    // Close the connection to the database
    if (connection) {
      connection.end();
    }
  }
}
