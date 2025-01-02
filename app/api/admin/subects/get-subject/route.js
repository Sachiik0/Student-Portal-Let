// app/api/admin/get-subject/route.js
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    // Establish database connection
    const connection = await getConnection();

    // Fetch all subjects from the database
    const [rows] = await connection.execute('SELECT * FROM subjects');

    // Close the database connection
    await connection.end();

    // Return the subjects as a JSON response
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    );
  }
}