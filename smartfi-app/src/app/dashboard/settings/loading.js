import React from 'react';

export default function Loading() {
  return (
    <div className="w-full pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="w-40 h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-64 h-4 bg-gray-200 rounded mt-2 animate-pulse"></div>
      </div>

      {/* Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Card 1 */}
        <div className="h-64 rounded-xl bg-gray-200 animate-pulse"></div>
        {/* Card 2 */}
        <div className="h-64 rounded-xl bg-gray-200 animate-pulse"></div>
        {/* Card 3 */}
        <div className="h-64 rounded-xl bg-gray-200 animate-pulse"></div>
        {/* Card 4 */}
        <div className="h-64 rounded-xl bg-gray-200 animate-pulse"></div>
        {/* Card 5 */}
        <div className="h-64 rounded-xl bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  );
}
