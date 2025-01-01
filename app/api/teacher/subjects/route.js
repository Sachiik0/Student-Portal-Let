import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// MySQL connection
const db = mysql.createPool({
  host: process.env.DB_HOST, // e.g., 'localhost'
  user: process.env.DB_USER, // e.g., 'root'
  password: process.env.DB_PASSWORD, // e.g., 'password'
  database: process.env.DB_NAME, // e.g., 'school_database'
});

export async function GET(request) {
  try {
    const userHeader = request.headers.get('user');
    const user = JSON.parse(userHeader); // Parse user info from the request header

    if (!user || !user.idNumber) {
      return NextResponse.json(
        { error: 'Unauthorized. ID number is missing.' },
        { status: 401 }
      );
    }

    const [rows] = await db.query(
      'SELECT * FROM subjects WHERE idnumber = ?',
      [user.idNumber]
    );

    return NextResponse.json({ subjects: rows });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subjects.' },
      { status: 500 }
    );
  }
}
