import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Check, X, Clock, Pill, Bell } from 'lucide-react';

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night'];

export default function Medications() {
  const { user } = useAuth();
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    times: [] as string[],
    reminderEnabled: true
  });

  useEffect(() => {
    fetchMedications();
  }, [user]);

  const fetchMedications = async () => {
    if (!user || !db) return;
    try {
      const q = query(collection(db, 'medications'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      setMedications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching medications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    try {
      await addDoc(collection(db, 'medications'), {
        userId: user.uid,
        ...newMed
      });
      setShowAdd(false);
      setNewMed({ name: '', dosage: '', times: [], reminderEnabled: true });
      fetchMedications();
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };

  const toggleTimeSlot = (slot: string) => {
    setNewMed(prev => ({
      ...prev,
      times: prev.times.includes(slot)
        ? prev.times.filter(t => t !== slot)
        : [...prev.times, slot]
    }));
  };

  const logMedication = async (medId: string, timeSlot: string, status: string) => {
    if (!user || !db) return;
    try {
      await addDoc(collection(db, 'medicationLogs'), {
        userId: user.uid,
        medicationId: medId,
        date: new Date().toISOString(),
        timeSlot,
        status
      });
      // In a real app, we'd update UI to show it's logged for today
      alert(`Logged as ${status}`);
    } catch (error) {
      console.error("Error logging medication:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Medications</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Add Medication
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">New Medication</h2>
          <form onSubmit={handleAddMedication} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">Medicine Name</label>
                <input
                  type="text"
                  required
                  value={newMed.name}
                  onChange={e => setNewMed({...newMed, name: e.target.value})}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">Dosage</label>
                <input
                  type="text"
                  required
                  value={newMed.dosage}
                  onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                  placeholder="e.g., 50mg"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">Time Slots</label>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleTimeSlot(slot)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                      newMed.times.includes(slot)
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="reminder"
                type="checkbox"
                checked={newMed.reminderEnabled}
                onChange={e => setNewMed({...newMed, reminderEnabled: e.target.checked})}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor="reminder" className="ml-2 block text-sm text-slate-900">
                Enable Reminders
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newMed.name || !newMed.dosage || newMed.times.length === 0}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                Save Medication
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-500">Loading medications...</div>
        ) : medications.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-100 border-dashed">
            <Pill className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">No medications</h3>
            <p className="mt-1 text-sm text-slate-500">Get started by adding a new medication.</p>
          </div>
        ) : (
          medications.map(med => (
            <div key={med.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{med.name}</h3>
                    <p className="text-sm text-slate-500">{med.dosage}</p>
                  </div>
                  {med.reminderEnabled && (
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                      <Bell className="mr-1 h-3 w-3" /> Reminder On
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {med.times.map((time: string) => (
                    <span key={time} className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Log Today's Dose</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => logMedication(med.id, med.times[0] || 'Morning', 'Taken')}
                    className="flex-1 inline-flex justify-center items-center gap-x-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-100 ring-1 ring-inset ring-emerald-600/20"
                  >
                    <Check className="-ml-0.5 h-4 w-4" />
                    Taken
                  </button>
                  <button
                    onClick={() => logMedication(med.id, med.times[0] || 'Morning', 'Missed')}
                    className="flex-1 inline-flex justify-center items-center gap-x-1.5 rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100 ring-1 ring-inset ring-red-600/20"
                  >
                    <X className="-ml-0.5 h-4 w-4" />
                    Missed
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


