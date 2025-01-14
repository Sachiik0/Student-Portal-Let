//app/api/teacher/subjects/grade/get-student/route.js
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { subjectid } = body;

    // Ensure subjectid is provided
    if (!subjectid) {
      return NextResponse.json(
        { error: 'subjectid is required' },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    console.log('Fetching students for subjectid:', subjectid); // Debugging log

    // Adjusted query to correctly link the tables
    const query = `
      SELECT users.idNumber,users.name
      FROM grades
      JOIN users ON grades.idnumber = users.idNumber
      WHERE grades.subjectId = ?`;

    const [students] = await connection.execute(query, [subjectid]);

    await connection.end();

    if (students.length === 0) {
      console.log('No students found for subjectid:', subjectid); // Debugging log
    }

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error('Error fetching enrolled students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrolled students', details: error.message },
      { status: 500 }
    );
  }
}
