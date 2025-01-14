//app/api/teacher/subjects/grade/get-subject/route.js
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json(); // Parse JSON body
    const { subjectid } = body;

    if (!subjectid) {
      return NextResponse.json(
        { error: 'subjectid is required' },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    const query = 'SELECT * FROM grades WHERE subjectid = ?'; // Adjust table/column names
    const [students] = await connection.execute(query, [subjectid]);

    await connection.end();

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students', details: error.message },
      { status: 500 }
    );
  }
}
