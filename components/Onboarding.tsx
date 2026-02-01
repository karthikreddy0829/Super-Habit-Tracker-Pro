
import React, { useState } from 'react';
import { UserProfile } from '../types.ts';
import { User, ArrowRight, HelpCircle } from 'lucide-react';
import Logo from './Logo.tsx';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  themeColor: string;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, themeColor }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      onComplete({ 
        id: Date.now().toString(), 
        name, 
        age, 
        gender, 
        onboarded: true, 
        themeColor: gender === 'female' ? '#fb7185' : '#9333ea' 
      });
    }
  };

  return (
    <div className="h-full w-full bg-white flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <div className="p-8 flex-1 flex flex-col justify-center space-y-12">
        <div className="space-y-4 text-center items-center flex flex-col">
          <Logo size={80} variant="full" className="mb-2" />
          <p className="text-slate-400 font-bold text-sm">Create an account for this device.</p>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input autoFocus type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter name" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-lg font-bold text-slate-800 outline-none" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest text-center block">Age</label>
              <div className="flex flex-col items-center gap-6">
                <div className="text-6xl font-black text-slate-900" style={{ color: themeColor }}>{age}</div>
                <input type="range" min="10" max="100" value={age} onChange={e => setAge(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" style={{ accentColor: themeColor }} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest text-center block">Gender</label>
              <div className="grid grid-cols-3 gap-3">
                <GenderCard active={gender === 'male'} onClick={() => setGender('male')} icon={<User size={24}/>} label="Male" color="#3b82f6" />
                <GenderCard active={gender === 'female'} onClick={() => setGender('female')} icon={<User size={24}/>} label="Female" color="#f43f5e" />
                <GenderCard active={gender === 'other'} onClick={() => setGender('other')} icon={<HelpCircle size={24}/>} label="Other" color="#64748b" />
              </div>
            </div>
          )}
        </div>

        <button onClick={handleNext} disabled={step === 1 && !name.trim()} className="w-full py-5 rounded-[24px] text-white font-black uppercase text-sm tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-30" style={{ backgroundColor: themeColor }}>
          {step === 3 ? 'Confirm' : 'Continue'} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

const GenderCard: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }> = ({ active, onClick, icon, label, color }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-3 p-5 rounded-[24px] transition-all border-2 ${active ? 'shadow-xl scale-105' : 'border-slate-50 bg-slate-50 text-slate-400'}`} style={{ borderColor: active ? color : 'transparent', color: active ? color : undefined }}>
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default Onboarding;
