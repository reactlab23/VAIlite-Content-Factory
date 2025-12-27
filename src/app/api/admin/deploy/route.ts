import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Add all changes
    await execAsync('git add .');

    // Commit with timestamp
    const timestamp = new Date().toISOString();
    await execAsync(`git commit -m "Update content via admin panel - ${timestamp}"`);

    // Push to remote
    await execAsync('git push origin main');

    return NextResponse.json({
      success: true,
      message: 'Changes committed and pushed successfully'
    });
  } catch (error: any) {
    console.error('Deploy error:', error);

    // If there's nothing to commit, that's not an error
    if (error.message.includes('nothing to commit')) {
      return NextResponse.json({
        success: true,
        message: 'No changes to deploy'
      });
    }

    return NextResponse.json({
      error: 'Failed to deploy changes',
      details: error.message
    }, { status: 500 });
  }
}
