import { NextResponse } from 'next/server';
import { ReservationService } from '@/lib/services/reservation.service';
import type { CreateReservationDto } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status') as 'pending' | 'confirmed' | 'refused' | null;

    let reservations;
    if (userId) {
      reservations = ReservationService.getUserReservations(userId);
    } else if (status) {
      reservations = ReservationService.getReservationsByStatus(status);
    } else {
      // Return pending for admin by default
      reservations = ReservationService.getPendingRequests();
    }

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateReservationDto = await request.json();

    // Validate required fields
    if (!body.roomId || !body.userId || !body.courseName || !body.date || !body.startTime || !body.endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const reservation = ReservationService.createReservation(body);
    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    const message = error instanceof Error ? error.message : 'Failed to create reservation';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
