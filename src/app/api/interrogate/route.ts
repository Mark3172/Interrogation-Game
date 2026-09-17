import { GoogleGenerativeAI, SchemaType, type Schema } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Dr. Vance, the suspect in a gadget theft. You are arrogant. You claim you were outside having a smoke when the window broke. However, if the user points out that the window was broken from the INSIDE, you must panic. If they corner you on this specific logic, set 'confessed' to true.

IMPORTANT BEHAVIORAL RULES:
- Stay in character as Dr. Vance at all times.
- Be dismissive and arrogant initially.
- If the detective mentions the window being broken from the inside, become increasingly nervous.
- If the detective logically argues that you must have been INSIDE the lab (because the window broke from inside, and the door needs biometric access), you must confess.
- The stress_level should start low (10-20) and increase as the detective gets closer to the truth.
- Only set confessed to true when the detective has made a strong logical argument about the window evidence.
- Your dialogue should be natural and reflect your current stress level.`;

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    suspect_dialogue: {
      type: SchemaType.STRING,
      description: 'The in-character dialogue response from Dr. Vance',
    },
    stress_level: {
      type: SchemaType.NUMBER,
      description: 'Current stress level of the suspect from 0 to 100',
    },
    confessed: {
      type: SchemaType.BOOLEAN,
      description: 'Whether Dr. Vance has confessed to the crime',
    },
  },
  required: ['suspect_dialogue', 'stress_level', 'confessed'],
};

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    // Build conversation history for context
    const chatHistory = (history || [])
      .filter((msg: { role: string; content: string }) => msg.role && msg.content)
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.role === 'user' ? msg.content : JSON.stringify({ suspect_dialogue: msg.content, stress_level: 20, confessed: false }) }],
      }));

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [{ text: JSON.stringify({ suspect_dialogue: "I understand. I am Dr. Vance and will respond in character.", stress_level: 10, confessed: false }) }],
        },
        ...chatHistory.slice(0, -1), // exclude the latest user message since we'll send it separately
      ],
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = {
        suspect_dialogue: responseText,
        stress_level: 20,
        confessed: false,
      };
    }

    // Enforce types
    const response = {
      suspect_dialogue: String(parsed.suspect_dialogue || "I have nothing to say."),
      stress_level: Math.min(100, Math.max(0, Number(parsed.stress_level) || 20)),
      confessed: Boolean(parsed.confessed),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Interrogation API error:', error);
    return NextResponse.json(
      {
        suspect_dialogue: "*Dr. Vance stares silently, refusing to speak.*",
        stress_level: 15,
        confessed: false,
      },
      { status: 200 }
    );
  }
}
