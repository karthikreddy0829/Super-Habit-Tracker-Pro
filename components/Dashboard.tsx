
import React, { useMemo } from 'react';
import { Habit, CycleData, UserProfile } from '../types.ts';
import { Flame, Sparkles, Activity, Heart, Quote, Star, CheckCircle2, AlertCircle } from 'lucide-react';

const AFFIRMATIONS = [
  "You are a masterpiece in progress, radiating grace and power.",
  "Your strength is quiet, your spirit is fierce, and your heart is gold.",
  "The world is brighter because of your unique and beautiful light.",
  "Radiate grace, power, and kindness. You are unstoppable.",
  "You have within you the strength, the patience, and the passion to reach for the stars.",
  "Strength and dignity are your clothing; you laugh without fear of the future.",
  "You are more powerful than you know; you are beautiful just as you are.",
  "Believing in yourself is the most beautiful thing you can wear.",
  "Your beauty starts the moment you decide to be yourself.",
  "Grace is the only beauty that never fades. Carry it with you today.",
  "You are blooming in your own way, in your own time.",
  "Own your magic. You are capable of creating wonders.",
  "Every day is a fresh start to celebrate the incredible woman you are.",
  "Your potential is endless. Go do what you were created to do.",
  "A queen is not afraid to fail. Failure is another stepping stone to greatness."
];

interface DashboardProps {
  habits: Habit[];
  monthYearKey: string;
  year: number;
  month: number;
  themeColor: string;
  cycleData?: CycleData;
  profile?: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ habits, monthYearKey, themeColor, cycleData, profile }) => {
  const stats = useMemo(() => {
    return habits.map(h => {
      const count = (h.completions[monthYearKey] || []).length;
      return { name: h.name, count, color: h.color || themeColor };
    });
  }, [habits, monthYearKey, themeColor]);

  // Daily Quote logic
  const dailyQuote = useMemo(() => {
    const today = new Date().getDate();
    return AFFIRMATIONS[today % AFFIRMATIONS.length];
  }, []);

  // Cycle Report logic
  const cycleReport = useMemo(() => {
    if (!cycleData || !cycleData.logs.length || profile?.gender !== 'female') return null;

    const logs = [...cycleData.logs].sort((a, b) => a.startDate.localeCompare(b.startDate));
    
    // Average Duration
    const avgDuration = logs.reduce((acc, l) => acc + l.duration, 0) / logs.length;

    // Average Cycle Length (Start of A to Start of B)
    let totalGap = 0;
    let gapCount = 0;
    for (let i = 1; i < logs.length; i++) {
      const startA = new Date(logs[i-1].startDate);
      const startB = new Date(logs[i].startDate);
      const gap = Math.floor((startB.getTime() - startA.getTime()) / (1000 * 3600 * 24));
      totalGap += gap;
      gapCount++;
    }

    const avgGap = gapCount > 0 ? totalGap / gapCount : 28; // Default to 28 if not enough data
    
    const isDurationNormal = avgDuration >= 3 && avgDuration <= 7;
    const isGapNormal = avgGap >= 21 && avgGap <= 35;
    const isNormal = isDurationNormal && isGapNormal;

    return {
      avgDuration: avgDuration.toFixed(1),
      avgGap: Math.round(avgGap),
      isNormal,
      reason: !isNormal 
        ? `${!isDurationNormal ? 'Period duration varies from average range (3-7 days).' : ''} ${!isGapNormal ? 'Cycle length varies from average range (21-35 days).' : ''}`.trim()
        : "Your cycle metrics are within the healthy biological average range."
    };
  }, [cycleData, profile]);

  return (
    <div className="p-6 space-y-8 pb-20">
      
      {/* Daily Affirmation Section */}
      {profile?.gender === 'female' && (
        <section className="bg-gradient-to-br from-rose-50 to-white p-8 rounded-[40px] border border-rose-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
            <Quote size={80} className="text-rose-400" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-rose-400" />
              <span className="text-[10px] font-black text-rose-300 uppercase tracking-widest">Daily Affirmation</span>
            </div>
            <p className="text-xl font-black text-slate-800 leading-tight italic">
              "{dailyQuote}"
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.2em]">— Bloom with Grace</span>
            </div>
          </div>
        </section>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="text-3xl font-black text-slate-900">{habits.length}</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Total Habits</div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="text-3xl font-black text-slate-900 text-orange-500"><Flame size={28} className="inline mr-1"/></div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Consistency</div>
        </div>
      </div>

      {/* Cycle Health Report (Female Only) */}
      {cycleReport && (
        <section className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Cycle Health Report</h3>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${cycleReport.isNormal ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
                  {cycleReport.isNormal ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">{cycleReport.isNormal ? 'Healthy Pattern' : 'Irregular Pattern'}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biological Status</div>
                </div>
              </div>
              <Activity size={20} className="text-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <div className="text-lg font-black text-slate-800">{cycleReport.avgGap}d</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase">Avg Cycle</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <div className="text-lg font-black text-slate-800">{cycleReport.avgDuration}d</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase">Avg Period</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border-l-4 border-rose-300">
              {cycleReport.reason}
            </p>
          </div>
        </section>
      )}

      {/* Habit Progress */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Progress Summary</h3>
        {stats.map(s => (
          <div key={s.name} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-xs font-black text-slate-800">{s.name}</span>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: s.color }}>{s.count} pts</span>
          </div>
        ))}
        {stats.length === 0 && (
          <div className="text-center p-10 bg-slate-100 rounded-[32px] border border-dashed border-slate-200 opacity-50">
            <Star size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">No stats to show yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
