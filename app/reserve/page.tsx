'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PageContainer,
  TopAppBar,
  Input,
  Select,
  Toggle,
  Button,
} from '@/app/components';
import type { Room } from '@/lib/types';

// Standard time slots
const TIME_SLOTS = [
  { value: '08:30-10:30', label: '08:30 - 10:30' },
  { value: '10:30-12:30', label: '10:30 - 12:30' },
  { value: '14:00-16:00', label: '14:00 - 16:00' },
  { value: '16:00-18:00', label: '16:00 - 18:00' },
];

export default function ReservePage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    courseName: '',
    roomId: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
    isRecurring: false,
  });

  // Fetch rooms and current user
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch rooms
        const roomsRes = await fetch('/api/rooms');
        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          setRooms(roomsData.rooms);
        }

        // Fetch current user
        const userRes = await fetch('/api/user/me');
        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUserId(userData.user.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!formData.courseName || !formData.roomId || !formData.timeSlot || !currentUserId) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const [startTime, endTime] = formData.timeSlot.split('-');
      
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: formData.roomId,
          userId: currentUserId,
          courseName: formData.courseName,
          date: formData.date,
          startTime,
          endTime,
          isRecurring: formData.isRecurring,
        }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.error || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      setError('Erreur de connexion');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <TopAppBar
          title="Nouvelle réservation"
          showBackButton
          onBack={() => router.back()}
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[var(--color-text-sub)]">Chargement...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <TopAppBar
        title="Nouvelle réservation"
        showBackButton
        onBack={() => router.back()}
      />
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        <Input
          label="Nom du cours"
          placeholder="Ex: Développement Web"
          leadingIcon="school"
          value={formData.courseName}
          onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
        />

        <Select
          label="Salle"
          placeholder="Sélectionner une salle"
          options={rooms.map((room) => ({
            value: room.id,
            label: `${room.name} (${room.capacity} places)`,
          }))}
          value={formData.roomId}
          onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
        />

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />

        <Select
          label="Créneau horaire"
          placeholder="Sélectionner un créneau"
          options={TIME_SLOTS}
          value={formData.timeSlot}
          onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
        />

        <Toggle
          label="Réservation récurrente"
          description="Répéter chaque semaine"
          icon="repeat"
          checked={formData.isRecurring}
          onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
        />

        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="pt-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon="send"
            iconPosition="right"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Envoi...' : 'Soumettre la demande'}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
