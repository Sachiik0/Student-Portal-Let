import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate the input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Fetch user from the database
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE LOWER(email) = ?',
      [email.toLowerCase()]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = rows[0];

    // Ensure role exists and is valid
    if (!user.role) {
      return NextResponse.json(
        { error: 'User role is missing' },
        { status: 400 }
      );
    }

    const role = user.role.toUpperCase();

    // Compare the provided password with the stored password
    if (password !== user.password) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    // Return redirect URL based on role
    let redirectUrl;
    switch (role) {
      case 'STUDENT':
        redirectUrl = `/${user.idNumber}/student/home`;
        break;
      case 'ADMIN':
        redirectUrl = `/${user.idNumber}/admin/home`;
        break;
      case 'TEACHER':
        redirectUrl = `/${user.idNumber}/teacher/home`;
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown role' },
          { status: 400 }
        );
    }

    // Return success response with the redirect URL
    return NextResponse.json(
      { 
        message: 'Login successful', 
        user: { 
          idNumber: user.idNumber, 
          email: user.email,
          role: role 
        },
        redirectUrl 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
