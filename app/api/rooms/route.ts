import { NextResponse } from 'next/server';
import { RoomService } from '@/lib/services/room.service';
import type { RoomFilters, RoomType } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters from query params
    const filters: RoomFilters = {};
    
    const building = searchParams.get('building');
    if (building) filters.building = building;
    
    const type = searchParams.get('type');
    if (type) filters.type = type as RoomType;
    
    const equipment = searchParams.get('equipment');
    if (equipment) filters.equipment = equipment.split(',');
    
    const minCapacity = searchParams.get('minCapacity');
    if (minCapacity) filters.minCapacity = parseInt(minCapacity, 10);

    const rooms = RoomService.getRooms(filters);
    
    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}
