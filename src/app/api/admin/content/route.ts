import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'src/locales');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'ru';

    const filePath = path.join(localesDir, `${lang}/common.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Language file not found' }, { status: 404 });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading content:', error);
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { language, content } = body;

    if (!language || !content) {
      return NextResponse.json({ error: 'Missing language or content' }, { status: 400 });
    }

    const filePath = path.join(localesDir, `${language}/common.json`);

    // Ensure directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write content to file
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
