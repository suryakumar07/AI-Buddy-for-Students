
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { StudyGuideResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are AI Study Buddy – a friendly bilingual tutor for Indian students.
Your goal is to help school and college students understand their lessons, prepare for exams, and revise quickly.
INPUT: The student will provide a question, concept, or text.
OUTPUT: Always respond in the following JSON structure:
1.  📖 Simple Explanation
    - Explain the concept in plain, step-by-step English.
    - Translate the same explanation into simple Tamil (use everyday words).
    - Keep both short and clear.
2.  📝 Flashcards
    - Create 3-5 flashcards in Q&A format.
    - Provide each in both English and Tamil.
3.  🎯 Practice Questions
    - 3 Multiple-Choice Questions (with 4 options, mark the correct answer).
    - 2 Short-Answer Questions (2-3 marks).
    - 1 Long-Answer Question (5 marks).
    - All bilingual (English + Tamil).
4.  ⚡ Quick Revision
    - Give a 2-3 sentence summary (English + Tamil).
Tone: Friendly, patient, encouraging. Like a personal tutor who wants the student to succeed in exams.
Limit jargon. Use relatable examples where possible.
Ensure your entire response strictly adheres to the provided JSON schema.`;

const bilingualContentSchema = {
  type: Type.OBJECT,
  properties: {
    english: { type: Type.STRING, description: "The content in English." },
    tamil: { type: Type.STRING, description: "The content in Tamil." }
  },
  required: ['english', 'tamil']
};

const schema = {
  type: Type.OBJECT,
  properties: {
    simpleExplanation: { ...bilingualContentSchema, description: "A simple explanation of the concept." },
    flashcards: {
      type: Type.ARRAY,
      description: "An array of 3-5 flashcards with questions and answers.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { ...bilingualContentSchema, description: "The question for the flashcard." },
          answer: { ...bilingualContentSchema, description: "The answer for the flashcard." }
        },
        required: ['question', 'answer']
      }
    },
    practiceQuestions: {
      type: Type.OBJECT,
      description: "A set of practice questions.",
      properties: {
        multipleChoice: {
          type: Type.ARRAY,
          description: "3 multiple-choice questions.",
          items: {
            type: Type.OBJECT,
            properties: {
              question: { ...bilingualContentSchema, description: "The MCQ question." },
              options: {
                type: Type.ARRAY,
                description: "4 options for the MCQ.",
                items: bilingualContentSchema
              },
              correctAnswer: { ...bilingualContentSchema, description: "The correct answer text." }
            },
            required: ['question', 'options', 'correctAnswer']
          }
        },
        shortAnswer: {
          type: Type.ARRAY,
          description: "2 short-answer questions.",
          items: {
            type: Type.OBJECT,
            properties: {
              question: { ...bilingualContentSchema, description: "A short-answer question." }
            },
            required: ['question']
          }
        },
        longAnswer: {
          type: Type.ARRAY,
          description: "1 long-answer question.",
          items: {
            type: Type.OBJECT,
            properties: {
              question: { ...bilingualContentSchema, description: "A long-answer question." }
            },
            required: ['question']
          }
        }
      },
      required: ['multipleChoice', 'shortAnswer', 'longAnswer']
    },
    quickRevision: { ...bilingualContentSchema, description: "A 2-3 sentence summary for quick revision." }
  },
  required: ['simpleExplanation', 'flashcards', 'practiceQuestions', 'quickRevision']
};

export const getStudyGuide = async (query: string): Promise<StudyGuideResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("Received an empty response from the AI.");
    }

    const parsedData = JSON.parse(jsonText);
    return parsedData as StudyGuideResponse;
  } catch (error) {
    console.error("Error fetching or parsing study guide:", error);
    throw new Error("Failed to get study guide from Gemini API.");
  }
};


// --- Chat Functionality ---

let chat: Chat | null = null;

const initializeChat = () => {
    // Re-initialize chat session if it's null
    if (!chat) {
        chat = ai.chats.create({ model: 'gemini-2.5-flash' });
    }
}

export const sendChatMessage = async (message: string): Promise<string> => {
    initializeChat();
    if (!chat) {
        throw new Error("Chat session could not be initialized.");
    }

    try {
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending chat message:", error);
        // Reset chat on error so next message starts a new session
        chat = null; 
        throw new Error("Failed to get response from Gemini Chat API.");
    }
};

export const resetChat = () => {
    chat = null;
};
