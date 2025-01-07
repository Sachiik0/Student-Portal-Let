import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request) {
  try {
    // Get subject_id and student_ids from the request body
    const { subject_id, student_ids } = await request.json();

    console.log('Received subject_id:', subject_id);
    console.log('Received student_ids:', student_ids);

    // Validate input
    if (!subject_id || !Array.isArray(student_ids) || student_ids.length === 0) {
      return NextResponse.json(
        { error: 'Subject ID and student IDs are required.' },
        { status: 400 }
      );
    }

    const connection = await getConnection();
    console.log('Database connection established');

    // Check if the subject exists in the subjects table
    const [subject] = await connection.execute(
      'SELECT * FROM subjects WHERE subject_id = ?',
      [subject_id]  // Use subject_id for querying the subjects table
    );

    if (subject.length === 0) {
      return NextResponse.json(
        { error: 'Subject not found.' },
        { status: 404 }
      );
    }

    // Validate if students exist and check if they are already enrolled in the subject
    const placeholders = student_ids.map(() => '?').join(',');
    const [validStudents] = await connection.execute(
      `SELECT idnumber FROM users WHERE idnumber IN (${placeholders})`,
      student_ids
    );
    const validStudentIds = validStudents.map((row) => row.idnumber);

    const [alreadyEnrolled] = await connection.execute(
      `SELECT idnumber FROM grades WHERE subjectid = ? AND idnumber IN (${placeholders})`,
      [subject_id, ...student_ids]
    );
    const enrolledStudentIds = alreadyEnrolled.map((row) => row.idnumber);

    const newStudentIds = validStudentIds.filter(
      (id) => !enrolledStudentIds.includes(id)
    );

    if (newStudentIds.length === 0) {
      return NextResponse.json(
        { error: 'All students are already enrolled in this subject.' },
        { status: 400 }
      );
    }

    // Insert records for new students into the grades table
    for (let idnumber of newStudentIds) {
      await connection.execute(
        'INSERT INTO grades (subjectid, idnumber) VALUES (?, ?)',
        [subject_id, idnumber]
      );
    }

    await connection.end();

    return NextResponse.json(
      { message: 'Students assigned successfully!', enrolledStudentIds: newStudentIds },
      { status: 200 }
    );
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: 'An error occurred: ' + error.message },
      { status: 500 }
    );
  }
}
