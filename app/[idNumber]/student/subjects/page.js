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

  // Fetch grades for the selected subject
  const fetchGrades = async (subjectId, department) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.idNumber) {
        throw new Error('Unauthorized: Missing user info.');
      }

      // Normalize department
      const normalizedDepartment = department?.trim().toUpperCase();

      console.log('Department:', normalizedDepartment); // Debug log to verify department value

      // Set the endpoint based on department
      const endpoint =
        normalizedDepartment === 'COLLEGE'
          ? '/api/student/grades/college'
          : '/api/student/grades/ejhs-shs';

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
      setGrades(data.grades);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while fetching grades.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push(process.env.NEXT_PUBLIC_BASE_URL || '/');
  };

  // Show modal with subject, user details, and grades
  const handleViewGrades = (subjectId, department) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.idNumber) {
      const subject = subjects.find((sub) => sub.subject_id === subjectId);
      setSelectedSubject({
        subjectId,
        idNumber: user.idNumber,
        department: subject?.department?.trim(),
      });
      fetchGrades(subjectId, subject?.department?.trim());
      setShowModal(true);
    } else {
      setError('Unauthorized: Missing user info.');
    }
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedSubject(null);
    setGrades([]);
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
        <Alert variant="destructive" className="max-w-6xl mx-auto mb-6 p-4 rounded-lg shadow-lg bg-red-500 text-white">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Display Subjects */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4">
        {subjects.map((subject) => (
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
                onClick={() => handleViewGrades(subject.subject_id, subject.department)}
                className={`mt-4 w-full ${showModal ? 'opacity-50 cursor-not-allowed' : ''}`} // Disable button when modal is open
                variant="outline"
                disabled={showModal} // Disable the button when modal is open
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

      {/* Modal for showing subject, ID number, and grades */}
      {showModal && selectedSubject && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Grades for Subject</h3>
            <div className="space-y-6">
              <p>
                <strong className="font-medium">Subject ID:</strong> {selectedSubject.subjectId}
              </p>
              <p>
                <strong className="font-medium">Student ID:</strong> {selectedSubject.idNumber}
              </p>
              <p>
                <strong className="font-medium">Department:</strong> {selectedSubject.department}
              </p>

              {/* Display grades */}
              {grades && Object.keys(grades).length > 0 ? (
                <div>
                  <h4 className="font-medium text-lg">Grades:</h4>
                  <ul className="space-y-3 overflow-y-auto max-h-60">
                    {Object.entries(grades).map(([key, value]) => (
                      <li key={key}>
                        <p>
                          <strong className="font-medium">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}:
                          </strong>{' '}
                          {value}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500">No grades found for this subject.</p>
              )}

              <div className="mt-6 flex justify-end space-x-4">
                <Button onClick={closeModal} variant="outline" className="px-6 py-2">
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
