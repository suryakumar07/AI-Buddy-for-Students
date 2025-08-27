
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
      <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Hang on tight!</p>
      <p className="text-slate-500 dark:text-slate-400">Your personal study guide is being crafted by AI...</p>
    </div>
  );
};

export default LoadingSpinner;
