'use client';

import { useRouter, usePathname } from 'next/navigation';
import { PageContainer, BottomNavigation } from '@/app/components';
import { type ReactNode } from 'react';

const navItems = [
  { id: 'home', label: 'Accueil', icon: 'home' },
  { id: 'rooms', label: 'Salles', icon: 'meeting_room' },
  { id: 'requests', label: 'Demandes', icon: 'pending_actions', badge: true },
  { id: 'profile', label: 'Profil', icon: 'person' },
];

const routeMap: Record<string, string> = {
  home: '/',
  rooms: '/rooms',
  requests: '/requests',
  profile: '/profile',
};

const pathToNav: Record<string, string> = {
  '/': 'home',
  '/rooms': 'rooms',
  '/requests': 'requests',
  '/profile': 'profile',
};

interface AppShellProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

export function AppShell({ children, showBottomNav = true }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const activeNav = pathToNav[pathname] || 'home';

  const handleNavClick = (itemId: string) => {
    const route = routeMap[itemId];
    if (route) {
      router.push(route);
    }
  };

  return (
    <PageContainer hasBottomNav={showBottomNav}>
      {children}
      {showBottomNav && (
        <BottomNavigation
          items={navItems}
          activeItem={activeNav}
          onItemClick={handleNavClick}
        />
      )}
    </PageContainer>
  );
}
