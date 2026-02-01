
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Menu, X, CheckCircle2, BarChart3, 
  Settings as SettingsIcon, Sparkles, 
  ChevronLeft, ChevronRight, User, Award, 
  MessageSquareText, Calendar as CalendarIcon,
  Info, Activity, Users, Plus, ShieldAlert
} from 'lucide-react';
import { Habit, CalendarData, UserProfile, CycleData, UserData } from './types.ts';
import HabitList from './components/HabitList.tsx';
import Dashboard from './components/Dashboard.tsx';
import Settings from './components/Settings.tsx';
import About from './components/About.tsx';
import Badges from './components/Badges.tsx';
import AskGemini from './components/AskGemini.tsx';
import CalendarView from './components/CalendarView.tsx';
import Onboarding from './components/Onboarding.tsx';
import CycleTracker from './components/CycleTracker.tsx';
import Emergency from './components/Emergency.tsx';
import Logo from './components/Logo.tsx';
import InstallButton from './components/InstallButton.tsx';

const ALL_DATA_KEY = 'super_tracker_v10_all_data';
const PROFILES_KEY = 'super_tracker_v10_profiles';
const ACTIVE_PROFILE_ID_KEY = 'super_tracker_v10_active_id';

const START_YEAR = 2025;
const END_YEAR = 2035;

