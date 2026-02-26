import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Bell, LineChart } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <span className="text-2xl font-bold text-indigo-600">MoodSync</span>
          </div>
          <div className="flex flex-1 justify-end">
            <Link to="/dashboard" className="text-sm font-semibold leading-6 text-slate-900 hover:text-indigo-600 transition-colors">
              Go to Dashboard <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="isolate">
        {/* Hero section */}
        <div className="relative pt-14">
          <div className="py-24 sm:py-32 lg:pb-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                  Track your mood. <br />Understand your patterns.
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  A secure, private platform to log your daily mood, track sleep, record medication intake, and gain insights into your emotional well-being.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    to="/dashboard"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                  >
                    Get started
                  </Link>
                  <a href="#features" className="text-sm font-semibold leading-6 text-slate-900">
                    Learn more <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div id="features" className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Track Everything</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to monitor your mental health
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Activity className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Daily Mood Logging
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Log your mood type, energy level, sleep hours, and add notes to keep a detailed journal of your emotional state.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Bell className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Medication Reminders
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Set up your medication schedule and receive browser notifications so you never miss a dose.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <LineChart className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Weekly Analytics
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  View beautiful charts showing your mood patterns, energy levels, and medication adherence over time.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Private & Secure
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Your data is encrypted and secure. We never sell your data to third parties. GDPR compliant privacy practices.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-sm leading-5 text-slate-500">
            &copy; {new Date().getFullYear()} MoodSync. All rights reserved.
          </p>
          <p className="mt-4 text-xs leading-5 text-slate-400 max-w-2xl mx-auto">
            Disclaimer: This platform is for self-tracking purposes only and does not provide medical diagnosis or treatment. If you are in crisis, please contact your local emergency services.
          </p>
        </div>
      </footer>
    </div>
  );
}
