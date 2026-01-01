'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppShell,
  TopAppBar,
  Card,
  FilterChip,
  Icon,
  Button,
  BottomSheet,
} from '@/app/components';
import type { Room } from '@/lib/types';

// All types for filtering
const allTypes = ['Salle', 'Amphi', 'Labo'];

export default function RoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Quick filter (building)
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  
  // Advanced filters
  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [minCapacity, setMinCapacity] = useState<number | null>(null);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch('/api/rooms');
        if (res.ok) {
          const data = await res.json();
          setRooms(data.rooms);
          setAllRooms(data.rooms);
          
          // Extract unique buildings and equipment
          const uniqueBuildings = [...new Set(data.rooms.map((r: Room) => r.building))] as string[];
          const uniqueEquipment = [...new Set(data.rooms.flatMap((r: Room) => r.equipment))] as string[];
          setBuildings(uniqueBuildings);
          setEquipment(uniqueEquipment);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  const toggleArrayItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const hasAdvancedFilters =
    selectedBuildings.length > 0 ||
    selectedTypes.length > 0 ||
    selectedEquipment.length > 0 ||
    minCapacity !== null;

  const activeFiltersCount =
    selectedBuildings.length +
    selectedTypes.length +
    selectedEquipment.length +
    (minCapacity ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedBuildings([]);
    setSelectedTypes([]);
    setSelectedEquipment([]);
    setMinCapacity(null);
    setQuickFilter(null);
    setRooms(allRooms);
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...allRooms];

    // Quick filter
    if (quickFilter) {
      if (quickFilter === 'labo') {
        filtered = filtered.filter(room => room.type === 'Labo');
      } else {
        filtered = filtered.filter(room => room.building.includes(quickFilter));
      }
    }

    // Building filter
    if (selectedBuildings.length > 0) {
      filtered = filtered.filter(room => selectedBuildings.includes(room.building));
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(room => selectedTypes.includes(room.type));
    }

    // Equipment filter
    if (selectedEquipment.length > 0) {
      filtered = filtered.filter(room =>
        selectedEquipment.every(eq => room.equipment.includes(eq))
      );
    }

    // Capacity filter
    if (minCapacity) {
      filtered = filtered.filter(room => room.capacity >= minCapacity);
    }

    setRooms(filtered);
  }, [quickFilter, selectedBuildings, selectedTypes, selectedEquipment, minCapacity, allRooms]);

  const handleRoomClick = (roomId: string) => {
    router.push(`/rooms/${roomId}`);
  };

  if (loading) {
    return (
      <AppShell>
        <TopAppBar title="Salles disponibles" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[var(--color-text-sub)]">Chargement...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopAppBar
        title="Salles disponibles"
        rightAction={
          <button
            onClick={() => setIsFilterOpen(true)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Icon name="tune" className="text-[var(--color-text-main)]" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto">
        {/* Quick Filters */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          <FilterChip
            label="Tous"
            active={quickFilter === null && !hasAdvancedFilters}
            onClick={() => {
              setQuickFilter(null);
              clearAllFilters();
            }}
          />
          {buildings.map(building => (
            <FilterChip
              key={building}
              label={building}
              active={quickFilter === building}
              onClick={() => setQuickFilter(quickFilter === building ? null : building)}
            />
          ))}
          <FilterChip
            label="Labo"
            active={quickFilter === 'labo'}
            onClick={() => setQuickFilter(quickFilter === 'labo' ? null : 'labo')}
          />
        </div>

        {/* Active Advanced Filters Badge */}
        {hasAdvancedFilters && (
          <div className="px-4 pb-3 flex items-center gap-2">
            <span className="text-xs text-[var(--color-text-sub)]">
              {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
            </span>
            <button
              onClick={clearAllFilters}
              className="text-xs text-[var(--color-primary)] font-medium"
            >
              Effacer tout
            </button>
          </div>
        )}

        {/* Room List */}
        <div className="px-4 space-y-3 pb-4">
          {rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Icon name="search_off" size="xl" className="text-slate-400" />
              </div>
              <p className="text-[var(--color-text-sub)]">
                Aucune salle trouvée avec ces critères
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="mt-2"
              >
                Effacer les filtres
              </Button>
            </div>
          ) : (
            rooms.map((room) => (
              <Card key={room.id} hoverable onClick={() => handleRoomClick(room.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <Icon
                      name={room.type === 'Amphi' ? 'stadium' : room.type === 'Labo' ? 'computer' : 'meeting_room'}
                      className="text-[var(--color-primary)]"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[var(--color-text-main)]">{room.name}</h3>
                    <p className="text-sm text-[var(--color-text-sub)]">
                      {room.building} • {room.capacity} places
                    </p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {room.equipment.map((eq) => (
                        <span
                          key={eq}
                          className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Icon name="chevron_right" className="text-slate-400" />
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Advanced Filters Sheet */}
      <BottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtres avancés"
      >
        <div className="space-y-6">
          {/* Building Filter */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-main)] mb-3">Bâtiment</h4>
            <div className="flex flex-wrap gap-2">
              {buildings.map((building) => (
                <FilterChip
                  key={building}
                  label={building}
                  active={selectedBuildings.includes(building)}
                  onClick={() => setSelectedBuildings(toggleArrayItem(selectedBuildings, building))}
                />
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-main)] mb-3">Type de salle</h4>
            <div className="flex flex-wrap gap-2">
              {allTypes.map((type) => (
                <FilterChip
                  key={type}
                  label={type}
                  active={selectedTypes.includes(type)}
                  onClick={() => setSelectedTypes(toggleArrayItem(selectedTypes, type))}
                />
              ))}
            </div>
          </div>

          {/* Equipment Filter */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-main)] mb-3">Équipements requis</h4>
            <div className="flex flex-wrap gap-2">
              {equipment.map((eq) => (
                <FilterChip
                  key={eq}
                  label={eq}
                  active={selectedEquipment.includes(eq)}
                  onClick={() => setSelectedEquipment(toggleArrayItem(selectedEquipment, eq))}
                />
              ))}
            </div>
          </div>

          {/* Capacity Filter */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-main)] mb-3">Capacité minimum</h4>
            <div className="flex flex-wrap gap-2">
              {[20, 30, 50, 100].map((cap) => (
                <FilterChip
                  key={cap}
                  label={`${cap}+ places`}
                  active={minCapacity === cap}
                  onClick={() => setMinCapacity(minCapacity === cap ? null : cap)}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={clearAllFilters}
            >
              Réinitialiser
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setIsFilterOpen(false)}
            >
              Appliquer ({rooms.length})
            </Button>
          </div>
        </div>
      </BottomSheet>
    </AppShell>
  );
}
