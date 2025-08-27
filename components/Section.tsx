
import React from 'react';

interface SectionProps {
  title: string;
  icon: JSX.Element;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => {
  return (
    <section className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
      </div>
      <div className="pl-0 sm:pl-10">
        {children}
      </div>
    </section>
  );
};

export default Section;
