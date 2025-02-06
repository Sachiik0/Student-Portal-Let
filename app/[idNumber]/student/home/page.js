'use client'; // Mark this as a Client Component

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth'; // Import the withAuth HOC

function StudentPage() {
  const params = useParams();
  const { idNumber } = params;
  const router = useRouter();

  // State to store the student's name
  const [studentName, setStudentName] = useState('');
  
  // Fetch student details on component mount
  useEffect(() => {
    const fetchStudentName = async () => {
      try {
        const response = await fetch(`/api/student/student_info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idNumber }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setStudentName(data.name); // Set student name if found
        } else {
          console.error('Failed to fetch student details:', data.error);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };
    
    if (idNumber) {
      fetchStudentName();
    }
  }, [idNumber]);

  // Logout function to clear session and redirect to login
  const handleLogout = () => {
    // Clear user session from localStorage
    localStorage.removeItem('user');
    // Redirect to login page
    router.push(process.env.NEXT_PUBLIC_HOME_URL || '/');
  };

  // Navigate to Subjects page
  const handleGoToSubjects = () => {
    router.push(`/${idNumber}/student/subjects`);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top Navbar */}
      <div className="bg-gray-900 text-white py-3 px-6 flex justify-between items-center">
        <span className="text-lg font-bold">🏠 HOME | Colegio de San Juan de Letran</span>
        <div>
          <span className="mr-4">Hello, {studentName || `Student ${idNumber}`}!</span>
          <button onClick={handleLogout} className="text-white underline">Log off</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-6">
        <h1 className="text-2xl font-bold">📘 The Student Portal</h1>
        <h2 className="text-xl font-semibold mt-2">
          How to View Your Subjects and Grades
        </h2>
        <ul className="list-disc ml-6 mt-2">
          <li>Click on the &quot;Go to Subjects&quot; button.</li>
          <li>View your enrolled subjects and grades.</li>
        </ul>

        <p className="mt-4 font-medium">Currently Logged Email: {studentName ? `${studentName}@letran.edu.ph` : `student${idNumber}@letran.edu.ph`}</p>

        {/* Quick Links */}
        <div className="mt-6 space-y-2">
          <button className="block w-full bg-blue-600 text-white py-2 rounded text-left pl-4">📅 Class Schedule »</button>
          <button className="block w-full bg-blue-600 text-white py-2 rounded text-left pl-4">📖 Google Classroom »</button>

          {/* Button to navigate to Subjects page */}
          <button
            onClick={handleGoToSubjects}
            className="block w-full bg-blue-600 text-white py-2 rounded text-left pl-4 hover:bg-blue-700"
          >
            📝 View Subjects » (Go to Subjects)
          </button>
        </div>

        {/* Announcements Section */}
        <h2 className="mt-6 text-xl font-semibold">📢 Announcements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Announcement Box 1 */}
          <div className="bg-blue-100 p-4 rounded shadow">
            <h3 className="font-bold">Phase 2 Internet and Web Services Downtime</h3>
            <p>Date Posted: February 3, 2023</p>
            <a href="#" className="text-blue-500 underline">View More..</a>
            <hr className="my-2" />
            <h3 className="font-bold">VPAA Memo: Class Modalities Schedule, 2nd Sem AY2022-2023</h3>
            <p>Date Posted: January 10, 2023</p>
            <a href="#" className="text-blue-500 underline">View More..</a>
          </div>

          {/* Announcement Box 2 */}
          <div className="bg-blue-100 p-4 rounded shadow">
            <h3 className="font-bold">Internet and Web Services Downtime</h3>
            <p>Date Posted: January 25, 2023</p>
            <a href="#" className="text-blue-500 underline">View More..</a>
            <hr className="my-2" />
            <h3 className="font-bold">VPAA Memo: Class Modalities Schedule, 2nd Sem AY2022-2023</h3>
            <p>Date Posted: January 5, 2023</p>
            <a href="#" className="text-blue-500 underline">View More..</a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-6 border-t mt-6">
        🏠 HOME | ⚙ Change Google Account | © 2025 - IT Services Department
      </footer>
    </div>
  );
}

export default withAuth(StudentPage); // Wrap the component with withAuth
