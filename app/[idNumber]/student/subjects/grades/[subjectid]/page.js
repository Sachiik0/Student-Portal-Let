'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

function GradesPage() {
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { idNumber, subjectId } = router.query; // Access idNumber and subjectId from the URL

  // Fetch grades for the selected student and subject
  const fetchGrades = async () => {
    if (!idNumber || !subjectId) return; // Ensure idNumber and subjectId are available before making the request

    setLoading(true); // Start loading state
    setError(''); // Clear previous errors

    try {
      const res = await fetch(`/api/student/grades/${idNumber}/${subjectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch grades.');
      }

      const data = await res.json();
      if (data.length === 0) {
        setError('No grades available for this subject.');
        return;
      }

      setGrades(data.grades); // Set grades for the selected subject
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while fetching grades.');
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [idNumber, subjectId]); // Re-fetch when idNumber or subjectId changes

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="max-w-6xl mx-auto mb-6 p-4 rounded-lg shadow-lg bg-red-500 text-white">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading grades...</p>
        </div>
      )}

      {/* Display Grades */}
      {!loading && grades.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold">Grades</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {grades.map((grade, index) => (
              <Card key={index} className="shadow-md p-4">
                <CardHeader>
                  <CardTitle>{grade.subject_code}</CardTitle>
                  <CardDescription>{grade.subject_name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Grade:</strong> {grade.grade}</p>
                  <p><strong>Term:</strong> {grade.term}</p>
                  <p><strong>Remarks:</strong> {grade.remarks}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Grades Available */}
      {!loading && grades.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-gray-500">No grades available for this subject.</p>
        </div>
      )}
    </div>
  );
}

export default GradesPage;
