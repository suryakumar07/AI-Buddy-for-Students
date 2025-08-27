
import React from 'react';
import type { ChatMode } from '../types';

interface ModeSelectorProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  isLoading: boolean;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange, isLoading }) => {
  const baseClasses = "w-full px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const activeClasses = "bg-indigo-600 text-white shadow";
  const inactiveClasses = "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600";

  return (
    <div className="flex justify-center p-1 space-x-2 bg-slate-200 dark:bg-slate-900/50 rounded-lg">
      <button
        onClick={() => onModeChange('exam')}
        className={`${baseClasses} ${currentMode === 'exam' ? activeClasses : inactiveClasses}`}
        disabled={isLoading}
        aria-pressed={currentMode === 'exam'}
      >
        🎓 Exam Prep Buddy
      </button>
      <button
        onClick={() => onModeChange('chat')}
        className={`${baseClasses} ${currentMode === 'chat' ? activeClasses : inactiveClasses}`}
        disabled={isLoading}
        aria-pressed={currentMode === 'chat'}
      >
        💬 General Chat
      </button>
    </div>
  );
};

export default ModeSelector;
