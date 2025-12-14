// src/components/CityCardSkeleton.jsx
import React from 'react';

export default function CityCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm border border-gray-100 animate-pulse">
      <div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div> 
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-8 w-8 bg-gray-200 rounded-full"></div> 
    </div>
  );
}