'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  instructions?: string[];
}

export default function WorkoutDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [todayPlan, setTodayPlan] = useState<Workout[]>([]);
  const [savedList, setSavedList] = useState<Workout[]>([]);
  const [addedToPlan, setAddedToPlan] = useState<boolean>(false);
  const [savedLater, setSavedLater] = useState<boolean>(false);
  
  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`https://api.abcz.workers.dev/api/fitlog/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const item = data.data || data;
        setWorkout(item);
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

    if (localPlan.some((item: Workout) => String(item.id) === String(id))) {
      setAddedToPlan(true);
    }
    if (localSaved.some((item: Workout) => String(item.id) === String(id))) {
      setSavedLater(true);
    }
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToPlan = () => {
    if (!workout) return;
    const exists = todayPlan.some((item) => String(item.id) === String(workout.id));
    
    if (exists) {
      showToast('⚠️ Already in your plan!');
    } else {
      const updated = [...todayPlan, workout];
      setTodayPlan(updated);
      localStorage.setItem('todayPlan', JSON.stringify(updated));
      setAddedToPlan(true);
      showToast('✓ Added Successfully!');
    }
  };

  const handleSaveForLater = () => {
    if (!workout) return;
    const exists = savedList.some((item) => String(item.id) === String(workout.id));
    
    if (exists) {
      showToast('⚠️ Already saved for later!');
    } else {
      const updated = [...savedList, workout];
      setSavedList(updated);
      localStorage.setItem('savedList', JSON.stringify(updated));
      setSavedLater(true);
      showToast('✓ Saved for later!');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center">
        <p className="font-bold text-zinc-400 animate-pulse">Loading workout details...</p>
      </main>
    );
  }

  if (!workout) {
    return (
      <main className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center">
        <p className="font-bold text-red-500 mb-4">Workout not found!</p>
        <Link href="/" className="bg-[#ccff00] text-black px-4 py-2 rounded-lg font-bold text-xs">
          Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white relative">
      {/* Toast Notification Popup (Top Center) */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#121624] border border-[#ccff00] text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800 bg-[#0b0f19]/90 backdrop-blur sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" width={32} height={32} />
          <span className="font-extrabold tracking-widest text-lg">FITLOG</span>
        </div>
        <div className="flex items-center gap-6 font-medium text-sm">
          <Link href="/" className="text-zinc-400 hover:text-[#ccff00] transition px-3 py-1 rounded-md">Workout</Link>
          <Link href="/plan" className="text-zinc-400 hover:text-[#ccff00] transition px-3 py-1 rounded-md">My Plan</Link>
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

      {/* Details Container */}
      <div className="px-8 md:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Left Side: Image */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl h-full md:h-full flex items-center justify-center">
            <img src={workout.image || '/banner.png'} alt={workout.name} className="object-cover w-full h-full" />
          </div>

          {/* Right Side: Info & Actions */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider">{workout.name}</h1>
              <p className="text-zinc-400 text-xs md:text-sm mt-2 leading-relaxed">
                {workout.description || "A compound lift that targets chest thickness, triceps, and anterior deltoids from a stable bench."}
              </p>
            </div>

            {/* Muscle Group Badges */}
            <div className="flex gap-2 flex-wrap">
              {workout.muscleGroups?.map((group, idx) => (
                <span key={idx} className="bg-[#ccff00] text-black text-[10px] font-extrabold px-3 py-1 rounded-md uppercase">
                  {group}
                </span>
              ))}
            </div>

            {/* Stats / Specification Rows */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-4 text-xs">
              <div className="flex justify-between border-b border-zinc-800 pb-3">
                <span className="text-zinc-400 uppercase font-semibold">Equipment</span>
                <span className="font-bold text-white uppercase">{workout.equipment || 'Barbell, Bench'}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-3">
                <span className="text-zinc-400 uppercase font-semibold">Difficulty</span>
                <span className="font-bold text-white uppercase">{workout.difficulty || 'Intermediate'}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-3">
                <span className="text-zinc-400 uppercase font-semibold">Sets</span>
                <span className="font-bold text-white uppercase">{workout.sets || '4'}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-3">
                <span className="text-zinc-400 uppercase font-semibold">Reps</span>
                <span className="font-bold text-white uppercase">{workout.reps || '8'}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-3">
                <span className="text-zinc-400 uppercase font-semibold">Duration</span>
                <span className="font-bold text-white uppercase">{workout.duration || 25} min</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-3">
                <span className="text-zinc-400 uppercase font-semibold">Calories</span>
                <span className="font-bold text-white uppercase">{workout.caloriesBurned || 180} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 uppercase font-semibold">Rating</span>
                <span className="font-bold text-white uppercase">⭐ {workout.rating || 4.8}</span>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-3">
              <h3 className="font-extrabold uppercase text-sm tracking-wider text-[#ccff00]">Instructions</h3>
              <ol className="list-decimal list-inside space-y-2 text-xs text-zinc-300 leading-relaxed">
                {workout.instructions && workout.instructions.length > 0 ? (
                  workout.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))
                ) : (
                  <>
                    <li>Lie on the bench with eyes under the bar and feet planted.</li>
                    <li>Grip bar with locked elbows and lower the bar to mid-chest.</li>
                    <li>Press up in slight arch until elbows lock without bouncing.</li>
                    <li>Keep shoulder blades pinched and maintain arch in the back.</li>
                  </>
                )}
              </ol>
            </div>
            

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button 
                onClick={handleAddToPlan}
                className={`flex-1 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer ${addedToPlan ? 'bg-zinc-800 text-[#ccff00] border border-[#ccff00]' : 'bg-[#ccff00] text-black hover:opacity-90'}`}
              >
                {addedToPlan ? '✓ Added to Today\'s Plan' : '✓ Add to Today\'s Plan'}
              </button>
              <button 
                onClick={handleSaveForLater}
                className={`flex-1 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition border shadow-lg cursor-pointer ${savedLater ? 'bg-zinc-800 text-white border-white' : 'border-zinc-700 text-white hover:border-white'}`}
              >
                {savedLater ? '✓ Saved' : 'Save for later'}
              </button>
            </div>

          </div>

        </div>
      </div>
{/* Footer Section */}
<footer className="flex flex-col md:flex-row items-center justify-between px-8 py-6 bg-zinc-900 border-t border-zinc-900 text-xs text-zinc-500 mt-12">
  <div className="flex items-center gap-2 font-bold text-white">
    <img src="/logo.png" alt="Logo" width={20} height={20} />
    <span>FITLOG</span>
  </div>
  <p>© 2026 FitLog - Workout Library. Train hard, log honest.</p>
</footer>
    </main>
  );
}