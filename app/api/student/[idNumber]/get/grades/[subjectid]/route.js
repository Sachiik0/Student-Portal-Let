import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    // Use async/await to resolve params properly
    const { idNumber, subjectid } = await params;

    // Validate the idNumber and subjectid
    if (!idNumber || !subjectid) {
      return NextResponse.json(
        { error: 'Student ID number and subject ID are required' },
        { status: 400 }
      );
    }

    // Establish database connection
    const connection = await getConnection();

    // Fetch grades for the specific student and subject
    const [rows] = await connection.execute(
      'SELECT * FROM enrolled WHERE idnumber = ? AND subjectid = ?',
      [idNumber, subjectid]
    );

    // Close the database connection
    await connection.end();

    // Return the grades or error if none found
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No grades found for this student and subject' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grades' },
      { status: 500 }
    );
  }
}
