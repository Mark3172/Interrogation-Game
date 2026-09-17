# 🔍 The Interrogation Room

A browser-based AI detective game where you interrogate a suspect to solve a locked-room mystery. Built with Next.js, Google Gemini AI, and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white)

---

## 🎮 The Case

A **prototype gadget** has been stolen from a locked research lab at Nexus Technologies. Your prime suspect: **Dr. Evelyn Vance**, a senior research scientist with a suspicious alibi.

**The Evidence:**
- 🔒 The lab door requires a **biometric scan** — only authorized personnel can enter
- 🪟 The lab window was found **broken from the inside**

Dr. Vance claims she was outside having a smoke when the window broke. Something doesn't add up. It's your job to find the contradiction and **extract a confession**.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered Suspect** | Dr. Vance is powered by Google Gemini with a detailed personality — arrogant, dismissive, and increasingly nervous as you get closer to the truth |
| 💬 **Real-time Chat** | iMessage-style chat interface with typing indicators and smooth animations |
| 📊 **Stress Meter** | Live progress bar (0–100) that tracks the suspect's stress level with color transitions (green → yellow → red) |
| 🏆 **Leaderboard** | Solve the case in the fewest turns and compete for the top spot on the global leaderboard |
| 🎯 **Structured AI Output** | Every AI response is strictly typed JSON — no unpredictable outputs |
| 🌙 **Dark Noir Theme** | Atmospheric dark UI designed to feel like a real interrogation room |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- A [Google Gemini API key](https://aistudio.google.com/apikey)
- A [Supabase](https://supabase.com/) project (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/Mark3172/Interrogation-Game.git
cd Interrogation-Game
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** The chat works with just the `GEMINI_API_KEY`. Supabase credentials are only needed for the leaderboard feature.

### 4. Set Up the Database

Run this SQL in your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql):

```sql
CREATE TABLE leaderboard (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  player_name TEXT NOT NULL,
  turns_taken INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON leaderboard
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous reads" ON leaderboard
  FOR SELECT USING (true);
```

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start interrogating!

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── interrogate/route.ts   # Gemini AI chat endpoint
│   │   └── leaderboard/route.ts   # Supabase leaderboard CRUD
│   ├── globals.css                # Theme, animations, scrollbar
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main two-column layout
├── components/
│   ├── CaseFile.tsx               # Left sidebar — case details
│   ├── ChatInterface.tsx          # Chat UI + game state management
│   ├── ConfessionModal.tsx        # Win screen + leaderboard display
│   └── StressMeter.tsx            # Animated stress progress bar
└── lib/
    └── supabase.ts                # Supabase client (lazy-initialized)
```

---

## 🎯 How to Win

1. **Read the Case File** — Pay attention to the two key pieces of evidence
2. **Question Dr. Vance** — Start casual, then press harder
3. **Watch the Stress Meter** — It shows how close you are to cracking the case
4. **Find the Contradiction** — If the window was broken from the *inside*, and the door needs a biometric scan... how could an outsider have done it?
5. **Corner the Suspect** — Point out the logical impossibility of her alibi
6. **Get the Confession** — When she cracks, submit your score!

> 💡 **Tip:** The fewer turns you take, the higher you rank on the leaderboard!

---

## 🛠️ Tech Stack

- **[Next.js 14](https://nextjs.org/)** — React framework with App Router & API routes
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **[Google Gemini AI](https://ai.google.dev/)** — LLM with structured JSON output for consistent game responses
- **[Supabase](https://supabase.com/)** — PostgreSQL database for the leaderboard

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ☕ and suspicion
</p>
