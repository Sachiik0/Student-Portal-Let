'use client'; // Mark this as a Client Component

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true); // State to track loading status

    useEffect(() => {
      // Check for user session in localStorage or cookies
      const user = localStorage.getItem('user'); // Check if user is in localStorage
      if (!user) {
        // Redirect to login if no user is found in localStorage
        router.push('/login');
      } else {
        // User exists, proceed to render the component
        setLoading(false);
      }
    }, [router]);

    // If the user is not authenticated, show loading spinner or nothing
    if (loading) {
      return <div>Loading...</div>; // You can replace this with a loading spinner
    }

    // If user is authenticated, render the wrapped component
    return <WrappedComponent {...props} />;
  };

  // Set displayName for debugging purposes
  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
