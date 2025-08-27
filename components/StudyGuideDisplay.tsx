
import React from 'react';
import type { StudyGuideResponse, BilingualContent, MultipleChoiceQuestion } from '../types';
import Section from './Section';
import { ICONS } from '../constants';

interface StudyGuideDisplayProps {
  data: StudyGuideResponse;
}

const BilingualBlock: React.FC<{ content: BilingualContent; className?: string }> = ({ content, className }) => (
  <div className={`space-y-2 ${className}`}>
    <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{content.english}</p>
    <p className="text-sm text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-md">{content.tamil}</p>
  </div>
);

const StudyGuideDisplay: React.FC<StudyGuideDisplayProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      <Section title="Simple Explanation" icon={ICONS.EXPLANATION}>
        <BilingualBlock content={data.simpleExplanation} />
      </Section>
      
      <Section title="Flashcards" icon={ICONS.FLASHCARDS}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.flashcards.map((flashcard, index) => (
            <div key={index} className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
              <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Question {index + 1}</h4>
              <BilingualBlock content={flashcard.question} />
              <div className="my-3 border-t border-dashed border-slate-300 dark:border-slate-600"></div>
              <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Answer</h4>
              <BilingualBlock content={flashcard.answer} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Practice Questions" icon={ICONS.PRACTICE}>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Multiple Choice Questions</h3>
            <div className="space-y-4">
              {data.practiceQuestions.multipleChoice.map((mcq, index) => (
                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <BilingualBlock content={mcq.question} className="font-medium mb-3" />
                  <div className="space-y-2">
                    {mcq.options.map((option, optIndex) => {
                      const isCorrect = option.english === mcq.correctAnswer.english;
                      return (
                        <div key={optIndex} className={`p-2 rounded-md ${isCorrect ? 'bg-green-100 dark:bg-green-900/50 ring-2 ring-green-500' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                          <BilingualBlock content={option} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Short Answer Questions</h3>
             <div className="space-y-4">
               {data.practiceQuestions.shortAnswer.map((q, index) => (
                  <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                     <BilingualBlock content={q.question} />
                  </div>
               ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Long Answer Question</h3>
            {data.practiceQuestions.longAnswer.map((q, index) => (
              <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                 <BilingualBlock content={q.question} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Quick Revision" icon={ICONS.REVISION}>
         <BilingualBlock content={data.quickRevision} />
      </Section>
    </div>
  );
};

export default StudyGuideDisplay;
