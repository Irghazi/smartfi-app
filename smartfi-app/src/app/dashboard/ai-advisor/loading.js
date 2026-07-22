import React from 'react';

export default function Loading() {
  return (
    <div className="w-full flex flex-col h-[calc(100vh-80px)]">
      {/* Chat Area */}
      <div className="flex-1 overflow-hidden p-4 space-y-6">
        
        {/* Chat Item 1 */}
        <div className="w-3/4 h-16 rounded-2xl rounded-tl-sm bg-gray-200 animate-pulse mt-4"></div>
        <div className="w-1/2 h-12 rounded-2xl rounded-tr-sm bg-gray-300 animate-pulse mt-4 ml-auto"></div>
        
        {/* Chat Item 2 */}
        <div className="w-2/3 h-20 rounded-2xl rounded-tl-sm bg-gray-200 animate-pulse mt-4"></div>
        <div className="w-1/3 h-12 rounded-2xl rounded-tr-sm bg-gray-300 animate-pulse mt-4 ml-auto"></div>
        
        {/* Chat Item 3 */}
        <div className="w-3/4 h-16 rounded-2xl rounded-tl-sm bg-gray-200 animate-pulse mt-4"></div>
      </div>

      {/* Input Area */}
      <div className="w-full h-14 rounded-full mt-4 bg-gray-200 animate-pulse"></div>
    </div>
  );
}
