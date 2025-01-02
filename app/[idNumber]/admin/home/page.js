'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubject, setNewSubject] = useState({
    subject_code: '',
    subject_name: '',
    idnumber: '',
    department: '',
    section: '',
  });

  const router = useRouter();

  // Fetch all subjects
  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/admin/subjects/get-subject'); // Correct path
      const data = await response.json();
      if (response.ok) {
        setSubjects(data);
      } else {
        setMessage('Failed to fetch subjects.');
      }
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      setMessage('Failed to fetch subjects.');
    }
  };
  

  // Delete a subject
  const handleDeleteSubject = async (subjectCode) => {
    try {
      const response = await fetch('/api/admin/subjects/delete-subject', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject_code: subjectCode }),
      });

      if (response.ok) {
        setMessage('Subject deleted successfully!');
        fetchSubjects(); // Refresh the list after deletion
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to delete subject.');
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  // Add a new subject
  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/subjects/add-subject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubject),
      });

      if (response.ok) {
        setMessage('Subject added successfully!');
        fetchSubjects(); // Refresh the list after adding
        setShowAddForm(false); // Close the form
        setNewSubject({ subject_code: '', subject_name: '', idnumber: '', department: '', section: '' }); // Reset form
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to add subject.');
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <h2 className="text-2xl font-semibold mt-6">Manage Subjects</h2>

      {/* Add Subject Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add New Subject
      </button>

      {/* Add Subject Form */}
      {showAddForm && (
        <div className="mt-6 p-6 bg-gray-100 rounded-md shadow-md">
          <h3 className="text-xl font-bold mb-4">Add New Subject</h3>
          <form onSubmit={handleAddSubject} className="space-y-6">
            <input
              type="text"
              placeholder="Subject Code"
              value={newSubject.subject_code}
              onChange={(e) => setNewSubject({ ...newSubject, subject_code: e.target.value })}
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Subject Name"
              value={newSubject.subject_name}
              onChange={(e) => setNewSubject({ ...newSubject, subject_name: e.target.value })}
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Teacher ID"
              value={newSubject.idnumber}
              onChange={(e) => setNewSubject({ ...newSubject, idnumber: e.target.value })}
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={newSubject.department}
              onChange={(e) => setNewSubject({ ...newSubject, department: e.target.value })}
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Section"
              value={newSubject.section}
              onChange={(e) => setNewSubject({ ...newSubject, section: e.target.value })}
              className="w-full p-3 border rounded-md"
              required
            />
            <div className="flex space-x-4">
              <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                Add Subject
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Subjects Table */}
      <div className="overflow-x-auto mt-8">
        {subjects.length === 0 ? (
          <p>No subjects available.</p>
        ) : (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Subject Code</th>
                <th className="border px-4 py-2">Subject Name</th>
                <th className="border px-4 py-2">Teacher ID</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Section</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.subject_code}>
                  <td className="border px-4 py-2">{subject.subject_code}</td>
                  <td className="border px-4 py-2">{subject.subject_name}</td>
                  <td className="border px-4 py-2">{subject.idnumber}</td>
                  <td className="border px-4 py-2">{subject.department}</td>
                  <td className="border px-4 py-2">{subject.section}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDeleteSubject(subject.subject_code)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`mt-6 p-4 ${message.includes('successfully') ? 'bg-green-200' : 'bg-red-200'}`}>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
