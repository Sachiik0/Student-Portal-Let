'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

function TeacherSubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const [isUploadCardOpen, setIsUploadCardOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [file, setFile] = useState(null);

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
      setSubjects(data.subjects);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching subjects.');
    }
  };

  const handleGradeSubject = (subject) => {
    setSelectedSubject(subject);
    setIsUploadCardOpen(true);
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

    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject_id', selectedSubject.subject_id);
    formData.append('department', selectedSubject.department);

    let apiUrl;
    if (selectedSubject.department === 'COLLEGE') {
      apiUrl = '/api/teacher/upload/college';
    } else if (selectedSubject.department === 'SENIOR HIGH SCHOOL' || selectedSubject.department === 'EJHS') {
      apiUrl = '/api/teacher/upload/ejhs-shs';
    } else {
      setError('Unsupported department.');
      return;
    }

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to upload the file. Please try again.');
      }

      alert('File uploaded successfully!');
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Teacher Subjects</h1>
        <Button onClick={() => { /* logout logic */ }} variant="outline">
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
              <p><strong>Section:</strong> {subject.section}</p>
              <p><strong>Department:</strong> {subject.department}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleGradeSubject(subject)} variant="primary">
                Grade
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      { isUploadCardOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Upload Grades for {selectedSubject.subject_name}</h2>
            <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" className="mb-4" />
            <div className="flex justify-end">
              <Button onClick={handleModalClose} variant="outline" className="mr-2">Cancel</Button>
              <Button onClick={handleSubmit} variant="primary">Upload</Button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherSubjectsPage;