'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Workout {
  id: string | number;
  name: string;
  description?: string;
  equipment?: string;
  difficulty?: string;
  sets?: string | number;
  reps?: string | number;
  duration?: number;
  caloriesBurned?: number;
  rating?: number;
  muscleGroups?: string[];
  image?: string;
}

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('duration');
  const [todayPlan, setTodayPlan] = useState<Workout[]>([]);
  const [savedList, setSavedList] = useState<Workout[]>([]);

  useEffect(() => {
    fetch('https://api.abcz.workers.dev/api/fitlog')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        list.sort((a: any, b: any) => Number(a.id) - Number(b.id));
        setWorkouts(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    const localPlan = JSON.parse(localStorage.getItem('todayPlan') || '[]');
    const localSaved = JSON.parse(localStorage.getItem('savedList') || '[]');
    setTodayPlan(localPlan);
    setSavedList(localSaved);
  }, []);

  const sortedWorkouts = [...workouts].sort((a: any, b: any) => Number(a.id) - Number(b.id));

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">

      {/* Navbar */}

      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800 bg-[#0b0f19]/80 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" width={32} height={32} />
          <span className="font-extrabold tracking-widest text-lg">FITLOG</span>
        </div>
        <div className="flex items-center gap-6 font-medium text-sm">
          <Link href="/" className="text-[#ccff00] bg-[#ccff00]/10 px-3 py-1 rounded-md">Workout</Link>
          <Link href="/plan" className="hover:text-[#ccff00] transition">My Plan</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/plan" className="text-white px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-2">
            Plan <span className="bg-[#ccff00] text-black px-2 py-0.5 rounded-full">{todayPlan.length}</span>
          </Link>
          <Link href="/plan" className=" px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 hover:border-white">
            Saved <span className="bg-zinc-800 px-2 py-0.5 rounded-full">{savedList.length}</span>
          </Link>
        </div>
      </nav>

      {/* Hero Banner Section */}
      
      <section className="px-8 md:px-16 py-8">
        <div className="bg-[#121624] border border-zinc-800/80 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-2xl">
          <div className="max-w-2xl space-y-5 z-10">
            <span className="text-[#ccff00] font-extrabold text-xs tracking-widest uppercase">WORKOUT LIBRARY</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none">
              TRAIN WITH INTENT. LOG EVERY SET.
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today's plan, and watch the week's work add up.
            </p>
            <div>
              <a href="#library" className="inline-block bg-[#ccff00] text-black font-extrabold px-5 py-2.5 rounded-lg text-xs hover:opacity-90 transition">
                BROWSE WORKOUTS ↓
              </a>
            </div>
          </div>
          <div className="mt-8 md:mt-0 relative w-full md:w-95 h-65 flex items-center justify-center">
            <img src="/banner.png" alt="Banner" className="object-contain w-full h-full drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Library Section */}
      <section id="library" className="px-8 md:px-16 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider">THE LIBRARY</h2>
            <p className="text-zinc-400 text-sm">Twelve lifts covering every major muscle group.</p>
          </div>
          
        </div>

        {loading ? (
          <div className="text-center py-24 text-zinc-400 font-semibold animate-pulse">Loading workouts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedWorkouts.map((item) => (
              <Link key={item.id} href={`/workout/${item.id}`} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition group">
                <div className="relative h-48 w-full bg-zinc-800">
                  <img src={item.image || '/banner.png'} alt={item.name || 'Workout'} className="object-cover w-full h-full group-hover:scale-105 transition duration-300" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    {item.muscleGroups?.map((group: string, idx: number) => (
                      <span key={idx} className="bg-[#ccff00]/10 text-[#ccff00] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        {group}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-base uppercase">{item.name}</h3>
                  <p className="text-zinc-400 text-xs">{item.equipment}</p>
                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                    <span>⏱ {item.duration} min</span>
                    <span>🔥 {item.caloriesBurned} kcal</span>
                    <span>⭐ {item.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

       {/* {footer section} */}
      <footer className="flex flex-col md:flex-row items-center justify-between px-8 py-6 bg-zinc-950 border-t border-zinc-900 text-xs text-zinc-500 mt-12">
        <div className="flex items-center gap-2 font-bold text-white">
          <img src="/logo.png" alt="Logo" width={20} height={20} />
          <span>FITLOG</span>
        </div>
        <p>© 2026 FitLog — Workout Library. Train hard, log honest.</p>
      </footer> 
    </main>
  );
}