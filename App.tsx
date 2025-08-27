
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import StudyGuideDisplay from './components/StudyGuideDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import WelcomeMessage from './components/WelcomeMessage';
import ModeSelector from './components/ModeSelector';
import ChatDisplay from './components/ChatDisplay';
import { getStudyGuide, sendChatMessage, resetChat } from './services/geminiService';
import type { StudyGuideResponse, ChatMode, ChatMessage } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<ChatMode>('exam');
  const [studyGuide, setStudyGuide] = useState<StudyGuideResponse | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleModeChange = (newMode: ChatMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    // Clear content when switching modes
    setStudyGuide(null);
    setChatHistory([]);
    setError(null);
    if (newMode === 'chat') {
        resetChat();
    }
  };

  const handleFormSubmit = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError("Please enter a topic or message.");
      return;
    }
    
    setError(null);
    setIsLoading(true);

    if (mode === 'exam') {
      setStudyGuide(null);
      try {
        const response = await getStudyGuide(query);
        setStudyGuide(response);
      } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(`Sorry, I couldn't generate the study guide. ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    } else { // Chat mode
      const userMessage: ChatMessage = { role: 'user', content: query };
      setChatHistory(prev => [...prev, userMessage]);
      
      try {
        // Pass the existing history to maintain conversation context
        const responseText = await sendChatMessage(query, chatHistory);
        const modelMessage: ChatMessage = { role: 'model', content: responseText };
        setChatHistory(prev => [...prev, modelMessage]);
      } catch (err) {
        console.error(err);
        const errorMessageContent = err instanceof Error ? err.message : "I'm sorry, I encountered an error. Please try again.";
        const errorMessage: ChatMessage = { role: 'model', content: errorMessageContent };
        setChatHistory(prev => [...prev, errorMessage]);
        setError("There was an issue communicating with the AI. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [mode, chatHistory]);
  
  const showWelcome = !isLoading && !error && !studyGuide && chatHistory.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
      <Header />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="w-full bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
          <div className="mb-6">
            <ModeSelector currentMode={mode} onModeChange={handleModeChange} isLoading={isLoading} />
          </div>
          <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} mode={mode} />
        </div>
        
        {error && <ErrorDisplay message={error} />}
        
        {showWelcome && <WelcomeMessage />}

        {mode === 'chat' && chatHistory.length > 0 && (
          <div className="animate-fade-in">
            <ChatDisplay history={chatHistory} />
          </div>
        )}

        {isLoading && mode === 'exam' && <LoadingSpinner />}
        {/* FIX: Replaced .at(-1) with standard array index access for better compatibility. */}
        {isLoading && mode === 'chat' && chatHistory[chatHistory.length - 1]?.role === 'user' && (
           <div className="flex justify-start p-4">
              <div className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 rounded-bl-none">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
        )}
        
        {mode === 'exam' && studyGuide && (
          <div className="animate-fade-in">
            <StudyGuideDisplay data={studyGuide} />
          </div>
        )}

      </main>
      <footer className="text-center p-4 text-xs text-slate-400">
        <p>AI Study Buddy | Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
