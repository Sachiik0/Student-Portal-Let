'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [showEnrolledStudentsModal, setShowEnrolledStudentsModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newSubject, setNewSubject] = useState({
    subject_id: '',
    subject_name: '',
    subject_code: '',
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
  const fetchEnrolledStudents = async (subjectId) => {
    console.log('Fetching enrolled students for subject ID:', subjectId);
    
    try {
      const response = await fetch('/api/admin/users/get-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjectid: subjectId }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);  // Check the structure of data
        
        // Directly use the array of students from the response
        if (Array.isArray(data)) {
          setEnrolledStudents(data); // Set the students data
          setShowEnrolledStudentsModal(true);  // Show the modal
        } else {
          setMessage('No students found.');
        }
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || 'Failed to fetch enrolled students.'}`);
      }
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
      setMessage('An error occurred while fetching enrolled students.');
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
        setNewSubject({
          subject_name: '',
          subject_code: '',
          teacherid: '',
          department: '',
          section: ''
        });
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
      const response = await fetch('/api/admin/users/add-user', {
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

    const payload = {
      subject_id: selectedSubject,
      student_ids: studentIds.split(',').map((id) => id.trim()),
    };

    try {
      const response = await fetch('/api/admin/users/add-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage(`Successfully enrolled students in subject ${selectedSubject}`);
        setShowEnrollForm(false);
        setStudentIds('');
        fetchEnrolledStudents(selectedSubject);
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

      <button
        onClick={() => setShowAddForm(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add New Subject
      </button>

      <button
        onClick={() => setShowAddUserForm(true)}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mt-4"
      >
        Add New User
      </button>

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
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md shadow-md w-1/3">
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
                value={newSubject.teacherid}
                onChange={(e) => setNewSubject({ ...newSubject, teacherid: e.target.value })}
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
                <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
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
        </div>
      )}

      {subjects.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Subjects</h3>
          <table className="table-auto w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Subject Code</th>
                <th className="py-2 px-4 border">Subject Name</th>
                <th className="py-2 px-4 border">Department</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.subject_id}>
                  <td className="py-2 px-4 border">{subject.subject_code}</td>
                  <td className="py-2 px-4 border">{subject.subject_name}</td>
                  <td className="py-2 px-4 border">{subject.department}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => fetchEnrolledStudents(subject.subject_id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View Enrolled Students
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {message && <p className="text-red-500 mt-4">{message}</p>}

      {showEnrolledStudentsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md shadow-md w-1/3">
            <h3 className="text-xl font-bold mb-4">Enrolled Students</h3>
            {enrolledStudents.length > 0 ? (
              <ul className="space-y-2">
                {enrolledStudents.map((student) => (
                  <li key={student.student_id} className="border-b pb-2">
                    <p>{student.name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No students enrolled in this subject.</p>
            )}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setShowEnrolledStudentsModal(false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
