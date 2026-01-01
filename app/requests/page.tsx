'use client';

import { useState, useEffect } from 'react';
import {
  AppShell,
  TopAppBar,
  TabGroup,
  RequestCard,
  Icon,
} from '@/app/components';
import type { ReservationWithDetails } from '@/lib/types';

// Date formatter
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  };
  return date.toLocaleDateString('fr-FR', options);
}

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch requests based on status
  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      try {
        const res = await fetch(`/api/reservations?status=${activeTab}`);
        if (res.ok) {
          const data = await res.json();
          setRequests(data.reservations);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [activeTab]);

  const handleValidate = async (id: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' }),
      });
      if (res.ok) {
        // Remove from current list
        setRequests(requests.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error validating request:', error);
    }
  };

  const handleRefuse = async (id: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'refused' }),
      });
      if (res.ok) {
        // Remove from current list
        setRequests(requests.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error refusing request:', error);
    }
  };

  return (
    <AppShell>
      <TopAppBar title="Demandes de réservation" />
      <TabGroup
        tabs={[
          { id: 'pending', label: 'En attente' },
          { id: 'confirmed', label: 'Validées' },
          { id: 'refused', label: 'Refusées' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-[var(--color-text-sub)]">Chargement...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <Icon name="inbox" size="xl" className="text-slate-400" />
            </div>
            <p className="text-[var(--color-text-sub)]">
              Aucune demande {activeTab === 'confirmed' ? 'validée' : activeTab === 'refused' ? 'refusée' : 'en attente'}
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <RequestCard
              key={request.id}
              roomName={request.roomName}
              requesterName={request.userName}
              department={request.userDepartment}
              date={formatDate(request.date)}
              timeSlot={`${request.startTime} - ${request.endTime}`}
              avatarInitials={request.userAvatarInitials}
              onValidate={activeTab === 'pending' ? () => handleValidate(request.id) : undefined}
              onRefuse={activeTab === 'pending' ? () => handleRefuse(request.id) : undefined}
            />
          ))
        )}
      </div>
    </AppShell>
  );
}
