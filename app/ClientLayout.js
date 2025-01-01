// app/ClientLayout.js
"use client"; // Mark this as a Client Component

import { AuthProvider } from '@/context/AuthContext';

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}