
import React from 'react';

const WelcomeMessage: React.FC = () => {
  return (
    <div className="text-center p-10 bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Welcome to your AI Study Buddy!</h2>
      <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
        Ready to master any subject? Just type a topic, question, or concept above, and I'll create a personalized, bilingual study guide to help you ace your exams. Let's start learning!
      </p>
    </div>
  );
};

export default WelcomeMessage;
