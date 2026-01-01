'use client';

import { useState, useEffect } from 'react';
import {
  AppShell,
  TopAppBar,
  Card,
  Toggle,
  Avatar,
  Button,
} from '@/app/components';
import type { User } from '@/lib/types';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, refused: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <AppShell>
        <TopAppBar title="Mon profil" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[var(--color-text-sub)]">Chargement...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopAppBar title="Mon profil" />
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <Avatar initials={user?.avatarInitials || 'U'} size="lg" />
          <h2 className="mt-3 text-xl font-bold text-[var(--color-text-main)]">
            {user?.name || 'Utilisateur'}
          </h2>
          <p className="text-[var(--color-text-sub)]">
            {user?.role === 'teacher' ? 'Enseignant' : user?.role === 'admin' ? 'Administrateur' : 'Étudiant'} - {user?.department}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center py-3">
            <div className="text-2xl font-bold text-[var(--color-primary)]">{stats.total}</div>
            <p className="text-[10px] text-[var(--color-text-sub)] mt-1">Réservations</p>
          </Card>
          <Card className="text-center py-3">
            <div className="text-2xl font-bold text-emerald-500">{stats.confirmed}</div>
            <p className="text-[10px] text-[var(--color-text-sub)] mt-1">Validées</p>
          </Card>
          <Card className="text-center py-3">
            <div className="text-2xl font-bold text-red-500">{stats.refused}</div>
            <p className="text-[10px] text-[var(--color-text-sub)] mt-1">Refusées</p>
          </Card>
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <h3 className="font-bold text-[var(--color-text-main)]">Paramètres</h3>
          <Toggle
            label="Notifications"
            description="Recevoir des alertes"
            icon="notifications"
          />
          <Toggle
            label="Mode sombre"
            description="Thème de l'application"
            icon="dark_mode"
          />
        </div>

        {/* Logout */}
        <Button variant="danger" size="lg" fullWidth icon="logout" iconPosition="left">
          Déconnexion
        </Button>
      </div>
    </AppShell>
  );
}
