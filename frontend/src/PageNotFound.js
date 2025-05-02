import React from 'react';

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">403 Forbidden</h1>
        <p className="text-xl mt-4">You do not have permission to access this page.</p>
      </div>
    </div>
  );
};

export default PageNotFound;
