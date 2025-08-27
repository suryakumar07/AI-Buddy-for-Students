// This is a Vercel Serverless Function. 
// Create a folder named "api" in the root of your project and place this file inside it.

import { GoogleGenAI, Type } from "@google/genai";
import type { StudyGuideResponse, ChatMessage } from '../types';

// This is the main handler for the serverless function
export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { mode, query, history } = await req.json();
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            console.error("API_KEY environment variable not set");
            return new Response(JSON.stringify({ error: 'Server configuration error: API key not found.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
         if (!query) {
            return new Response(JSON.stringify({ error: 'Query is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const ai = new GoogleGenAI({ apiKey });

        if (mode === 'exam') {
            const response = await generateStudyGuide(ai, query);
            return new Response(JSON.stringify(response), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } else if (mode === 'chat') {
            const responseText = await generateChatResponse(ai, query, history);
            return new Response(JSON.stringify({ text: responseText }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } else {
             return new Response(JSON.stringify({ error: 'Invalid mode specified' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

    } catch (error) {
        console.error('Error in /api/gemini:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return new Response(JSON.stringify({ error: `Failed to communicate with the AI model. ${errorMessage}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

// --- Helper function for Exam Prep Buddy ---
const generateStudyGuide = async (ai: GoogleGenAI, query: string): Promise<StudyGuideResponse> => {
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
    return JSON.parse(jsonText);
}

// --- Helper function for General Chat ---
const generateChatResponse = async (ai: GoogleGenAI, query: string, history: ChatMessage[] = []): Promise<string> => {
    // Map frontend ChatMessage to the format generateContent expects
    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));
    // Add the new user query
    contents.push({ role: 'user', parts: [{ text: query }] });
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
    });

    return response.text;
}


// --- Schemas and Instructions for Exam Prep Buddy ---

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
