'use client';

import { useState } from 'react';
import {
  Button,
  Input,
  Select,
  Toggle,
  StatusBadge,
  FilterChip,
  Icon,
  Card,
  TabGroup,
  Avatar,
  TopAppBar,
  BottomNavigation,
  PageContainer,
  ReservationCard,
  RequestCard,
  TimeSlot,
  DateStrip,
} from '@/app/components';

export default function ComponentsDemo() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeNav, setActiveNav] = useState('schedule');
  const [selectedDate, setSelectedDate] = useState('2024-01-13');

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'history', label: 'History' },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'schedule', label: 'Schedule', icon: 'calendar_month' },
    { id: 'requests', label: 'Requests', icon: 'inbox', badge: true },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const dates = [
    { day: 'Mon', date: 12, fullDate: '2024-01-12' },
    { day: 'Tue', date: 13, fullDate: '2024-01-13' },
    { day: 'Wed', date: 14, fullDate: '2024-01-14' },
    { day: 'Thu', date: 15, fullDate: '2024-01-15' },
    { day: 'Fri', date: 16, fullDate: '2024-01-16' },
  ];

  const roomOptions = [
    { value: 'amphi-a', label: 'Amphi A (Cap: 120)' },
    { value: 'amphi-b', label: 'Amphi B (Cap: 80)' },
    { value: 'lab-1', label: 'Computer Lab 1 (Cap: 30)' },
  ];

  return (
    <PageContainer hasBottomNav>
      <TopAppBar
        title="Components Demo"
        showBackButton
        rightAction={
          <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <Icon name="dark_mode" />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {/* Buttons Section */}
        <section>
          <h3 className="text-lg font-bold mb-4">Buttons</h3>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" icon="arrow_forward">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger" icon="close" iconPosition="left">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg" fullWidth>Large Full Width</Button>
            </div>
            <Button loading>Loading...</Button>
          </div>
        </section>

        {/* Inputs Section */}
        <section>
          <h3 className="text-lg font-bold mb-4">Form Inputs</h3>
          <div className="space-y-4">
            <Input
              label="Email or Username"
              placeholder="Enter your email"
              leadingIcon="mail"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              leadingIcon="lock"
            />
            <Input
              label="With Error"
              placeholder="Invalid input"
              error="This field is required"
            />
            <Select
              label="Select Room"
              options={roomOptions}
              placeholder="e.g., Amphi A, Lab 3"
            />
            <Toggle
              label="Repeat Weekly"
              description="Book for the whole semester"
              icon="update"
            />
          </div>
        </section>

        {/* Status Badges */}
        <section>
          <h3 className="text-lg font-bold mb-4">Status Badges</h3>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="confirmed" />
            <StatusBadge status="pending" />
            <StatusBadge status="refused" />
            <StatusBadge status="available" />
            <StatusBadge status="unavailable" />
            <StatusBadge status="booked" />
          </div>
        </section>

        {/* Filter Chips */}
        <section>
          <h3 className="text-lg font-bold mb-4">Filter Chips</h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <FilterChip label="All" active />
            <FilterChip label="Conflicts" count={2} />
            <FilterChip label="Urgent" />
            <FilterChip label="Room 102" active removable onRemove={() => {}} />
          </div>
        </section>

        {/* Tabs */}
        <section>
          <h3 className="text-lg font-bold mb-4">Tab Groups</h3>
          <div className="space-y-4">
            <TabGroup tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            <TabGroup tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />
          </div>
        </section>

        {/* Date Strip */}
        <section>
          <h3 className="text-lg font-bold mb-4">Date Strip</h3>
          <DateStrip dates={dates} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </section>

        {/* Avatars */}
        <section>
          <h3 className="text-lg font-bold mb-4">Avatars</h3>
          <div className="flex gap-3 items-center">
            <Avatar size="sm" initials="JD" />
            <Avatar size="md" initials="AB" />
            <Avatar size="lg" initials="MT" />
          </div>
        </section>

        {/* Cards */}
        <section>
          <h3 className="text-lg font-bold mb-4">Cards</h3>
          <div className="space-y-3">
            <Card>
              <p className="text-sm">This is a basic card component.</p>
            </Card>
            <Card hoverable onClick={() => {}}>
              <p className="text-sm">This card is hoverable and clickable.</p>
            </Card>
          </div>
        </section>

        {/* Reservation Cards */}
        <section>
          <h3 className="text-lg font-bold mb-4">Reservation Cards</h3>
          <div className="space-y-3">
            <ReservationCard
              roomName="Amphi A"
              courseName="Course: Advanced Algorithms"
              date="Oct 24"
              timeSlot="08:30 - 10:30"
              status="confirmed"
            />
            <ReservationCard
              roomName="Lab Networks 1"
              courseName="Workshop: Cisco Setup"
              date="Oct 26"
              timeSlot="14:00 - 16:00"
              status="pending"
            />
            <ReservationCard
              roomName="Meeting Room 3"
              courseName="Dept Meeting"
              date="Nov 05"
              timeSlot="09:00 - 10:00"
              status="refused"
              isRefused
            />
          </div>
        </section>

        {/* Request Cards */}
        <section>
          <h3 className="text-lg font-bold mb-4">Request Cards (Admin)</h3>
          <div className="space-y-3">
            <RequestCard
              roomName="Amphi 3"
              requesterName="Mrs. Benali"
              department="Computer Science"
              date="Oct 24, 2023"
              timeSlot="08:30 - 10:30"
              conflictMessage="Conflict with Mr. Idrissi (09:00 - 10:00)"
            />
            <RequestCard
              roomName="Lab B2"
              requesterName="Prof. Alami"
              department="Electronics"
              date="Oct 25, 2023"
              timeSlot="14:00 - 16:00"
            />
            <RequestCard
              roomName="Salle 4"
              requesterName="Mr. Tazi"
              department="Mathematics"
              date="Oct 26, 2023"
              timeSlot="10:00 - 12:00"
              avatarInitials="MT"
              compact
            />
          </div>
        </section>

        {/* Time Slots */}
        <section>
          <h3 className="text-lg font-bold mb-4">Time Slots (Calendar)</h3>
          <div className="space-y-0">
            <TimeSlot
              startTime="08:00"
              endTime="10:00"
              type="booked"
              title="CS Lecture"
              subtitle="Prof. Anderson"
            />
            <TimeSlot
              startTime="10:00"
              endTime="12:00"
              type="available"
            />
            <TimeSlot
              startTime="12:00"
              endTime="14:00"
              type="maintenance"
              title="Maintenance"
              subtitle="AC Repair"
            />
            <TimeSlot
              startTime="14:00"
              endTime="16:00"
              type="myBooking"
              title="Project Meeting"
              subtitle="4 Attendees"
              isLast
            />
          </div>
        </section>

        {/* Spacer for bottom nav */}
        <div className="h-8" />
      </main>

      <BottomNavigation
        items={navItems}
        activeItem={activeNav}
        onItemClick={setActiveNav}
      />
    </PageContainer>
  );
}
