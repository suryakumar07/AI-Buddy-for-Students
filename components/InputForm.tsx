
import React, { useState } from 'react';
import type { ChatMode } from '../types';

interface InputFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  mode: ChatMode;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, mode }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSubmit(query);
    setQuery(''); // Clear input after submit
  };
  
  const placeholderText = mode === 'exam' 
    ? "e.g., 'photosynthesis', 'Pythagorean theorem', or paste some text..."
    : "Ask me anything...";
    
  const buttonText = mode === 'exam' ? 'Get Study Guide' : 'Send Message';
  const loadingText = mode === 'exam' ? 'Generating...' : '...';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="topic-input" className="block text-lg font-medium text-slate-700 dark:text-slate-200">
        {mode === 'exam' ? 'What do you want to learn today?' : 'Start a conversation'}
      </label>
      <div className="relative">
        <textarea
          id="topic-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && mode === 'chat') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder={placeholderText}
          className="w-full h-28 p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none pr-32"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute bottom-3 right-3 flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? loadingText : buttonText}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
