import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request) {
  try {
    const { idNumber } = await request.json(); // Retrieve student ID from the request body

    // Validate the idNumber
    if (!idNumber) {
      return NextResponse.json(
        { error: 'Student ID number is required' },
        { status: 400 }
      );
    }

    // Establish database connection
    const connection = await getConnection();

    // Fetch all subjects and their respective teacher names
    const [rows] = await connection.execute(
      `SELECT subjects.*, users.name AS teacher_name
       FROM subjects
       JOIN enrolled ON enrolled.subjectid = subjects.subject_id
       LEFT JOIN users ON users.idnumber = subjects.teacherid  -- Assuming teacherid is in subjects table
       WHERE enrolled.idnumber = ?`,
      [idNumber]
    );

    // Close the database connection
    await connection.end();

    // Return the subjects or error if none found
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No subjects found for this student' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subjects', details: error.message },
      { status: 500 }
    );
  }
}
