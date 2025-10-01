// src/app/admin/layout.jsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      // Verify token
      try {
        const session = JSON.parse(atob(token));
        setAdmin(session);
      } catch {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f9158]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#2f9158] to-[#2969a7] rounded-lg"></div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {admin.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}
