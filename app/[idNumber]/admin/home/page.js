'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newSubject, setNewSubject] = useState({
    subject_code: '',
    subject_name: '',
    teacherid: '',
    department: '',
    section: '',
  });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    year: '',
    password: '',
  });
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [studentIds, setStudentIds] = useState('');

  const router = useRouter();

  // Fetch all subjects
  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/admin/subjects/get-subject');
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

  // Fetch enrolled students for a subject
  const fetchEnrolledStudents = async (subjectCode) => {
    try {
      const response = await fetch('/api/admin/subjects/get-enrolled-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject_code: subjectCode }),
      });
      const data = await response.json();
      if (response.ok) {
        setEnrolledStudents(data);
      } else {
        setMessage('Failed to fetch enrolled students.');
      }
    } catch (error) {
      console.error('Failed to fetch enrolled students:', error);
      setMessage('Failed to fetch enrolled students.');
    }
  };

  // Add a new subject
  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/subjects/add-subject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject),
      });

      if (response.ok) {
        setMessage('Subject added successfully!');
        fetchSubjects();
        setShowAddForm(false);
        setNewSubject({ subject_code: '', subject_name: '', teacherid: '', department: '', section: '' });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to add subject.');
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  // Add a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users/add-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setMessage('User added successfully!');
        setShowAddUserForm(false);
        setNewUser({ name: '', email: '', role: '', year: '', password: '' });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to add user.');
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  // Enroll students in a subject
  const handleEnrollStudents = async (e) => {
    e.preventDefault();
  
    // Prepare the payload
    const payload = {
      subject_id: selectedSubject, // Ensure this is the selected subject's ID
      student_ids: studentIds.split(",").map((id) => id.trim()), // Convert comma-separated IDs to an array
    };
  
    try {
      const response = await fetch("/api/admin/subjects/student/${}", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        setMessage(`Successfully enrolled students in subject ${selectedSubject}`);
        setShowEnrollForm(false);
        setStudentIds(""); // Clear input
        fetchEnrolledStudents(selectedSubject); // Update the list of enrolled students
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
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

      {/* Add User Button */}
      <button
        onClick={() => setShowAddUserForm(true)}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mt-4"
      >
        Add New User
      </button>

      {/* Add User Form Modal */}
      {showAddUserForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md shadow-md w-1/3">
            <h3 className="text-xl font-bold mb-4">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-6">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full p-3 border rounded-md"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full p-3 border rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Role"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full p-3 border rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Year"
                value={newUser.year}
                onChange={(e) => setNewUser({ ...newUser, year: e.target.value })}
                className="w-full p-3 border rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full p-3 border rounded-md"
                required
              />
              <div className="flex space-x-4">
                <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                  Add User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserForm(false)}
                  className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
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
                  <td className="border px-4 py-2">{subject.teacherid}</td>
                  <td className="border px-4 py-2">{subject.department}</td>
                  <td className="border px-4 py-2">{subject.section}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => {
                        setSelectedSubject(subject.subject_code);
                        fetchEnrolledStudents(subject.subject_code);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      View Enrolled Students
                    </button>
                    <button
                      onClick={() => setShowEnrollForm(true)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mt-2"
                    >
                      Enroll Students
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Enrolled Students Table */}
      {enrolledStudents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold">Enrolled Students for {selectedSubject}</h3>
          <ul className="mt-4">
            {enrolledStudents.map((student) => (
              <li key={student.idnumber} className="text-lg">{student.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Enroll Form */}
      {showEnrollForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md shadow-md w-1/3">
            <h3 className="text-xl font-bold mb-4">Enroll Students</h3>
            <form onSubmit={handleEnrollStudents} className="space-y-6">
              <textarea
                placeholder="Enter Student IDs (comma separated)"
                value={studentIds}
                onChange={(e) => setStudentIds(e.target.value)}
                className="w-full p-3 border rounded-md"
                rows="4"
                required
              />
              <div className="flex space-x-4">
                <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                  Enroll Students
                </button>
                <button
                  type="button"
                  onClick={() => setShowEnrollForm(false)}
                  className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
