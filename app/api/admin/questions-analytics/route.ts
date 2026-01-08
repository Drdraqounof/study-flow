import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  // List of onboarding questions to aggregate
  const questions = [
    'Do you find it challenging to manage your time effectively?',
    'Do you currently use any tools to organize your study materials?',
    'Have you used any productivity or study apps before?',
    'Do you think an AI assistant could help you with your studies?'
  ];

  // Aggregate counts for each question and answer
  const results: { [key: string]: { Yes: number; No: number } } = {};
  for (const question of questions) {
    const yesCount = await prisma.questionsLog.count({ where: { question, answer: 'Yes' } });
    const noCount = await prisma.questionsLog.count({ where: { question, answer: 'No' } });
    results[question] = { Yes: yesCount, No: noCount };
  }
  return NextResponse.json(results);
}
