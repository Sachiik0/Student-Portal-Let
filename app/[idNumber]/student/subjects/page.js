"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

function StudentSubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Fetch subjects for the logged-in student
  const fetchSubjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Retrieve user info from localStorage
      if (!user || !user.idNumber) {
        throw new Error('Unauthorized: Missing user info.');
      }

      // Fetch the student's subjects from the correct API endpoint
      const res = await fetch(`/api/student/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idNumber: user.idNumber,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch subjects.');
      }

      const data = await res.json();

      if (data.length === 0) {
        setError('No subjects found for this student.');
        return;
      }

      setSubjects(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while fetching subjects.');
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Filter subjects based on search query
  const filteredSubjects = subjects.filter((subject) =>
    subject.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <div className="bg-gray-900 text-white py-3 px-6 flex justify-between items-center">
        <span className="text-lg font-bold">📚 Student Subjects</span>
        <div>
          <button onClick={() => router.push('/')} className="text-white underline">
            Log off
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="max-w-6xl mx-auto py-8 px-6">
        <h1 className="text-2xl font-bold">📘 Your Enrolled Subjects</h1>
        <p className="text-gray-700 mt-2">
          Below is the list of subjects you&apos;re enrolled in. Click <strong>&quot;View Grades&quot;</strong> to check your grades.
        </p>
        
        {/* Search Input */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search by subject or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-lg w-full"
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="max-w-6xl mx-auto mb-6 p-4 rounded-lg shadow-lg bg-red-500 text-white">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Display Filtered Subjects */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4">
        {filteredSubjects.map((subject) => (
          <Card key={subject.subject_id} className="shadow-md p-4">
            <CardHeader>
              <CardTitle>{subject.subject_code}</CardTitle>
              <CardDescription>{subject.subject_name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Section:</strong> {subject.section}
              </p>
              <p>
                <strong>Department:</strong> {subject.department}
              </p>
              {subject.teacher_name && (
                <p>
                  <strong>Teacher:</strong> {subject.teacher_name}
                </p>
              )}
              <Button
                onClick={() => {
                  const user = JSON.parse(localStorage.getItem('user')); // Retrieve user info from localStorage
                  if (user && user.idNumber) {
                    const subjectPath = subject.department.toLowerCase() === 'college' 
                      ? `/${user.idNumber}/student/subjects/subject-details/college/${subject.subject_id}`
                      : (subject.department.toLowerCase() === 'ejhs' || subject.department.toLowerCase() === 'shs')
                      ? `/${user.idNumber}/student/subjects/subject-details/ejhs-shs/${subject.subject_id}`
                      : ''; // Add additional department checks if needed

                    if (subjectPath) {
                      router.push(subjectPath);
                    } else {
                      console.error('Invalid department or subject path.');
                    }
                  } else {
                    console.error('User ID number is missing or invalid.');
                  }
                }}
                className="mt-4 w-full"
                variant="outline"
              >
                View Grades
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubjects.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-6">No subjects found.</p>
      )}
    </div>
  );
}

export default withAuth(StudentSubjectsPage);
