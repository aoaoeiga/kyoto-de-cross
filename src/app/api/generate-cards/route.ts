import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const hasKey = !!process.env.ANTHROPIC_API_KEY;

    return NextResponse.json({
      message: 'API is working',
      hasApiKey: hasKey,
      keyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 10) || 'NOT SET',
      eventId: body.event_id,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
