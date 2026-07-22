import React from 'react';

export default function Loading() {
  return (
    <div className="w-full animate-pulse">
      {/* Header Area */}
      <div className="flex justify-between items-center">
        <div className="w-48 h-8 bg-gray-200 rounded"></div>
        <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Filter/Tab Area */}
      <div className="w-full h-12 bg-gray-200 rounded-lg mt-6"></div>

      {/* Table Area */}
      <div className="w-full h-96 bg-gray-200 rounded-xl mt-4"></div>
    </div>
  );
}
