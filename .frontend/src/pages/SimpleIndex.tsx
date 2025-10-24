import React from 'react';

const SimpleIndex = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">BMIET Portal</h1>
            <div className="space-x-4">
              <a href="/courses" className="text-blue-600 hover:underline">Courses</a>
              <a href="/news" className="text-blue-600 hover:underline">News</a>
              <a href="/login" className="text-blue-600 hover:underline">Login</a>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to BMIET Portal</h1>
          <p className="text-lg text-gray-600 mb-8">Your gateway to engineering excellence</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Courses</h3>
              <p className="text-gray-600">Explore our engineering programs</p>
              <a href="/courses" className="text-blue-600 hover:underline">View Courses</a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">News</h3>
              <p className="text-gray-600">Latest campus news and updates</p>
              <a href="/news" className="text-blue-600 hover:underline">Read News</a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Login</h3>
              <p className="text-gray-600">Access your student portal</p>
              <a href="/login" className="text-blue-600 hover:underline">Login</a>
            </div>
          </div>
          
          <div className="mt-12">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded max-w-md mx-auto">
              ✅ Frontend is working correctly! React Router is functional.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleIndex;
