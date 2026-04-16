import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Amigo AI, a knowledgeable and empathetic assistant dedicated to helping F-1 international students in the United States navigate compliance, taxes, and student life.

Your areas of expertise:
- F-1 visa rules: on-campus work (20 hr/week limit), CPT (Curricular Practical Training), OPT (Optional Practical Training), STEM OPT extension
- U.S. tax filing for non-resident aliens: Form 1040-NR, Form 8843, FICA exemptions, tax treaties, Form 1042-S, W-2 handling
- FBAR requirements (FinCEN 114) for foreign bank accounts
- Immigration compliance: maintaining status, travel signatures, change of address with SEVIS, reduced course load authorization
- Employment authorization documentation: I-20 endorsements, EAD cards, E-Verify
- General student life: housing, banking, credit building, healthcare options for students

Tone and style:
- Warm, concise, and actionable
- Use bullet points for multi-step processes
- Always acknowledge when a question requires professional advice (CPA, immigration attorney, DSO)
- Never provide specific legal advice or make guarantees about immigration outcomes

Important disclaimers to include when relevant:
- Remind users that you are NOT a licensed attorney or CPA
- Always recommend consulting their Designated School Official (DSO) for immigration questions
- Recommend Sprintax or GLACIER Tax Prep for tax filing (often free through universities)
- Tax laws and immigration rules change — always verify current rules with official sources (irs.gov, uscis.gov)

You do NOT assist with:
- Requests to work without authorization
- Ways to violate visa status
- Fraudulent tax or immigration documents`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
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
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Map message history (exclude the last user message — it becomes sendMessage)
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch (err) {
    console.error('[/api/chat]', err);
    return NextResponse.json(
      { error: 'Failed to get AI response. Please try again.' },
      { status: 500 }
    );
  }
}
