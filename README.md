# Amigo

A compliance and reference hub for F-1 international students in the United States. Amigo helps you track work authorization hours, monitor OPT unemployment days, stay on top of tax and immigration deadlines, and get quick answers via an AI assistant, all without an account or backend.

## What it does

**Dashboard**: Personalized greeting, visa status, weekly on-campus hours at a glance, personal notes, and quick access to all tools.

**Work Log**: Log hours by week and work type (on-campus, CPT, OPT, STEM OPT). Tracks your 20-hour weekly cap for on-campus employment.

**OPT Tracker**: Track unemployment days against the USCIS cap (90 days for OPT, 150 days for STEM OPT). Add employment periods and the tracker calculates your running count automatically.

**Tax Hub**: Key 2026 deadlines for F-1 students: W-2 availability, 1040-NR, FBAR, OPT application windows. Includes F-1 tax basics and links to free filing tools like Sprintax and GLACIER.

**Resources**: Curated links to official sources: IRS, USCIS, SEVP, E-Verify, FinCEN, and more.

**AI Assistant**: Powered by Gemini 1.5 Flash, trained on F-1 compliance topics including OPT/CPT rules, FICA exemptions, tax treaties, FBAR, and SEVIS requirements.

**Profile**: Store your name, university, graduation year, and visa status locally.

## Data and privacy

All user data (profile, work logs, OPT tracker, notes) is stored in your browser's `localStorage`. Nothing is sent to a server. Clearing your browser data will erase it.

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Gemini 1.5 Flash via `@google/generative-ai`
- `date-fns` for date math
- `lucide-react` for icons
- No database, no authentication

## Getting started

**1. Clone the repo**

```bash
git clone https://github.com/suchitra0806/amigo.git
cd amigo
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

Create a `.env.local` file in the root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/app/apikey).

**4. Run the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Disclaimer

Amigo is for general educational and informational purposes only. It does not constitute legal, tax, immigration, or financial advice. Always verify information with your Designated School Official (DSO), a licensed CPA, or an immigration attorney before making decisions about your visa status or tax obligations.
