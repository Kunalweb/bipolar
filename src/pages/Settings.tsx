import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { profile, user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-slate-900">Profile Information</h3>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <dl className="divide-y divide-slate-100">
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-slate-900">Full name</dt>
                <dd className="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{profile?.name || 'Not set'}</dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-slate-900">Email address</dt>
                <dd className="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{user?.email}</dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-slate-900">Diagnosed Condition</dt>
                <dd className="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{profile?.condition || 'None'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-slate-900">Notifications</h3>
          <div className="mt-2 max-w-xl text-sm text-slate-500">
            <p>Manage how you receive reminders for your medications and mood logging.</p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
              onClick={() => {
                if ('Notification' in window) {
                  Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                      alert('Notifications enabled!');
                    }
                  });
                }
              }}
            >
              Enable Browser Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
