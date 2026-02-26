import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';

export default function Layout() {
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!user || !db) return;

    // Simple reminder check every minute
    const interval = setInterval(async () => {
      if (Notification.permission !== 'granted') return;

      const now = new Date();
      const hour = now.getHours();
      let currentSlot = '';
      
      if (hour >= 6 && hour < 12) currentSlot = 'Morning';
      else if (hour >= 12 && hour < 17) currentSlot = 'Afternoon';
      else if (hour >= 17 && hour < 21) currentSlot = 'Evening';
      else currentSlot = 'Night';

      try {
        const q = query(
          collection(db, 'medications'), 
          where('userId', '==', user.uid),
          where('reminderEnabled', '==', true)
        );
        const snapshot = await getDocs(q);
        
        snapshot.docs.forEach(doc => {
          const med = doc.data();
          if (med.times.includes(currentSlot)) {
            // In a real app, we'd check if it was already logged today
            // For MVP, we just show the notification
            new Notification('Medication Reminder', {
              body: `It's time to take ${med.name} (${med.dosage})`,
              icon: '/vite.svg'
            });
          }
        });
      } catch (error) {
        console.error("Error checking reminders:", error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
        <footer className="mt-12 text-center text-xs text-slate-400 pb-8">
          This platform is for self-tracking purposes only and does not provide medical diagnosis or treatment.
        </footer>
      </main>
    </div>
  );
}
