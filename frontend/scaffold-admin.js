const fs = require('fs');
const path = require('path');

const routes = [
  'revenue', 'logs', 'verifications', 'hotels', 'agencies', 'guides', 'users', 'analytics', 'trends', 'reports', 'content', 'support', 'broadcast', 'settings'
];

routes.forEach(route => {
  const dirPath = path.join('src', 'app', 'admin', route);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const content = `"use client";

import React from "react";

export default function ${route.charAt(0).toUpperCase() + route.slice(1)}Page() {
  return (
    <div className="bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-sm p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>${route.charAt(0).toUpperCase() + route.slice(1)} Module</h1>
      <p className="text-[#4A5A62] dark:text-[#A9BCC2] mt-2">This module is currently under development. Mock data integration pending.</p>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});
console.log('Pages created successfully.');
