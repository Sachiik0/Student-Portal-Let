'use client'; // Mark this as a Client Component

import { useParams, useRouter } from 'next/navigation';

export default function AdminPage() {
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

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin Profile</h1>
      <p className="text-lg">Welcome, Admin ID: {idNumber}</p>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
