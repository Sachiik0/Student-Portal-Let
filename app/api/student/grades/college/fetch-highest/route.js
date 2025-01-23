import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(req) {
  let connection;
  try {
    console.log('Received request to fetch data');
    
    const url = new URL(req.url);
    const subjectId = url.searchParams.get('subjectid'); // Get the subjectid from query parameters

    if (!subjectId) {
      console.error('Subject ID is required');
      return NextResponse.json({ error: 'Subject ID is required' }, { status: 400 });
    }

    console.log('Connecting to database');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST, // e.g., 'localhost'
      user: process.env.DB_USER, // e.g., 'root'
      password: process.env.DB_PASSWORD, // e.g., 'password'
      database: process.env.DB_NAME, // e.g., 'school_database'
      port: process.env.DB_PORT, // e.g., 3308
    });

    // Define the query to fetch data based on subjectid
    const query = `
      SELECT * 
      FROM college_highest_score 
      WHERE subjectid = ?;
    `;

    console.log('Executing database query');
    const [rows] = await connection.execute(query, [subjectId]);

    if (rows.length === 0) {
      console.log('No data found for subject ID:', subjectId);
      return NextResponse.json({ message: 'No data found for the provided subject ID' }, { status: 404 });
    }

    console.log('Data fetched successfully:', rows);
    return NextResponse.json({ data: rows }, { status: 200 });

  } catch (error) {
    console.error('Error during data fetch:', error);
    return NextResponse.json({ error: 'Failed to fetch data: ' + error.message }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
