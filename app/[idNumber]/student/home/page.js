'use client'; // Mark this as a Client Component

import { useParams, useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth'; // Import the withAuth HOC

function StudentPage() {
  const params = useParams();
  const { idNumber } = params;
  const router = useRouter();

  // Logout function to clear session and redirect to login
  const handleLogout = () => {
    // Clear user session from localStorage
    localStorage.removeItem('user');
    // Redirect to login page
    router.push(process.env.NEXT_PUBLIC_HOME_URL || '/');
  };

  // Navigate to Subjects page
  const handleGoToSubjects = () => {
    router.push(`/${idNumber}/subjects`);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Student Profile</h1>
      <p className="text-lg">Welcome, Student ID: {idNumber}</p>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>

      {/* Button to navigate to Subjects page */}
      <button
        onClick={handleGoToSubjects}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Subjects
      </button>
    </div>
  );
}

export default withAuth(StudentPage); // Wrap the component with withAuth
