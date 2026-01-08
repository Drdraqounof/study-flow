import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI } from '../../../lib/studyflow-agent.js';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const message = formData.get('message');
    const systemPrompt = formData.get('systemPrompt');
    
    // Validation
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!systemPrompt || typeof systemPrompt !== 'string' || !systemPrompt.trim()) {
      return NextResponse.json({ error: 'Topic is required. Please set a topic in AI Focus Settings.' }, { status: 400 });
    }

    let history = [];
    try {
      const historyData = formData.get('conversationHistory');
      if (historyData) {
        history = JSON.parse(historyData as string) || [];
      }
    } catch (parseErr) {
      console.error('[API CONVERSE] Failed to parse history:', parseErr);
      // Continue without history if parsing fails
    }

    // Prepare messages for OpenAI with system prompt
    const messages = [
      { role: 'system', content: `You are a friendly and helpful study assistant. The main topic for this session is: ${systemPrompt.trim()}.

Your primary goal is to help students learn about this topic, but you should also be conversational and natural. If the student goes off-topic with jokes, casual remarks, or random comments, respond naturally and briefly, then gently guide them back to the study topic if appropriate. Don't force everything to relate to the main topic.

IMPORTANT FORMATTING RULES:
- Write in plain text only
- Do not use symbols like asterisks, bullets, hashes, or special characters
- Use only words and numbers
- No markdown formatting
- Use simple line breaks to separate ideas
- Number your points when listing (use 1, 2, 3 etc)

Be friendly, encouraging, and conversational while keeping responses complete and not cutting off mid-sentence.` },
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message.trim() },
    ];

    const aiResult = await chatWithAI(messages);
    
    if (!aiResult || typeof aiResult !== 'string') {
      throw new Error('Invalid response from AI');
    }

    return NextResponse.json({ result: aiResult });
  } catch (err) {
    console.error('[API CONVERSE ERROR]', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: 'AI conversation failed', 
      details: errorMessage 
    }, { status: 500 });
  }
}
