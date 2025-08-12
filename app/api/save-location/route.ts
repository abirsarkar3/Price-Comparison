import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { location } = await request.json();
    
    // For now, we'll just return success
    // In a real implementation, you might want to save to a database
    console.log('Location saved:', location);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving location:', error);
    return NextResponse.json({ error: 'Failed to save location' }, { status: 500 });
  }
} 