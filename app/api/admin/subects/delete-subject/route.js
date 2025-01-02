// app/api/admin/delete-subject/route.js
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function DELETE(request) {
  try {
    // Parse the request body to get the subject code
    const { subject_code } = await request.json();

    // Validate the subject code
    if (!subject_code) {
      return NextResponse.json(
        { error: 'Subject code is required' },
        { status: 400 }
      );
    }

    // Establish database connection
    const connection = await getConnection();

    // Execute the delete query
    const [result] = await connection.execute(
      'DELETE FROM subjects WHERE subject_code = ?',
      [subject_code]
    );

    // Close the database connection
    await connection.end();

    // Check if the subject was deleted
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      { message: 'Subject deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json(
      { error: 'Failed to delete subject' },
      { status: 500 }
    );
  }
}