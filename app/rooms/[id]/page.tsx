'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  PageContainer,
  TopAppBar,
  Icon,
  DateStrip,
  TimeSlot,
  Button,
} from '@/app/components';
import type { Room, TimeSlot as TimeSlotType } from '@/lib/types';

interface RoomDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate dates for the next 5 days
function generateDates(): { day: string; date: number; fullDate: string }[] {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const dates = [];
  
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      day: days[d.getDay()],
      date: d.getDate(),
      fullDate: d.toISOString().split('T')[0],
    });
  }
  
  return dates;
}

export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  
  const [dates] = useState(generateDates);
  const [selectedDate, setSelectedDate] = useState(dates[0].fullDate);
  const [room, setRoom] = useState<Room | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlotType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user/me');
        if (res.ok) {
          const data = await res.json();
          setCurrentUserId(data.user.id);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    fetchUser();
  }, []);

  // Fetch room and availability
  useEffect(() => {
    async function fetchRoom() {
      try {
        const url = currentUserId 
          ? `/api/rooms/${id}?date=${selectedDate}&userId=${currentUserId}`
          : `/api/rooms/${id}?date=${selectedDate}`;
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setRoom(data.room);
          setTimeSlots(data.availability || []);
        }
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [id, selectedDate, currentUserId]);

  if (loading) {
    return (
      <PageContainer>
        <TopAppBar
          title="Chargement..."
          showBackButton
          onBack={() => router.back()}
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[var(--color-text-sub)]">Chargement...</p>
        </div>
      </PageContainer>
    );
  }

  if (!room) {
    return (
      <PageContainer>
        <TopAppBar
          title="Salle introuvable"
          showBackButton
          onBack={() => router.back()}
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[var(--color-text-sub)]">Cette salle n'existe pas.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <TopAppBar
        title={room.name}
        showBackButton
        onBack={() => router.back()}
      />
      <div className="flex-1 overflow-y-auto">
        {/* Room Info Header */}
        <div className="px-4 py-4 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon name="meeting_room" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{room.name}</h2>
              <p className="text-blue-100 text-sm">{room.building}</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Icon name="group" size="sm" />
              {room.capacity} places
            </span>
            <span className="flex items-center gap-1">
              <Icon name="category" size="sm" />
              {room.type}
            </span>
          </div>
          {/* Equipment */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {room.equipment.map((eq) => (
              <span
                key={eq}
                className="text-xs px-2 py-1 bg-white/20 rounded-full"
              >
                {eq}
              </span>
            ))}
          </div>
        </div>

        {/* Date Strip */}
        <div className="pt-4">
          <DateStrip
            dates={dates}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Time Slots */}
        <div className="px-4 py-4">
          <h3 className="font-bold text-[var(--color-text-main)] mb-4">
            Disponibilités
          </h3>
          <div className="space-y-0">
            {timeSlots.length === 0 ? (
              <p className="text-[var(--color-text-sub)] text-center py-4">
                Aucun créneau disponible
              </p>
            ) : (
              timeSlots.map((slot, index) => (
                <TimeSlot
                  key={slot.startTime}
                  startTime={slot.startTime}
                  endTime={slot.endTime}
                  type={slot.type}
                  title={slot.title}
                  subtitle={slot.subtitle}
                  isLast={index === timeSlots.length - 1}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
