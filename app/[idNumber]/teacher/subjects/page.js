'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

function TeacherSubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const [isUploadCardOpen, setIsUploadCardOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [file, setFile] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const router = useRouter();

  // Retrieve user data safely
  const user = JSON.parse(localStorage.getItem('user'));
  const idNumber = user?.idNumber; // Ensure idNumber exists

  const fetchSubjects = async () => {
    try {
      if (!idNumber) {
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
      setSubjects(data.subjects);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching subjects.');
    }
  };

  const handleGradeSubject = (subject) => {
    setSelectedSubject(subject);
    setIsUploadCardOpen(true);
    
    const storedLastUpdated = localStorage.getItem(`lastUpdated_${subject.subject_id}`);
    setLastUpdated(storedLastUpdated || 'No updates yet');
  };

  const handleModalClose = () => {
    setIsUploadCardOpen(false);
    setFile(null);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    if (!selectedSubject || !selectedSubject.subject_id || !selectedSubject.department) {
      setError('Missing subject details.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject_id', selectedSubject.subject_id);
    formData.append('department', selectedSubject.department);
  
    let apiUrlgrades;
    let apiUrlcriteria;
    let apiUrlhighest;
  
    if (selectedSubject.department.toUpperCase() === 'COLLEGE') {
      apiUrlgrades = '/api/teacher/subjects/grade/upload/college';
      apiUrlcriteria = '/api/teacher/subjects/grade/criteria/college';
      apiUrlhighest = '/api/teacher/subjects/grade/highest-score/college';
    } else if (selectedSubject.department === 'SENIOR HIGH SCHOOL' || selectedSubject.department === 'EJHS' || selectedSubject.department === 'SHS') {
      apiUrlgrades = '/api/teacher/subjects/grade/upload/ejhs-shs';
      apiUrlcriteria = '/api/teacher/subjects/grade/criteria/ejhs-shs';
      apiUrlhighest = '/api/teacher/subjects/grade/highest-score/ejhs-shs';
    } else {
      setError('Unsupported department.');
      return;
    }
  
    try {
      const resGrades = await fetch(apiUrlgrades, {
        method: 'POST',
        body: formData,
      });
      const resGradesData = await resGrades.json(); // Logging response for debugging
      console.log('Grades Upload Response:', resGradesData);
      if (!resGrades.ok) {
        throw new Error(resGradesData.error || 'Failed to upload the file. Please try again.');
      }
  
      const resCriteria = await fetch(apiUrlcriteria, {
        method: 'POST',
        body: formData,
      });
      const resCriteriaData = await resCriteria.json(); // Logging response for debugging
      console.log('Criteria Upload Response:', resCriteriaData);
      if (!resCriteria.ok) {
        throw new Error(resCriteriaData.error || 'Failed to upload the criteria. Please try again.');
      }
  
      const resHighestscore = await fetch(apiUrlhighest, {
        method: 'POST',
        body: formData,
      });
      const resHighestscoreData = await resHighestscore.json(); // Logging response for debugging
      console.log('Highest Score Upload Response:', resHighestscoreData);
      if (!resHighestscore.ok) {
        throw new Error(resHighestscoreData.error || 'Failed to upload the highest score. Please try again.');
      }
  
      const lastUpdatedTime = new Date().toLocaleString();
      localStorage.setItem(`lastUpdated_${selectedSubject.subject_id}`, lastUpdatedTime);
  
      alert('File uploaded successfully!');
      setLastUpdated(lastUpdatedTime);
      handleModalClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Upload error: ${err.message || 'An unexpected error occurred.'}`);
    }
  };
  

  

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <div className="bg-gray-900 text-white py-3 px-6 flex justify-between items-center">
        <span className="text-lg font-bold">📚 Subjects | Colegio de San Juan de Letran</span>
        <div>
          <button onClick={() => idNumber && router.push(`/${idNumber}/teacher/home`)} className="text-white underline mr-4">
            Back to Dashboard
          </button>
          <button onClick={() => { localStorage.removeItem('user'); router.push('/'); }} className="text-white underline">
            Log off
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="max-w-6xl mx-auto py-8 px-6">
        <h1 className="text-2xl font-bold">📘 Your Assigned Subjects</h1>
        <p className="text-gray-700 mt-2">
          Below is the list of subjects assigned to you. Click <strong>&quot;Grade&quot;</strong> to upload grades.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="max-w-6xl mx-auto mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Subjects List */}
      <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.subject_id} className="shadow-md border">
            <CardHeader>
              <CardTitle className="text-lg">{subject.subject_code}</CardTitle>
              <CardDescription className="text-gray-600">{subject.subject_name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p><strong>Section:</strong> {subject.section}</p>
              <p><strong>Department:</strong> {subject.department}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button onClick={() => handleGradeSubject(subject)} variant="primary">
                Grade
              </Button>
              <p className="text-xs text-gray-500">
                Last Updated: {localStorage.getItem(`lastUpdated_${subject.subject_id}`) || 'No updates yet'}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Upload Modal */}
      { isUploadCardOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Upload Grades for {selectedSubject.subject_name}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Last Updated:</strong> {lastUpdated}
            </p>
            <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" className="mb-4 w-full border p-2 rounded" />
            <div className="flex justify-end">
              <Button onClick={handleModalClose} variant="outline" className="mr-2">Cancel</Button>
              <Button onClick={handleSubmit} variant="primary">Upload</Button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-gray-500 py-6 border-t mt-6">
        📚 Subjects | ⚙ Change Google Account | © 2025 - IT Services Department
      </footer>
    </div>
  );
}

export default TeacherSubjectsPage;