const DEFAULT_HABITS: Habit[] = [
  { id: '1', name: 'Morning Meditation', completions: {}, color: '#A855F7', weekendsOff: false },
  { id: '2', name: 'Read 20 Pages', completions: {}, color: '#8B5CF6', weekendsOff: false },
];

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  
  // Per-profile data
  const [habits, setHabits] = useState<Habit[]>([]);
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [cycleData, setCycleData] = useState<CycleData>({ logs: [], avgLength: 28 });
  
  const [activeTab, setActiveTab] = useState<'track' | 'calendar' | 'stats' | 'badges' | 'ai' | 'settings' | 'about' | 'cycle' | 'emergency'>('track');
  const [viewDate, setViewDate] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;
  const themeColor = activeProfile?.themeColor || '#9333ea';

  const monthYearKey = `${viewDate.getMonth()}-${viewDate.getFullYear()}`;
  const currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(viewDate);

  // Load Initial Profiles
  useEffect(() => {
    const savedProfiles = localStorage.getItem(PROFILES_KEY);
    const savedActiveId = localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
    
    if (savedProfiles) {
      const parsedProfiles = JSON.parse(savedProfiles);
      setProfiles(parsedProfiles);
      if (savedActiveId && parsedProfiles.some((p: UserProfile) => p.id === savedActiveId)) {
        setActiveProfileId(savedActiveId);
      } else if (parsedProfiles.length > 0) {
        setActiveProfileId(parsedProfiles[0].id);
      }
    }
    setIsLoaded(true);
  }, []);

  // Load/Save Active Profile Data
  useEffect(() => {
    if (!activeProfileId || !isLoaded) return;

    const allData = JSON.parse(localStorage.getItem(ALL_DATA_KEY) || '{}');
    const userData: UserData = allData[activeProfileId] || {
      habits: DEFAULT_HABITS,
      calendarData: {},
      cycleData: { logs: [], avgLength: 28 }
    };

    setHabits(userData.habits);
    setCalendarData(userData.calendarData);
    setCycleData(userData.cycleData);
    
    localStorage.setItem(ACTIVE_PROFILE_ID_KEY, activeProfileId);
  }, [activeProfileId, isLoaded]);

  // Sync Data to LocalStorage
  useEffect(() => {
    if (!activeProfileId || !isLoaded) return;

    const allData = JSON.parse(localStorage.getItem(ALL_DATA_KEY) || '{}');
    allData[activeProfileId] = { habits, calendarData, cycleData };
    localStorage.setItem(ALL_DATA_KEY, JSON.stringify(allData));
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }, [habits, calendarData, cycleData, profiles, activeProfileId, isLoaded]);

  const toggleDay = useCallback((habitId: string, day: number) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const current = habit.completions[monthYearKey] || [];
        const exists = current.includes(day);
        const next = exists ? current.filter(d => d !== day) : [...current, day].sort((a, b) => a - b);
        return { ...habit, completions: { ...habit.completions, [monthYearKey]: next } };
      }
      return habit;
    }));
  }, [monthYearKey]);

  const changeMonth = (delta: number) => {
    setViewDate(prev => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + delta);
      if (next.getFullYear() < START_YEAR || next.getFullYear() > END_YEAR) return prev;
      return next;
    });
  };

  const switchAccount = (id: string) => {
    setActiveProfileId(id);
    setIsMenuOpen(false);
    setActiveTab('track');
  };

  const handleOnboarding = (p: UserProfile) => {
    const newProfiles = [...profiles, p];
    setProfiles(newProfiles);
    setActiveProfileId(p.id);
  };

  if (!isLoaded) return <div className="h-full w-full bg-slate-50 flex items-center justify-center font-bold text-slate-400">LOADING...</div>;

  if (!activeProfile) {
    return <Onboarding onComplete={handleOnboarding} themeColor="#9333ea" />;
  }

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-slate-200">
      
      {isMenuOpen && <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-40 animate-in fade-in" onClick={() => setIsMenuOpen(false)} />}

      <aside className={`absolute top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Logo size={40} />
              <span className="font-black text-slate-900 tracking-tight text-sm uppercase">Super Tracker</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-slate-500"><X size={24} /></button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            <SidebarItem active={activeTab === 'track'} icon={<CheckCircle2 size={20} />} label="Habits" onClick={() => { setActiveTab('track'); setIsMenuOpen(false); }} color={themeColor} />
            <SidebarItem active={activeTab === 'calendar'} icon={<CalendarIcon size={20} />} label="Planner" onClick={() => { setActiveTab('calendar'); setIsMenuOpen(false); }} color={themeColor} />
            {activeProfile.gender === 'female' && <SidebarItem active={activeTab === 'cycle'} icon={<Activity size={20} />} label="Cycle" onClick={() => { setActiveTab('cycle'); setIsMenuOpen(false); }} color="#f43f5e" />}
            <SidebarItem active={activeTab === 'emergency'} icon={<ShieldAlert size={20} />} label="Emergency" onClick={() => { setActiveTab('emergency'); setIsMenuOpen(false); }} color="#ef4444" />
            <SidebarItem active={activeTab === 'stats'} icon={<BarChart3 size={20} />} label="Insights" onClick={() => { setActiveTab('stats'); setIsMenuOpen(false); }} color={themeColor} />
            <SidebarItem active={activeTab === 'badges'} icon={<Award size={20} />} label="Badges" onClick={() => { setActiveTab('badges'); setIsMenuOpen(false); }} color={themeColor} />
            <SidebarItem active={activeTab === 'ai'} icon={<MessageSquareText size={20} />} label="AI Mentor" onClick={() => { setActiveTab('ai'); setIsMenuOpen(false); }} color={themeColor} />
            <SidebarItem active={activeTab === 'settings'} icon={<SettingsIcon size={20} />} label="Settings" onClick={() => { setActiveTab('settings'); setIsMenuOpen(false); }} color={themeColor} />
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
             <div className="flex items-center gap-3 px-2 py-4 mb-2 bg-slate-50 rounded-2xl">
               <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500"><Users size={16}/></div>
               <span className="text-[10px] font-black uppercase text-slate-400">Switch Profile</span>
             </div>
             <div className="space-y-1 max-h-32 overflow-y-auto no-scrollbar">
               {profiles.map(p => (
                 <button key={p.id} onClick={() => switchAccount(p.id)} className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${p.id === activeProfileId ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                   {p.name}
                 </button>
               ))}
               <button onClick={() => { setActiveProfileId(null); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 rounded-xl text-xs font-bold text-slate-400 flex items-center gap-2 hover:bg-slate-50">
                 <Plus size={14}/> New Profile
               </button>
             </div>
          </div>
        </div>
      </aside>

      <header className="p-6 bg-white border-b border-slate-100 flex-shrink-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2 text-slate-400"><Menu size={24} /></button>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
                {activeTab}
              </h1>
              <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{activeProfile.name}</div>
            </div>
          </div>
         <div className="flex items-center gap-2">
  <InstallButton />

  <button
    onClick={() => setActiveTab('settings')}
    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
    style={{ backgroundColor: themeColor + '15', color: themeColor }}
  >
    <User size={20} />
  </button>
</div>

        
        {(activeTab === 'track' || activeTab === 'stats' || activeTab === 'calendar' || activeTab === 'cycle') && (
          <div className="flex items-center justify-between mt-4 bg-slate-50 p-1.5 rounded-2xl">
            <button onClick={() => changeMonth(-1)} className="p-2 text-slate-400"><ChevronLeft size={18} /></button>
            <div className="text-center">
              <div className="text-[9px] font-black uppercase opacity-40">{viewDate.getFullYear()}</div>
              <div className="text-xs font-black text-slate-800 uppercase">{currentMonthName}</div>
            </div>
            <button onClick={() => changeMonth(1)} className="p-2 text-slate-400"><ChevronRight size={18} /></button>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar scroll-container bg-slate-50 pb-6">
        {activeTab === 'track' && <HabitList habits={habits} monthYearKey={monthYearKey} year={viewDate.getFullYear()} month={viewDate.getMonth()} onToggleDay={toggleDay} onUpdate={(id, u) => setHabits(prev => prev.map(h => h.id === id ? {...h, ...u} : h))} onAdd={(n) => setHabits(prev => [...prev, { id: Date.now().toString(), name: n, completions: {}, color: themeColor, weekendsOff: false }])} onDelete={(id) => setHabits(prev => prev.filter(h => h.id !== id))} themeColor={themeColor} />}
        {activeTab === 'calendar' && <CalendarView calendarData={calendarData} setCalendarData={setCalendarData} viewDate={viewDate} themeColor={themeColor} />}
        {activeTab === 'cycle' && activeProfile.gender === 'female' && <CycleTracker cycleData={cycleData} setCycleData={setCycleData} viewDate={viewDate} themeColor="#f43f5e" />}
        {activeTab === 'emergency' && <Emergency profile={activeProfile} themeColor="#ef4444" />}
        {activeTab === 'stats' && <Dashboard habits={habits} monthYearKey={monthYearKey} year={viewDate.getFullYear()} month={viewDate.getMonth()} themeColor={themeColor} cycleData={cycleData} profile={activeProfile} />}
        {activeTab === 'badges' && <Badges habits={habits} themeColor={themeColor} />}
        {activeTab === 'ai' && <AskGemini habits={habits} userName={activeProfile.name} themeColor={themeColor} />}
        {activeTab === 'settings' && <Settings profile={activeProfile} setProfile={(upd) => setProfiles(prev => prev.map(p => p.id === activeProfileId ? {...p, ...upd} : p))} themeColor={themeColor} habits={habits} profiles={profiles} onSwitch={setActiveProfileId} />}
        {activeTab === 'about' && <About themeColor={themeColor} />}
      </main>
    </div>
  );
};

const SidebarItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }> = ({ active, onClick, icon, label, color }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all ${active ? 'text-white' : 'text-slate-500 hover:bg-slate-50'}`}
    style={{ backgroundColor: active ? color : undefined }}
  >
    <span style={{ color: !active ? color : undefined }}>{icon}</span>
    <span className="text-sm font-black tracking-tight">{label}</span>
  </button>
);

export default App;
