
import React from 'react';

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993V21H2V3.993zM4 5v14h16V5H4zm2 2h12v2H6V7zm0 4h12v2H6v-2zm0 4h6v2H6v-2z" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center gap-3">
            <BookIcon />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              AI Study Buddy
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
