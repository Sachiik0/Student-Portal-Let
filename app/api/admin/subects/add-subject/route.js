import { getConnection } from '@/lib/db';

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const { subject_code, subject_name, idnumber, department, section } = body;

    // Validate all required fields
    if (!subject_code || !subject_name || !idnumber || !department || !section) {
      return new Response(
        JSON.stringify({
          error: 'Validation Error',
          message: 'All fields are required. Please ensure all fields are filled in.',
          missingFields: {
            subject_code: !subject_code ? 'Missing' : 'Present',
            subject_name: !subject_name ? 'Missing' : 'Present',
            idnumber: !idnumber ? 'Missing' : 'Present',
            department: !department ? 'Missing' : 'Present',
            section: !section ? 'Missing' : 'Present',
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Establish database connection
    const connection = await getConnection();

    // MySQL query to insert data
    const [rows] = await connection.execute(
      `
      INSERT INTO subjects (subject_code, subject_name, idnumber, department, section)
      VALUES (?, ?, ?, ?, ?)
      `,
      [subject_code, subject_name, idnumber, department, section]
    );

    // Close the database connection
    await connection.end();

    // Respond with success
    return new Response(
      JSON.stringify({
        message: 'Subject added successfully!',
        data: {
          subject_code,
          subject_name,
          idnumber,
          department,
          section,
          insertId: rows.insertId || 'N/A',
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Database error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return new Response(
        JSON.stringify({
          error: 'Database Error',
          message: 'Duplicate entry detected. The subject already exists.',
          code: error.code,
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to add subject due to a database error.',
        details: {
          message: error.message,
          code: error.code,
        },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
