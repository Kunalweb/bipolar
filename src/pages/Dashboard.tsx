import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { format, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Pill, Moon, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [moods, setMoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !db) return;
      try {
        const sevenDaysAgo = subDays(new Date(), 7).toISOString();
        const moodsRef = collection(db, 'moods');
        const q = query(
          moodsRef,
          where('userId', '==', user.uid),
          where('date', '>=', sevenDaysAgo),
          orderBy('date', 'asc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedMoods = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          formattedDate: format(new Date(doc.data().date), 'MMM dd')
        }));
        setMoods(fetchedMoods);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getPatternAlert = () => {
    if (moods.length < 5) return null;
    const recent5 = moods.slice(-5);
    const allHighEnergy = recent5.every(m => m.energyLevel > 8);
    if (allHighEnergy) return "High energy pattern detected.";

    if (moods.length >= 7) {
      const recent7 = moods.slice(-7);
      const allSad = recent7.every(m => m.moodType === 'Sad');
      if (allSad) return "Persistent low mood pattern.";
    }
    return null;
  };

  const patternAlert = getPatternAlert();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {profile?.name || 'User'}</h1>
      </div>

      {patternAlert && (
        <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Pattern Alert</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>{patternAlert}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-slate-500">Average Energy (7 days)</dt>
                  <dd className="text-2xl font-semibold text-slate-900">
                    {moods.length > 0 
                      ? (moods.reduce((acc, m) => acc + m.energyLevel, 0) / moods.length).toFixed(1)
                      : '-'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Moon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-slate-500">Average Sleep (7 days)</dt>
                  <dd className="text-2xl font-semibold text-slate-900">
                    {moods.length > 0 
                      ? (moods.reduce((acc, m) => acc + m.sleepHours, 0) / moods.length).toFixed(1) + 'h'
                      : '-'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Pill className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-slate-500">Medication Adherence</dt>
                  <dd className="text-2xl font-semibold text-slate-900">
                    --%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">Energy Levels (Last 7 Days)</h2>
        <div className="h-72 w-full">
          {moods.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moods} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="formattedDate" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="energyLevel" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">
              No data available for the last 7 days. Log your mood to see insights.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
