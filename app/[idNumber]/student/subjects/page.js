'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

function StudentSubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch subjects for the logged-in student
  const fetchSubjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Retrieve user info from localStorage
      if (!user || !user.idNumber) {
        throw new Error('Unauthorized: Missing user info.');
      }

      // Fetch the student's subjects from the correct API endpoint
      const res = await fetch(`/api/student/${user.idNumber}/get/subjects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json(); // Parse error response
        throw new Error(errorData.error || 'Failed to fetch subjects.');
      }

      const data = await res.json();

      // If no data, inform the user
      if (data.length === 0) {
        setError('No subjects found for this student.');
        return;
      }

      setSubjects(data); // Update the state with the subjects the student is enrolled in
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

  // Navigate to the grades page for a specific subject
  const handleViewGrades = (subjectId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.idNumber) {
      router.push(`/${user.idNumber}/student/subjects/grades/${subjectId}`);
    } else {
      setError('Unauthorized: Missing user info.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Student Subjects</h1>
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
              {/* Add Teacher Name */}
              {subject.teacher_name && (
                <p>
                  <strong>Teacher:</strong> {subject.teacher_name}
                </p>
              )}
              {/* Add "View Grades" button */}
              <Button
                onClick={() => handleViewGrades(subject.subject_id)}
                className="mt-4 w-full"
                variant="outline"
              >
                View Grades
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {subjects.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-6">No subjects found.</p>
      )}
    </div>
  );
}

export default withAuth(StudentSubjectsPage);
