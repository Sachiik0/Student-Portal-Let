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
  const [showModal, setShowModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [grades, setGrades] = useState([]);
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
        method: 'POST', // Use POST method to send data
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idNumber: user.idNumber, // Pass student ID here
        }),
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

  // Fetch grades for the selected subject
  const fetchGrades = async (subjectId, department) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.idNumber) {
        throw new Error('Unauthorized: Missing user info.');
      }

      // Normalize department: trim and convert to uppercase
      const normalizedDepartment = department?.trim().toUpperCase(); // Ensure it is trimmed and uppercase

      console.log('Department:', normalizedDepartment); // Debug log to verify department value

      // Check if the department is 'COLLEGE' (case-insensitive) and set the endpoint
      const endpoint = normalizedDepartment === 'COLLEGE'
        ? '/api/student/grades/college'
        : '/api/student/grades/ejhs-shs';

      // Fetch grades for the selected subject
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idNumber: user.idNumber,
          subjectId: subjectId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch grades.');
      }

      const data = await res.json();
      setGrades(data.grades); // Set grades for the selected subject
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while fetching grades.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear session
    router.push(process.env.NEXT_PUBLIC_BASE_URL || '/'); // Redirect to home
  };

  // Show modal with subject, user details, and grades
  const handleViewGrades = (subjectId, department) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.idNumber) {
      const subject = subjects.find(sub => sub.subject_id === subjectId);
      setSelectedSubject({
        subjectId,
        idNumber: user.idNumber,
        department: subject?.department?.trim(), // Trim spaces to avoid issues with comparison
      });
      fetchGrades(subjectId, subject?.department?.trim()); // Pass trimmed department value
      setShowModal(true);
    } else {
      setError('Unauthorized: Missing user info.');
    }
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedSubject(null);
    setGrades([]); // Clear grades when closing the modal
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <div className="bg-gray-900 text-white py-3 px-6 flex justify-between items-center">
        <span className="text-lg font-bold">📚 Student Subjects</span>
        <div>
          <button onClick={handleLogout} className="text-white underline">
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
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="max-w-6xl mx-auto mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Display Subjects */}
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
                onClick={() => handleViewGrades(subject.subject_id, subject.department)}
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

      {/* Modal for showing subject, idNumber, and grades */}
      {showModal && selectedSubject && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">Grades for Subject</h3>
            <div className="space-y-4">
              <p>
                <strong>Subject ID:</strong> {selectedSubject.subjectId}
              </p>
              <p>
                <strong>Student ID:</strong> {selectedSubject.idNumber}
              </p>
              
              {/* Add department here */}
              <p>
                <strong>Department:</strong> {selectedSubject.department}
              </p>

              {/* Display grades here */}
              {grades && Object.keys(grades).length > 0 ? (
                <div>
                  <h4 className="font-medium">Grades:</h4>
                  <ul className="space-y-2 overflow-y-auto max-h-60">
                    {Object.entries(grades).map(([key, value]) => (
                      <li key={key}>
                        <p>
                          <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}:</strong> {value}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No grades found for this subject.</p>
              )}
              
              <div className="mt-4 flex justify-end space-x-4">
                <Button onClick={closeModal} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(StudentSubjectsPage);
