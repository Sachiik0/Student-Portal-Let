'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import withAuth from '@/components/withAuth';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

function StudentGradesPage() {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]); // State to store subjects
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();

  // Fetch grades for the logged-in student and specific subject
  const fetchGrades = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Retrieve user info from localStorage
      if (!user || !user.idNumber) {
        throw new Error('Unauthorized: Missing user info.');
      }

      // Fetch the student's grades for the specific subject from the API endpoint
      const res = await fetch(`/api/student/${user.idNumber}/get/grades/${params.subjectid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json(); // Parse error response
        throw new Error(errorData.error || 'Failed to fetch grades.');
      }

      const data = await res.json();

      // Log the data to the console for debugging
      console.log(data); // Add this line to see the data structure

      // If no data, inform the user
      if (data.length === 0) {
        setError('No grades found for this subject.');
        return;
      }

      setGrades(data); // Update the state with the grades for the subject
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while fetching grades.');
    }
  };

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
    fetchGrades();
    fetchSubjects(); // Corrected function name
  }, []);

  // Find the subject for the grade based on subjectId
  const findSubjectForGrade = (grade) => {
    return subjects.find((subject) => subject.subject_id === grade.subjectid);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear session
    router.push(process.env.NEXT_PUBLIC_BASE_URL || '/'); // Redirect to home
  };

  // Navigate back to subjects page
  const handleBackToSubjects = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.idNumber) {
      router.push(`/${user.idNumber}/student/subjects`);
    } else {
      setError('Unauthorized: Missing user info.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Grades for Subject {params.subjectid}</h1>
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
        {grades.map((grade) => {
          const subject = findSubjectForGrade(grade); // Link the grade with its corresponding subject

          return (
            <Card key={grade.gradeid} className="shadow-md">
              <CardHeader>
                <CardTitle>{subject?.subject_code || 'No Subject Code'}</CardTitle>
                <CardDescription>{subject?.subject_name || 'No Subject Name'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p><strong>Subject Code:</strong> {subject?.subject_code || 'No Subject Code'}</p>
                <p><strong>Section:</strong> {subject?.section || 'No Section'}</p>
                <p><strong>Department:</strong> {subject?.department || 'No Department'}</p>
                {subject?.teacher_name && (
                  <p><strong>Teacher:</strong> {subject?.teacher_name || 'No Teacher Assigned'}</p>
                )}
                <p><strong>WW1 Criteria 1 Score:</strong> {grade.ww1_criteria1_score} / {grade.ww1_criteria1_highest}</p>
                <p><strong>WW1 Criteria 2 Score:</strong> {grade.ww1_criteria2_score} / {grade.ww1_criteria2_highest}</p>
                <p><strong>WW1 Criteria 3 Score:</strong> {grade.ww1_criteria3_score} / {grade.ww1_criteria3_highest}</p>
                <p><strong>WW1 Criteria 4 Score:</strong> {grade.ww1_criteria4_score} / {grade.ww1_criteria4_highest}</p>
                <p><strong>WW1 Criteria 5 Score:</strong> {grade.ww1_criteria5_score} / {grade.ww1_criteria5_highest}</p>
                <p><strong>Total Score:</strong> {grade.ww1_total_score} / {grade.ww1_total_highest}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {grades.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-6">No grades found.</p>
      )}

      <Button
        onClick={handleBackToSubjects}
        className="mt-4 w-full"
        variant="outline"
      >
        Back to Subjects
      </Button>
    </div>
  );
}

export default withAuth(StudentGradesPage);
