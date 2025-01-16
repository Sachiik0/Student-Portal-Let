import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request) {
  let connection;

  try {
    // Attempt to parse the JSON body
    const requestBody = await request.json();
    const { subjectid } = requestBody;

    console.log('Received subjectid:', subjectid);  // Log to ensure it's being received

    // Validate subjectid
    if (!subjectid) {
      return NextResponse.json({ message: 'Subject ID is required' }, { status: 400 });
    }

    // Get a database connection
    connection = await getConnection();

    // Fetch the enrolled students' names and idnumber by joining the enrolled table with the users table
    const [students] = await connection.query(
      `SELECT u.idnumber, u.name
       FROM enrolled g
       JOIN users u ON g.idnumber = u.idnumber
       WHERE g.subjectid = ?`,
      [subjectid] // Use parameterized queries for safety
    );

    // Check if students are found
    if (students.length === 0) {
      return NextResponse.json({ message: 'No students found for this subject' }, { status: 404 });
    }

    // Return the students found for the subject
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error('Error retrieving students:', error);
    return NextResponse.json({ message: 'Failed to retrieve students', details: error.message }, { status: 500 });
  } finally {
    // Close the database connection
    if (connection) {
      connection.end();
    }
  }
}
