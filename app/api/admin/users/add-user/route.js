import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db'; // Ensure correct import path

// API handler function to add a user
export async function POST(request) {
  let connection;

  try {
    // Get user data from the request body
    const { name, email, role, year, password } = await request.json();

    // Validate input data
    if (!name || !email || !role || !year || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Get a database connection
    connection = await getConnection();

    // Check if the email already exists in the database
    const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return NextResponse.json({ message: 'Email is already taken' }, { status: 409 });
    }

    // Insert new user into the database
    const [result] = await connection.query(
      'INSERT INTO users (name, email, role, year, password) VALUES (?, ?, ?, ?, ?)',
      [name, email, role, year, password] // Insert the plain password (not hashed)
    );

    // Check if the insertion was successful
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Failed to add user to the database' }, { status: 500 });
    }

    // Return a success message
    return NextResponse.json(
      { message: 'User added successfully', userId: result.insertId }, // Assuming your table has an auto-incremented primary key
      { status: 201 }
    );

  } catch (error) {
    console.error('Error adding user:', error);

    // Check the error type for specific errors
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: 'Duplicate entry, email already exists.' }, { status: 409 });
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
      return NextResponse.json({ message: 'Database error: Invalid field in request.' }, { status: 400 });
    }

    // General fallback error message
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    // Close the connection to the database
    if (connection) {
      connection.end();
    }
  }
}
