'use client';
import { useParams, useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';

function TeacherPage() {
  const params = useParams();
  const { idNumber } = params;
  const router = useRouter();

  // Logout function
  const logout = () => {
    localStorage.removeItem('user'); // Remove session data
    router.push(process.env.NEXT_PUBLIC_HOME_URL || '/');
  };

  // Navigate to Subjects (Replacing Grades Encoding)
  const goToSubjects = () => {
    router.push(`/${idNumber}/teacher/subjects`);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top Navbar */}
      <div className="bg-gray-900 text-white py-3 px-6 flex justify-between items-center">
        <span className="text-lg font-bold">🏠 HOME | Colegio de San Juan de Letran</span>
        <div>
          <span className="mr-4">Hello, Teacher {idNumber}!</span>
          <button onClick={logout} className="text-white underline">Log off</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-6">
        <h1 className="text-2xl font-bold">📘 The Faculty Portal.</h1>
        <h2 className="text-xl font-semibold mt-2">
          How to Create/Link your class schedule to Google Classroom
        </h2>
        <ul className="list-disc ml-6 mt-2">
          <li>Click Class Schedule button.</li>
          <li>Select the school year/semester button.</li>
          <li>Click the View Class List button.</li>
          <li>Create a new Google Classroom or link it to an existing one.</li>
        </ul>

        <p className="mt-4 font-medium">Currently Logged Email: teacher{idNumber}@letran.edu.ph</p>

        {/* Quick Links */}
        <div className="mt-6 space-y-2">
          <button className="block w-full bg-blue-600 text-white py-2 rounded text-left pl-4">📅 Class Schedule »</button>
          <button className="block w-full bg-blue-600 text-white py-2 rounded text-left pl-4">📖 Google Classroom »</button>

          {/* Modified Grades Encoding Button to Go to Subjects */}
          <button
            onClick={goToSubjects}
            className="block w-full bg-blue-600 text-white py-2 rounded text-left pl-4 hover:bg-blue-700"
          >
            📝 Grades Encoding » (Go to Subjects)
          </button>

          <button className="block w-full bg-blue-600 text-white py-2 rounded text-left pl-4">📂 Resources »</button>
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

export default withAuth(TeacherPage);
