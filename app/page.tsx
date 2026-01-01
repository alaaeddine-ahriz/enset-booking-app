'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  AppShell,
  TopAppBar,
  Button,
  Card,
  Avatar,
  ReservationCard,
} from './components';
import type { ReservationWithDetails, User } from '@/lib/types';

// Date formatter for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return `${days[date.getDay()]} ${date.getDate()} ${date.toLocaleString('fr-FR', { month: 'short' })}`;
}

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [stats, setStats] = useState({ pending: 0, upcoming: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch current user and stats
        const userRes = await fetch('/api/user/me');
        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUser(userData.user);
          setStats({
            pending: userData.stats.pending,
            upcoming: userData.stats.confirmed,
          });

          // Fetch user's reservations
          const resRes = await fetch(`/api/reservations?userId=${userData.user.id}`);
          if (resRes.ok) {
            const resData = await resRes.json();
            setReservations(resData.reservations);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <AppShell>
        <TopAppBar title="ENSET Rooms" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[var(--color-text-sub)]">Chargement...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopAppBar
        title="ENSET Rooms"
        rightAction={
          <Link href="/profile">
            <Avatar initials={currentUser?.avatarInitials || 'U'} size="sm" />
          </Link>
        }
      />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-main)]">
            Bonjour {currentUser?.name.split(' ')[0] || 'User'}
          </h1>
          <p className="text-[var(--color-text-sub)] mt-1">
            Gérez vos réservations de salles
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <div className="text-3xl font-bold text-[var(--color-primary)]">{stats.upcoming}</div>
            <p className="text-xs text-[var(--color-text-sub)] mt-1">Réservations à venir</p>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-amber-500">{stats.pending}</div>
            <p className="text-xs text-[var(--color-text-sub)] mt-1">En attente</p>
          </Card>
        </div>

        {/* Upcoming Reservations */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-[var(--color-text-main)]">
              Mes réservations
            </h2>
            <button className="text-[var(--color-primary)] text-sm font-medium">
              Voir tout
            </button>
          </div>
          <div className="space-y-3">
            {reservations.length === 0 ? (
              <Card className="text-center py-6">
                <p className="text-[var(--color-text-sub)]">Aucune réservation</p>
              </Card>
            ) : (
              reservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  roomName={reservation.roomName}
                  courseName={reservation.courseName}
                  date={formatDate(reservation.date)}
                  timeSlot={`${reservation.startTime} - ${reservation.endTime}`}
                  status={reservation.status}
                  isRefused={reservation.status === 'refused'}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* FAB */}
      <div className="absolute bottom-24 right-4">
        <Link href="/reserve">
          <Button
            variant="primary"
            size="lg"
            icon="add"
            iconPosition="left"
            className="shadow-xl"
          >
            Réserver
          </Button>
        </Link>
      </div>
    </AppShell>
  );
}
