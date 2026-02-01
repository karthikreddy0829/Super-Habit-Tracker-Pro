
import React from 'react';
import { User, Palette, Share2, Trash2, ChevronRight, Users, Plus } from 'lucide-react';
import { Habit, UserProfile } from '../types.ts';

interface SettingsProps {
  profile: UserProfile;
  setProfile: (p: Partial<UserProfile>) => void;
  themeColor: string;
  habits: Habit[];
  profiles: UserProfile[];
  onSwitch: (id: string) => void;
}

const THEME_COLORS = [
  { name: 'Classic Purple', hex: '#9333ea' },
  { name: 'Soft Rose', hex: '#fb7185' },
  { name: 'Sage Green', hex: '#2dd4bf' },
  { name: 'Ocean Blue', hex: '#3b82f6' },
  { name: 'Sunset Orange', hex: '#f97316' },
  { name: 'Deep Midnight', hex: '#1e293b' },
];

const Settings: React.FC<SettingsProps> = ({ 
  profile, setProfile, themeColor, habits, profiles, onSwitch
}) => {

  const handleShare = async () => {
    let report = `🏆 REPORT: ${profile.name}\n\n`;
    habits.forEach(h => {
      const count = Object.values(h.completions).flat().length;
      report += `• ${h.name}: ${count} completions\n`;
    });
    if (navigator.share) {
      try { await navigator.share({ title: 'My Progress', text: report }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(report);
      alert('Copied!');
    }
  };

  return (
    <div className="p-6 space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* Active Profile */}
      <section className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-white text-2xl font-black" style={{ backgroundColor: themeColor }}>
            {profile.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">{profile.name}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{profile.age} Years • {profile.gender}</p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({ name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold text-slate-800 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
              <select value={profile.gender} onChange={(e) => setProfile({ gender: e.target.value as any })} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold text-slate-800 outline-none">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Account Switching */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
          <Users size={14} /> Manage Accounts
        </h3>
        <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm space-y-2">
          {profiles.map(p => (
            <button key={p.id} onClick={() => onSwitch(p.id)} className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${p.id === profile.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${p.id === profile.id ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-500'}`}>
                  {p.name.charAt(0)}
                </div>
                <span className="text-sm font-bold">{p.name} {p.id === profile.id && '(Active)'}</span>
              </div>
              {p.id !== profile.id && <ChevronRight size={16}/>}
            </button>
          ))}
          <button onClick={() => onSwitch('NEW')} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-black text-[10px] uppercase">
            <Plus size={14}/> Add New Account
          </button>
        </div>
      </section>

      {/* Theme Section */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
          <Palette size={14} /> Theme Color
        </h3>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="grid grid-cols-3 gap-3">
            {THEME_COLORS.map(c => (
              <button key={c.hex} onClick={() => setProfile({ themeColor: c.hex })} className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 ${themeColor === c.hex ? 'border-slate-900 scale-105' : 'border-transparent bg-slate-50'}`}>
                <div className="w-8 h-8 rounded-full shadow-inner" style={{ backgroundColor: c.hex }} />
                <span className="text-[9px] font-black uppercase text-slate-500">{c.name.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="space-y-3">
        <button onClick={handleShare} className="w-full bg-white border border-slate-100 p-5 rounded-[28px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl"><Share2 size={20}/></div>
            <div className="text-left"><div className="text-sm font-black text-slate-900">Share Report</div></div>
          </div>
          <ChevronRight size={20} className="text-slate-300" />
        </button>
        <button onClick={() => { if(confirm('Erase ALL profiles?')) { localStorage.clear(); window.location.reload(); } }} className="w-full bg-white border border-slate-100 p-5 rounded-[28px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><Trash2 size={20}/></div>
            <div className="text-left"><div className="text-sm font-black text-red-600">Master Reset</div></div>
          </div>
          <ChevronRight size={20} className="text-red-200" />
        </button>
      </section>
    </div>
  );
};

export default Settings;
