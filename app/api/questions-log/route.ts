import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, question, answer } = await req.json();
    if (!question || !answer) {
      return NextResponse.json({ error: 'Missing question or answer' }, { status: 400 });
    }
    const log = await prisma.questionsLog.create({
      data: {
        userId,
        question,
        answer,
      },
    });
    return NextResponse.json({ success: true, log });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log question' }, { status: 500 });
  }
}
