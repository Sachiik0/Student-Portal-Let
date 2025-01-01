'use client';
import { useParams, useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';

function TeacherPage() {
  const params = useParams();
  const { idNumber } = params;
  const router = useRouter();

  // Logout function to clear session and redirect
  const logout = () => {
    // Clear user session data (localStorage or cookies)
    localStorage.removeItem('user'); // If using localStorage
    // Redirect to home page
    router.push(process.env.NEXT_PUBLIC_HOME_URL || '/');
  };

  // Navigate to Subjects page
  const goToSubjects = () => {
    router.push(`/${idNumber}/teacher/subjects`); // Redirect to the subjects page for the teacher
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Teacher Profile</h1>
      <p className="text-lg">Welcome, Teacher ID: {idNumber}</p>
      {/* Add more content here to display the teacher's information */}
      
      {/* Logout Button */}
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
      
      {/* Button to navigate to Subjects page */}
      <button
        onClick={goToSubjects}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Subjects
      </button>
    </div>
  );
}

export default withAuth(TeacherPage);
