//app/api/teacher/subjects/grade/grade-student/route.js
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request, context) {
  try {
    // Get subjectid from route parameters
    const { subjectid } = context.params;

    // Validate subjectid
    if (!subjectid) {
      return NextResponse.json(
        { error: 'Subject ID is required' },
        { status: 400 }
      );
    }

    // Parse the request body (grade data)
    const gradeData = await request.json();

    // Validate required fields
    const requiredFields = [
      'idnumber',
      'ww1_criteria1_score',
      'ww1_criteria2_score',
      'ww1_criteria3_score',
      'ww1_criteria4_score',
      'ww1_criteria5_score',
      'ww1_criteria1_highest',
      'ww1_criteria2_highest',
      'ww1_criteria3_highest',
      'ww1_criteria4_highest',
      'ww1_criteria5_highest',
      'ww1_total_highest',
    ];

    for (const field of requiredFields) {
      if (!gradeData[field] && gradeData[field] !== 0) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Establish database connection
    const connection = await getConnection();

    try {
      // Check if the student already has a grade for this subject
      const checkQuery = `
        SELECT * FROM grades WHERE subjectid = ? AND idnumber = ?
      `;
      const [existingGrade] = await connection.execute(checkQuery, [
        subjectid,
        gradeData.idnumber,
      ]);

      if (existingGrade.length > 0) {
        // Update existing grade record
        const updateQuery = `
          UPDATE grades SET 
          ww1_criteria1_score = ?, ww1_criteria2_score = ?, ww1_criteria3_score = ?, 
          ww1_criteria4_score = ?, ww1_criteria5_score = ?, 
          ww1_criteria1_highest = ?, ww1_criteria2_highest = ?, 
          ww1_criteria3_highest = ?, ww1_criteria4_highest = ?, ww1_criteria5_highest = ?, 
          ww1_total_highest = ? 
          WHERE subjectid = ? AND idnumber = ?
        `;
        const updateValues = [
          gradeData.ww1_criteria1_score,
          gradeData.ww1_criteria2_score,
          gradeData.ww1_criteria3_score,
          gradeData.ww1_criteria4_score,
          gradeData.ww1_criteria5_score,
          gradeData.ww1_criteria1_highest,
          gradeData.ww1_criteria2_highest,
          gradeData.ww1_criteria3_highest,
          gradeData.ww1_criteria4_highest,
          gradeData.ww1_criteria5_highest,
          gradeData.ww1_total_highest,
          subjectid,
          gradeData.idnumber,
        ];

        await connection.execute(updateQuery, updateValues);

        // Close the connection
        await connection.end();

        return NextResponse.json(
          { message: 'Grade updated successfully' },
          { status: 200 }
        );
      } else {
        // Insert a new grade record
        const insertQuery = `
          INSERT INTO grades (
            subjectid, idnumber, ww1_criteria1_score, ww1_criteria2_score, 
            ww1_criteria3_score, ww1_criteria4_score, ww1_criteria5_score, 
            ww1_criteria1_highest, ww1_criteria2_highest, 
            ww1_criteria3_highest, ww1_criteria4_highest, ww1_criteria5_highest, 
            ww1_total_highest
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertValues = [
          subjectid,
          gradeData.idnumber,
          gradeData.ww1_criteria1_score,
          gradeData.ww1_criteria2_score,
          gradeData.ww1_criteria3_score,
          gradeData.ww1_criteria4_score,
          gradeData.ww1_criteria5_score,
          gradeData.ww1_criteria1_highest,
          gradeData.ww1_criteria2_highest,
          gradeData.ww1_criteria3_highest,
          gradeData.ww1_criteria4_highest,
          gradeData.ww1_criteria5_highest,
          gradeData.ww1_total_highest,
        ];

        await connection.execute(insertQuery, insertValues);

        // Close the connection
        await connection.end();

        return NextResponse.json(
          { message: 'Grade added successfully' },
          { status: 201 }
        );
      }
    } catch (dbError) {
      console.error('Database Error:', dbError);

      // Close the connection on error
      await connection.end();

      return NextResponse.json(
        { error: 'Failed to process grade', details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
