'use client'; // Add this line at the top to mark the file as a client component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GradeForm({ subjectId }) {
  const [grades, setGrades] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await fetch(`/api/teacher/subjects/${subjectId}/grades`);
        const data = await res.json();
        if (res.ok) {
          setGrades(data.grades);
        } else {
          setError(data.error || 'Failed to fetch grades');
        }
      } catch (err) {
        setError('Error fetching grades');
      }
    };

    fetchGrades();
  }, [subjectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData(e.target);

      const gradeData = grades.map((grade) => ({
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

      const res = await fetch(`/api/teacher/subjects/${subjectId}/grade-subject`, {
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Submit Grades for Subject {subjectId}</h1>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {grades.map((grade) => (
          <div key={grade.idNumber} className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{grade.name} (ID: {grade.idNumber})</h3>

            {/* Input Fields for Scores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor={`ww1_criteria1_score-${grade.idNumber}`} className="block text-sm font-medium text-gray-700">Criteria 1 Score</label>
                <input
                  type="number"
                  id={`ww1_criteria1_score-${grade.idNumber}`}
                  name={`ww1_criteria1_score-${grade.idNumber}`}
                  className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                  required
                  placeholder="Enter score"
                />
              </div>

              <div>
                <label htmlFor={`ww1_criteria1_highest-${grade.idNumber}`} className="block text-sm font-medium text-gray-700">Criteria 1 Highest</label>
                <input
                  type="number"
                  id={`ww1_criteria1_highest-${grade.idNumber}`}
                  name={`ww1_criteria1_highest-${grade.idNumber}`}
                  className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                  required
                  placeholder="Enter highest score"
                />
              </div>
            </div>

            {/* Add the other criteria fields here (Criteria 2-5) */}
            {['2', '3', '4', '5'].map((criteriaNum) => (
              <div key={criteriaNum} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor={`ww1_criteria${criteriaNum}_score-${grade.idNumber}`} className="block text-sm font-medium text-gray-700">
                    Criteria {criteriaNum} Score
                  </label>
                  <input
                    type="number"
                    id={`ww1_criteria${criteriaNum}_score-${grade.idNumber}`}
                    name={`ww1_criteria${criteriaNum}_score-${grade.idNumber}`}
                    className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                    required
                    placeholder="Enter score"
                  />
                </div>

                <div>
                  <label htmlFor={`ww1_criteria${criteriaNum}_highest-${grade.idNumber}`} className="block text-sm font-medium text-gray-700">
                    Criteria {criteriaNum} Highest
                  </label>
                  <input
                    type="number"
                    id={`ww1_criteria${criteriaNum}_highest-${grade.idNumber}`}
                    name={`ww1_criteria${criteriaNum}_highest-${grade.idNumber}`}
                    className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                    required
                    placeholder="Enter highest score"
                  />
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 py-2 px-6 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Grades'}
          </button>
        </div>
      </form>
    </div>
  );
}
