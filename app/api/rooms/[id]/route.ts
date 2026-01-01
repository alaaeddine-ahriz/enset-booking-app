import { NextResponse } from 'next/server';
import { RoomService } from '@/lib/services/room.service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    
    const room = RoomService.getRoomById(id);
    
    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Get availability if date is provided
    const date = searchParams.get('date');
    const userId = searchParams.get('userId');
    
    let availability = null;
    if (date) {
      availability = RoomService.getAvailability(id, date, userId || undefined);
    }

    return NextResponse.json({ room, availability });
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room' },
      { status: 500 }
    );
  }
}
