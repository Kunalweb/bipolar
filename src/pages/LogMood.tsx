import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const MOOD_TYPES = [
  'Happy',
  'Extremely Happy',
  'Sad',
  'Angry',
  'Irritable',
  'Neutral'
];

export default function LogMood() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [moodType, setMoodType] = useState('');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState(8);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    try {
      setLoading(true);
      setError('');
      
      const today = new Date().toISOString().split('T')[0];
      
      // Check if already logged today
      const moodsRef = collection(db, 'moods');
      const q = query(
        moodsRef, 
        where('userId', '==', user.uid),
        where('date', '>=', today + 'T00:00:00.000Z'),
        where('date', '<=', today + 'T23:59:59.999Z')
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setError('You have already logged your mood today. Editing is coming soon.');
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'moods'), {
        userId: user.uid,
        date: new Date().toISOString(),
        moodType,
        energyLevel,
        sleepHours,
        notes
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Log Daily Mood</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900 mb-4">
              How are you feeling today?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MOOD_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMoodType(type)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors border ${
                    moodType === type
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">
              Energy Level (1-10)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-lg font-semibold text-indigo-600 w-8 text-center">
                {energyLevel}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Low (1-3)</span>
              <span>Moderate (4-6)</span>
              <span>High (7-10)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">
              Sleep Hours
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              required
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">
              Notes (Optional)
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              placeholder="Any specific events or thoughts today?"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !moodType}
              className="w-full rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
