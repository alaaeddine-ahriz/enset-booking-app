import { NextResponse } from 'next/server';
import { UserService } from '@/lib/services/user.service';
import { ReservationService } from '@/lib/services/reservation.service';

// For now, simulate a logged-in user (first user in database)
// This will be replaced with actual auth later
export async function GET() {
  try {
    const users = UserService.getAllUsers();
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'No users found' },
        { status: 404 }
      );
    }

    // Get the first teacher user (Souad Amitou)
    const currentUser = users.find(u => u.email === 'souad@enset.ma') || users[0];
    
    // Get stats for this user
    const stats = ReservationService.getUserStats(currentUser.id);

    return NextResponse.json({
      user: currentUser,
      stats,
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
