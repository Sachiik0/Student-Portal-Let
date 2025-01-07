import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request, context) {
  try {
    // Await dynamic route params
    const { subjectid } = await context.params;

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
      // Insert grade data into the grades table
      const query = `
        INSERT INTO grades (
          subjectid, idnumber, ww1_criteria1_score, ww1_criteria2_score, 
          ww1_criteria3_score, ww1_criteria4_score, ww1_criteria5_score, 
          ww1_criteria1_highest, ww1_criteria2_highest, 
          ww1_criteria3_highest, ww1_criteria4_highest, ww1_criteria5_highest, 
          ww1_total_highest
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
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

      const [result] = await connection.execute(query, values);

      // Close the connection
      await connection.end();

      // Return success response
      return NextResponse.json(
        { message: 'Grade added successfully', result },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Database Error:', dbError);

      // Close the connection on error
      await connection.end();

      return NextResponse.json(
        { error: 'Failed to add grade', details: dbError.message },
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
