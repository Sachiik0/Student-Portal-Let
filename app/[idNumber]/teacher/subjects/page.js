'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

function TeacherSubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch subjects for the logged-in teacher
  const fetchSubjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.idNumber) {
        throw new Error('Unauthorized: Missing user info.');
      }

      const res = await fetch('/api/teacher/subjects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          user: JSON.stringify(user),
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch subjects.');
      }

      const data = await res.json();
      console.log('Fetched subjects:', data.subjects);
      setSubjects(data.subjects);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while fetching subjects.');
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear session
    router.push(process.env.NEXT_PUBLIC_BASE_URL || '/'); // Redirect to home
  };

  // Navigate to grading page and pass the subjectId in the URL
  const handleGradeSubject = (subjectId) => {
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve user info
    const idNumber = user ? user.idNumber : ''; // Get idNumber from user object
    if (subjectId && idNumber) {
      router.push(`/${idNumber}/teacher/subjects/grade/${subjectId}`); // Correct URL structure with idNumber
    } else {
      console.error("Subject ID or ID Number is undefined");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Teacher Subjects</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.subject_id} className="shadow-md">
            <CardHeader>
              <CardTitle>{subject.subject_code}</CardTitle>
              <CardDescription>{subject.subject_name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Section:</strong> {subject.section}
              </p>
              <p>
                <strong>Department:</strong> {subject.department}
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleGradeSubject(subject.subject_id)} variant="primary">
                Grade
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {subjects.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-6">No subjects found.</p>
      )}
    </div>
  );
}

export default withAuth(TeacherSubjectsPage);
