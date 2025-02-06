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

    // Fetch the user details based on idNumber
    const [rows] = await connection.execute(
      `SELECT idNumber, name, email, role, year, password
       FROM users
       WHERE idNumber = ?`,
      [idNumber]
    );

    // Close the database connection
    await connection.end();

    // Return the user details or error if none found
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No user found for this ID number' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data', details: error.message },
      { status: 500 }
    );
  }
}
