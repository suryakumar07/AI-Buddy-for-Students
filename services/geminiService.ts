import type { StudyGuideResponse, ChatMessage } from '../types';

export const getStudyGuide = async (query: string): Promise<StudyGuideResponse> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mode: 'exam', query }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred' }));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const sendChatMessage = async (message: string, history: ChatMessage[]): Promise<string> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mode: 'chat', query: message, history }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred' }));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  const data = await response.json();
  return data.text;
};

// This function is no longer needed as the chat is now stateless on the backend
export const resetChat = () => {
    // No-op
};
