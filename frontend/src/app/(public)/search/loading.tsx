import React from "react";

export default function SearchLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-80 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
}
