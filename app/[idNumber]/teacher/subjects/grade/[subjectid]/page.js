'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GradeForm({ subjectId }) {
  const [grades, setGrades] = useState([]); // State to store student data
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch student grades on component mount or when subjectId changes
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await fetch(`/api/teacher/subjects/grade/get-student`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subjectid: subjectId }), // Pass the subjectId
        });

        const data = await res.json();
        console.log('API Response:', data); // Log API response for debugging

        if (res.ok) {
          setGrades(data.students); // Assuming the response contains a 'students' array
        } else {
          console.error('Error fetching grades:', data.error);
          setError(data.error || 'Failed to fetch grades');
        }
      } catch (err) {
        console.error('Error:', err); // Log the exact error
        setError('Error fetching grades');
      }
    };

    if (subjectId) {
      fetchGrades();
    }
  }, [subjectId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData(e.target);

      // Map over each grade and prepare the submission data
      const gradeData = grades.map((grade) => ({
        subjectid: subjectId, // Include subjectid here
        idnumber: grade.idNumber,
        ww1_criteria1_score: formData.get(`ww1_criteria1_score-${grade.idNumber}`),
        ww1_criteria2_score: formData.get(`ww1_criteria2_score-${grade.idNumber}`),
        ww1_criteria3_score: formData.get(`ww1_criteria3_score-${grade.idNumber}`),
        ww1_criteria4_score: formData.get(`ww1_criteria4_score-${grade.idNumber}`),
        ww1_criteria5_score: formData.get(`ww1_criteria5_score-${grade.idNumber}`),
        ww1_criteria1_highest: formData.get(`ww1_criteria1_highest-${grade.idNumber}`),
        ww1_criteria2_highest: formData.get(`ww1_criteria2_highest-${grade.idNumber}`),
        ww1_criteria3_highest: formData.get(`ww1_criteria3_highest-${grade.idNumber}`),
        ww1_criteria4_highest: formData.get(`ww1_criteria4_highest-${grade.idNumber}`),
        ww1_criteria5_highest: formData.get(`ww1_criteria5_highest-${grade.idNumber}`),
        ww1_total_highest: formData.get(`ww1_total_highest-${grade.idNumber}`),
      }));

      // Send grade data to the server
      const res = await fetch(`/api/teacher/subjects/${subjectId}/grade-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradeData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit grades.');
      }

      alert('Grades submitted successfully!');
      router.push('/teacher/subjects');
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while submitting grades.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle return home action
  const handleReturnHome = () => {
    router.push('/'); // Navigate to the home page or another desired page
  };

  return (
    <div className="max-w-full mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Submit Grades for Subject {subjectId}</h1>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Grade submission form */}
      <form onSubmit={handleSubmit} className="overflow-x-auto w-full">
        <div className="overflow-x-auto max-w-full">
          <table className="table-auto w-full border-collapse border border-gray-300">
            {/* Criteria Row */}
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Name</th>
                {[1, 2, 3, 4, 5].map((criteria) => (
                  <th key={criteria} className="border border-gray-300 p-2">
                    Criteria {criteria}
                  </th>
                ))}
              </tr>
              
              {/* Highest Scores Row */}
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Highest</th>
                {[1, 2, 3, 4, 5].map((criteria) => (
                  <th key={`highest-${criteria}`} className="border border-gray-300 p-2">
                    <input
                      type="number"
                      name={`ww1_criteria${criteria}_highest`}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Highest"
                    />
                  </th>
                ))}
              </tr>
            </thead>

            {/* Student Data Rows */}
            <tbody>
              {grades.length > 0 ? (
                grades.map((grade) => (
                  <tr key={grade.idNumber} className="text-center">
                    <td className="border border-gray-300 p-2">{grade.name}</td>
                    {[1, 2, 3, 4, 5].map((criteria) => (
                      <td key={`score-${criteria}-${grade.idNumber}`} className="border border-gray-300 p-2">
                        <input
                          type="number"
                          name={`ww1_criteria${criteria}_score-${grade.idNumber}`}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter score"
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">No students enrolled</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2 px-6 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Grades'}
          </button>
        </div>
      </form>

      {/* Return Home Button */}
      <div className="text-center mt-4">
        <button
          onClick={handleReturnHome}
          className="py-2 px-6 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
