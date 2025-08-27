
import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';

interface ChatDisplayProps {
  history: ChatMessage[];
}

// A safer simple markdown renderer to prevent XSS
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    // 1. Escape HTML special characters
    const escapedText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    // 2. Apply markdown after escaping
    const html = escapedText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\n/g, '<br />'); // Newlines

    return <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
};


const ChatDisplay: React.FC<ChatDisplayProps> = ({ history }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      {history.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`max-w-xl px-4 py-3 rounded-2xl shadow-sm ${
              msg.role === 'user'
                ? 'bg-indigo-500 text-white rounded-br-none'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
            }`}
          >
            <SimpleMarkdown text={msg.content} />
          </div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatDisplay;
