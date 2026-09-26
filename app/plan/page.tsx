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

export default function PlanPage() {
  const [activeTab, setActiveTab] = useState<'today' | 'saved'>('today');
  const [todayPlan, setTodayPlan] = useState<Workout[]>([]);
  const [savedList, setSavedList] = useState<Workout[]>([]);

  useEffect(() => {
    const localPlan = JSON.parse(localStorage.getItem('todayPlan') || '[]');
    const localSaved = JSON.parse(localStorage.getItem('savedList') || '[]');
    setTodayPlan(localPlan);
    setSavedList(localSaved);
  }, []);

  const removeFromPlan = (id: string | number) => {
    const updated = todayPlan.filter((item) => String(item.id) !== String(id));
    setTodayPlan(updated);
    localStorage.setItem('todayPlan', JSON.stringify(updated));
  };

  const removeFromSaved = (id: string | number) => {
    const updated = savedList.filter((item) => String(item.id) !== String(id));
    setSavedList(updated);
    localStorage.setItem('savedList', JSON.stringify(updated));
  };

  const currentList = activeTab === 'today' ? todayPlan : savedList;

  // Calculate totals for today plan
  const totalExercises = todayPlan.length;
  const totalMinutes = todayPlan.reduce((acc, item) => acc + (Number(item.duration) || 20), 0);
  const totalCalories = todayPlan.reduce((acc, item) => acc + (Number(item.caloriesBurned) || 150), 0);

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800 bg-[#0b0f19]/90 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" width={32} height={32} />
          <span className="font-extrabold tracking-widest text-lg">FITLOG</span>
        </div>
        <div className="flex items-center gap-6 font-medium text-sm">
          <Link href="/" className="text-zinc-400 hover:text-[#ccff00] transition px-3 py-1 rounded-md">Workouts</Link>
          <Link href="/plan" className="text-[#ccff00] font-bold px-3 py-1 rounded-md">My Plan</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/plan" className=" text-white px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-2">
            Plan <span className="bg-[#ccff00] text-black px-2 py-0.5 rounded-full">{todayPlan.length}</span>
          </Link>
          <Link href="/plan" className=" px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 hover:border-white">
            Saved <span className="bg-zinc-800 px-2 py-0.5 rounded-full">{savedList.length}</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-8 md:px-16 py-10 max-w-6xl mx-auto space-y-8">
        
        {/* Header section */}
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider">MY PLAN</h1>
          <p className="text-zinc-400 text-xs mt-1">List of live lifts for today. Finish them, then load more.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 text-center">
          <div>
            <p className="text-zinc-400 text-xs uppercase font-semibold">Exercises</p>
            <p className="text-2xl md:text-3xl font-black text-[#ccff00] mt-1">{totalExercises}</p>
          </div>
          <div className="border-x border-zinc-800">
            <p className="text-zinc-400 text-xs uppercase font-semibold">Minutes</p>
            <p className="text-2xl md:text-3xl font-black text-white mt-1">{totalMinutes}</p>
          </div>
          <div>
            <p className="text-zinc-400 text-xs uppercase font-semibold">Calories</p>
            <p className="text-2xl md:text-3xl font-black text-white mt-1">{totalCalories}</p>
          </div>
        </div>

        {/* Tabs & Sort Section (Same Row, No Line) */}
<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
  
  {/* Left Side: Tabs */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => setActiveTab('today')}
      className={`px-5 py-2 rounded-xl text-xs font-extrabold uppercase transition cursor-pointer ${
        activeTab === 'today'
          ? 'bg-[#ccff00] text-black shadow-lg'
          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
      }`}
    >
      Today's Plan ({todayPlan.length})
    </button>
    
    <button
      onClick={() => setActiveTab('saved')}
      className={`px-5 py-2 rounded-xl text-xs font-extrabold uppercase transition cursor-pointer ${
        activeTab === 'saved'
          ? 'bg-[#ccff00] text-black shadow-lg'
          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
      }`}
    >
      Saved ({savedList.length})
    </button>
  </div>

  {/* Right Side: Sort By Dropdown */}
  <div className="flex items-center gap-2 text-xs text-zinc-400">
    <span>Sort By</span>
    <select
      className="bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded-xl outline-none cursor-pointer"
      onChange={(e) => {
        // Apnar sorting logic ekhane thakbe
      }}
    >
      <option value="duration">Duration</option>
      <option value="calories">Calories</option>
      <option value="rating">Rating</option>
    </select>
  </div>

</div>

        {/* Horizontal Card List */}
        {currentList.length === 0 ? (
  <div className="text-center py-16 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
    <h3 className="text-xl font-extrabold tracking-wider text-white mb-2">
      NOTHING HERE YET
    </h3>
    <p className="text-xs text-zinc-400 mb-6">
      Browse the library and add a lift to get today moving.
    </p>
    <Link href="/" className="inline-block bg-[#ccff00] text-black font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:opacity-90 transition">
      Go to Workouts
    </Link>
  </div>
) : (
          <div className="space-y-4">
            {currentList.map((item) => (
              <div 
                key={item.id} 
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-zinc-700 transition"
              >
                {/* Left side: Image, Name & Stats */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative h-16 w-24 bg-zinc-800 rounded-xl overflow-hidden shrink-0">
                    <img src={item.image || '/banner.png'} alt={item.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm uppercase text-white tracking-wide">{item.name}</h3>
                    <p className="text-zinc-400 text-xs uppercase">{item.equipment || item.muscleGroups?.join(', ') || 'Bodyweight'}</p>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-1">
                      <span>⏱ {item.duration || 20} min</span>
                      <span>🔥 {item.caloriesBurned || 150} kcal</span>
                      <span>⭐ {item.rating || 4.5}</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <Link 
                    href={`/workout/${item.id}`} 
                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    View Details
                  </Link>
                  
                  {activeTab === 'today' && (
                   <button className="bg-[#ccff00] text-black font-bold px-4 py-2 rounded-xl text-xs hover:opacity-90 transition cursor-pointer">
  ✓ Mark as Done
</button>
                  )}
                  <button 
                    onClick={() => activeTab === 'today' ? removeFromPlan(item.id) : removeFromSaved(item.id)}
                    className=" text-white hover:bg-red-500 hover:text-white px-3 py-2 rounded-xl text-xs transition font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Footer Section */}
<footer className="flex flex-col md:flex-row items-center justify-between px-8 py-6 bg-zinc-950 border-t border-zinc-900 text-xs text-zinc-500 mt-12">
  <div className="flex items-center gap-2 font-bold text-white">
    <img src="/logo.png" alt="Logo" width={20} height={20} />
    <span>FITLOG</span>
  </div>
  <p>© 2026 FitLog - Workout Library. Train hard, log honest.</p>
</footer>

    </main>
  );
}