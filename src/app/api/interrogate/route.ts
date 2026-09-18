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
- Your dialogue should be natural and reflect your current stress level.
- ALWAYS respond with valid JSON in this exact format: {"suspect_dialogue": "your response", "stress_level": number, "confessed": boolean}`;

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

// ===== OPENROUTER API (Free models, no credit card) =====
async function callOpenRouter(message: string, history: { role: string; content: string }[]) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey.includes('your_')) return null;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(history || []).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.role === 'user' ? msg.content : JSON.stringify({ suspect_dialogue: msg.content, stress_level: 20, confessed: false }),
    })),
    { role: 'user', content: `${message}\n\nRemember to return ONLY valid JSON: {"suspect_dialogue": "...", "stress_level": 0-100, "confessed": true/false}` },
  ];

  const modelsToTry = [
    'inclusionai/ling-3.0-flash-vl:free',
    'deepseek/deepseek-v4-flash-0731:free',
    'liquid/lfm-2.5-2.6b:free',
    'nex-agi/nex-n2.5-mini:free',
  ];

  for (const model of modelsToTry) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'The Interrogation Room',
        },
        body: JSON.stringify({
          model,
          messages,
        }),
      });

      if (!res.ok) {
        console.warn(`OpenRouter model ${model} returned ${res.status}`);
        continue;
      }

      const data = await res.json();
      const rawText = data.choices?.[0]?.message?.content;
      if (!rawText) continue;

      // Strip markdown code block if present
      const jsonText = rawText.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1').trim();
      const parsed = JSON.parse(jsonText);
      if (parsed && (parsed.suspect_dialogue || parsed.stress_level !== undefined)) {
        return parsed;
      }
    } catch (e) {
      console.warn(`Error trying OpenRouter model ${model}:`, e);
    }
  }

  return null;
}

// ===== GEMINI API =====
async function callGemini(message: string, history: { role: string; content: string }[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('your_') || apiKey.length < 10) return null;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
    },
  });

  const chatHistory = (history || [])
    .filter((msg: { role: string; content: string }) => msg.role && msg.content)
    .map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.role === 'user' ? msg.content : JSON.stringify({ suspect_dialogue: msg.content, stress_level: 20, confessed: false }) }],
    }));

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: JSON.stringify({ suspect_dialogue: "I understand. I am Dr. Vance and will respond in character.", stress_level: 10, confessed: false }) }] },
      ...chatHistory.slice(0, -1),
    ],
  });

  const result = await chat.sendMessage(message);
  const responseText = result.response.text();
  return JSON.parse(responseText);
}

// ===== DEMO MODE: Scripted responses =====
function getDemoResponse(message: string, history: { role: string; content: string }[]): {
  suspect_dialogue: string;
  stress_level: number;
  confessed: boolean;
} {
  const msg = message.toLowerCase();
  const allMessages = [...(history || []).filter(m => m.role === 'user').map(m => m.content.toLowerCase()), msg];
  const allText = allMessages.join(' ');

  const mentionedInsideWindow = allText.includes('inside') && (allText.includes('window') || allText.includes('glass') || allText.includes('broken'));
  const mentionedBiometric = allText.includes('biometric') || allText.includes('badge') || allText.includes('access log') || allText.includes('door');
  const corneringLogic = mentionedInsideWindow && mentionedBiometric;
  const directAccusation = msg.includes('you were in the lab') || msg.includes('you broke the window') || msg.includes('you staged') || msg.includes('you did it') || msg.includes('you stole');

  if (corneringLogic && (directAccusation || allMessages.length >= 5)) {
    return {
      suspect_dialogue: "*Dr. Vance slams her fists on the table, tears streaming down her face*\n\nFINE! You want the truth?! YES, I took it! I took Project Chimera! I've spent THREE YEARS of my life on that project and they were going to hand it over to some corporate suit who doesn't know a transistor from a capacitor!\n\nI broke the window myself to make it look like a break-in. I thought... I thought it would work. I didn't think anyone would notice the glass fell on the outside.\n\n*She buries her face in her hands*\n\nYou got me, detective. You got me.",
      stress_level: 100,
      confessed: true,
    };
  }

  if (mentionedInsideWindow && msg.includes('inside')) {
    return {
      suspect_dialogue: "*Dr. Vance's hands begin to tremble visibly*\n\nThe window was... from the inside? That's... that's not... I mean, how would I know which direction it broke from? I was OUTSIDE! I told you that already!\n\n*She loosens her collar nervously*\n\nMaybe the forensics team made a mistake. Those tests aren't always reliable, you know. I'm a scientist — I know about margin of error.",
      stress_level: 72,
      confessed: false,
    };
  }

  if (msg.includes('access') || msg.includes('biometric') || msg.includes('badge') || msg.includes('log') || msg.includes('2:15') || msg.includes('didn\'t leave')) {
    return {
      suspect_dialogue: "*Dr. Vance shifts uncomfortably in her chair*\n\nThe badge system? It... it glitches sometimes. Everyone in the department knows that. I swiped in earlier for some paperwork, yes, but I stepped out for a smoke through the... the side exit. It doesn't always log properly.\n\n*She avoids eye contact*\n\nThis is circumstantial at best, detective. You're grasping at straws.",
      stress_level: 48,
      confessed: false,
    };
  }

  if (msg.includes('window') || msg.includes('glass') || msg.includes('broke') || msg.includes('break-in') || msg.includes('broken')) {
    return {
      suspect_dialogue: "*Dr. Vance waves her hand dismissively*\n\nThe window? Obviously someone broke in from the outside. That's what criminals do, detective — they break windows. I heard the crash while I was smoking and ran back to check. By the time I got there, the prototype was already gone.\n\nMaybe you should be looking for whoever climbed through that window instead of wasting my time.",
      stress_level: 32,
      confessed: false,
    };
  }

  if (msg.includes('lab') || msg.includes('stolen') || msg.includes('gadget') || msg.includes('prototype') || msg.includes('chimera') || msg.includes('theft')) {
    return {
      suspect_dialogue: "*Dr. Vance leans back and crosses her arms*\n\nProject Chimera was MY work, detective. Three years of research. Why on earth would I steal my own creation? I had full access to it every single day. This is a waste of both our time.\n\nSomeone from the outside obviously wanted it. Corporate espionage isn't exactly uncommon in this industry.",
      stress_level: 18,
      confessed: false,
    };
  }

  if (msg.includes('where') || msg.includes('alibi') || msg.includes('smoke') || msg.includes('were you') || msg.includes('doing') || msg.includes('night') || msg.includes('happened')) {
    return {
      suspect_dialogue: "*Dr. Vance sighs with exaggerated impatience*\n\nAs I've already explained — I was outside having a cigarette. I take my smoke breaks by the east entrance, same spot every night. I heard the window shatter, ran back inside, and saw the lab was trashed.\n\nI called security immediately. Check the phone records if you don't believe me.",
      stress_level: 15,
      confessed: false,
    };
  }

  return {
    suspect_dialogue: "*Dr. Vance adjusts her glasses and stares at you coldly*\n\nIs that really the best question you have, detective? I have a PhD in quantum engineering and three patents to my name. I don't have time for amateur hour.\n\nAsk me something relevant, or let me go. I have important work to get back to — assuming your people haven't contaminated my entire lab with fingerprint dust.",
    stress_level: 12,
    confessed: false,
  };
}

// ===== MAIN HANDLER: tries Gemini → OpenRouter → Demo Mode =====
export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let parsed = null;
    let mode = 'demo';

    // 1. Try Gemini
    try {
      parsed = await callGemini(message, history || []);
      if (parsed) { console.log('[Gemini] Response received'); mode = 'gemini'; }
    } catch (err) {
      console.error('[Gemini] Failed:', err);
    }

    // 2. Try OpenRouter
    if (!parsed) {
      try {
        parsed = await callOpenRouter(message, history || []);
        if (parsed) { console.log('[OpenRouter] Response received'); mode = 'openrouter'; }
      } catch (err) {
        console.error('[OpenRouter] Failed:', err);
      }
    }

    // 3. Fall back to demo mode
    if (!parsed) {
      console.log('[Demo Mode] Using scripted response');
      parsed = getDemoResponse(message, history || []);
      mode = 'demo';
    }

    const response = {
      suspect_dialogue: String(parsed.suspect_dialogue || "I have nothing to say."),
      stress_level: Math.min(100, Math.max(0, Number(parsed.stress_level) || 20)),
      confessed: Boolean(parsed.confessed),
      mode,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Interrogation API error:', error);
    return NextResponse.json({
      suspect_dialogue: "*Dr. Vance stares silently, refusing to speak.*",
      stress_level: 15,
      confessed: false,
    }, { status: 200 });
  }
}
