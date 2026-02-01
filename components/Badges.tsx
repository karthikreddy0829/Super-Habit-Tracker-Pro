import React, { useMemo } from 'react';
import { Habit } from '../types.ts';
import { Award, Star, Zap, Trophy, ShieldCheck, Lock, Target, Medal } from 'lucide-react';

interface BadgesProps {
  habits: Habit[];
  themeColor: string;
}

interface BadgeDef {
  id: string;
  name: string;
  desc: string;
  requirement: number;
  icon: React.ElementType;
}

const GLOBAL_BADGES: BadgeDef[] = [
  { id: 'streak-5', name: 'Iron Focus', desc: 'Maintain any 5-day streak', requirement: 5, icon: Zap },
  { id: 'streak-10', name: 'Silver Routine', desc: 'Maintain any 10-day streak', requirement: 10, icon: Star },
  { id: 'streak-20', name: 'Golden Warrior', desc: 'Maintain any 20-day streak', requirement: 20, icon: ShieldCheck },
  { id: 'streak-30', name: 'Platinum Master', desc: 'Complete 30 days straight', requirement: 30, icon: Trophy },
  { id: 'architect', name: 'Habit Architect', desc: 'Create 5 unique habits', requirement: 5, icon: Target },
];

const Badges: React.FC<BadgesProps> = ({ habits, themeColor }) => {
  const stats = useMemo(() => {
    let globalMaxStreak = 0;
    const habitStreaks: Record<string, number> = {};

    habits.forEach(habit => {
      let currentStreak = 0;
      let maxStreakForHabit = 0;

      // Scan across the 10-year timeline for long-term streaks
      for (let y = 2025; y <= 2035; y++) {
        for (let m = 0; m < 12; m++) {
          const daysInMonth = new Date(y, m + 1, 0).getDate();
          const completions = habit.completions[`${m}-${y}`] || [];

          for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(y, m, d);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            
            if (completions.includes(d)) {
              currentStreak++;
              maxStreakForHabit = Math.max(maxStreakForHabit, currentStreak);
            } else if (isWeekend && habit.weekendsOff) {
              // Streak is maintained on rest days
              continue;
            } else {
              currentStreak = 0;
            }
          }
        }
      }
      habitStreaks[habit.id] = maxStreakForHabit;
      globalMaxStreak = Math.max(globalMaxStreak, maxStreakForHabit);
    });

    return { globalMaxStreak, habitStreaks };
  }, [habits]);

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <div className="text-center space-y-2 pt-4">
        <h2 className="text-2xl font-black text-slate-900">Achievements</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mastering Consistency</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Global Milestones</h3>
        <div className="grid grid-cols-1 gap-4">
          {GLOBAL_BADGES.map((badge) => {
            let progress = 0;
            let currentVal = 0;
            if (badge.id === 'architect') {
              currentVal = habits.length;
              progress = Math.min(100, (currentVal / badge.requirement) * 100);
            } else {
              currentVal = stats.globalMaxStreak;
              progress = Math.min(100, (currentVal / badge.requirement) * 100);
            }
            
            const isUnlocked = progress >= 100;

            return (
              <BadgeCard 
                key={badge.id}
                badge={badge}
                isUnlocked={isUnlocked}
                progress={progress}
                currentVal={currentVal}
                themeColor={themeColor}
              />
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Habit Specialists</h3>
        <div className="grid grid-cols-1 gap-4">
          {habits.map(habit => {
            const streak = stats.habitStreaks[habit.id] || 0;
            const requirement = 7;
            const progress = Math.min(100, (streak / requirement) * 100);
            const isUnlocked = progress >= 100;

            const badgeDef = {
              id: `habit-${habit.id}`,
              name: `${habit.name} Specialist`,
              desc: `Reach a 7-day streak in ${habit.name}`,
              requirement,
              icon: Medal
            };

            return (
              <BadgeCard 
                key={badgeDef.id}
                badge={badgeDef}
                isUnlocked={isUnlocked}
                progress={progress}
                currentVal={streak}
                themeColor={habit.color || themeColor}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

const BadgeCard: React.FC<{ 
  badge: BadgeDef, 
  isUnlocked: boolean, 
  progress: number, 
  currentVal: number, 
  themeColor: string
}> = ({ badge, isUnlocked, progress, themeColor }) => (
  <div 
    className={`bg-white p-5 rounded-[32px] border transition-all duration-500 relative overflow-hidden flex items-center gap-4 ${isUnlocked ? 'border-transparent shadow-xl' : 'border-slate-100 opacity-70'}`}
    style={{ boxShadow: isUnlocked ? `0 12px 32px ${themeColor}20` : undefined }}
  >
    <div 
      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 ${isUnlocked ? 'text-white shadow-lg' : 'bg-slate-50 text-slate-200'}`}
      style={{ backgroundColor: isUnlocked ? themeColor : undefined, boxShadow: isUnlocked ? `0 8px 16px ${themeColor}40` : 'none' }}
    >
      {isUnlocked ? <badge.icon size={28} /> : <Lock size={20} />}
    </div>
    <div className="flex-1">
      <h3 className={`font-black text-sm tracking-tight ${isUnlocked ? 'text-slate-900' : 'text-slate-400'}`}>
        {badge.name}
      </h3>
      <p className="text-[10px] font-bold text-slate-400 leading-tight mt-0.5">{badge.desc}</p>
      {!isUnlocked && (
        <div className="mt-3">
          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: themeColor }} />
          </div>
        </div>
      )}
    </div>
  </div>
);

export default Badges;