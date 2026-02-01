
import React, { useState } from 'react';
import { PhoneOutgoing, ShieldAlert, MessageCircle, Share2, MapPin, AlertCircle, PhoneCall, Info, Heart } from 'lucide-react';
import { UserProfile } from '../types.ts';

interface EmergencyProps {
  profile: UserProfile;
  themeColor: string;
}

const EMERGENCY_CONTACTS = [
  { name: 'Police / Emergency', number: '112', icon: ShieldAlert, color: '#1e40af' },
  { name: 'Ambulance', number: '108', icon: AlertCircle, color: '#dc2626' },
  { name: 'Fire Station', number: '101', icon: PhoneCall, color: '#f97316' },
];

const SHE_TEAM_NUMBER = '9490616555'; // Telangana
const SHAKTHI_TEAM_NUMBER = '181'; // Andhra Pradesh (Women Helpline / Shakti)

const Emergency: React.FC<EmergencyProps> = ({ profile, themeColor }) => {
  const [isLocating, setIsLocating] = useState(false);

  const handleSOS = async () => {
    setIsLocating(true);
    let message = "⚠️ EMERGENCY SOS: I am in danger! Please help me immediately!";
    
    try {
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        const { latitude, longitude } = position.coords;
        message += `\n\n📍 My Live Location: https://www.google.com/maps?q=${latitude},${longitude}`;
      }
    } catch (err) {
      console.warn("Could not get location", err);
      message += "\n(Location could not be retrieved automatically)";
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SOS DANGER ALERT',
          text: message,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(message);
      alert("SOS Message copied to clipboard! Paste it to your emergency contact.");
    }
    setIsLocating(false);
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="p-6 space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Panic Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-red-500 blur-3xl opacity-10 animate-pulse rounded-full" />
        <div className="bg-white p-8 rounded-[40px] border-4 border-red-50 shadow-2xl space-y-6 text-center relative overflow-hidden">
          <div className="w-20 h-20 bg-red-600 rounded-full mx-auto flex items-center justify-center text-white shadow-xl shadow-red-200 animate-bounce">
            <ShieldAlert size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Panic SOS</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Send your location to friends</p>
          </div>
          <button 
            onClick={handleSOS}
            disabled={isLocating}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-[28px] shadow-lg shadow-red-200 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLocating ? (
              <span className="flex items-center gap-2">
                <MapPin size={20} className="animate-pulse" /> Locating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Share2 size={20} /> SEND DANGER MSG
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Contacts List */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Primary Emergency Services</h3>
        <div className="space-y-3">
          {EMERGENCY_CONTACTS.map((contact) => (
            <button 
              key={contact.name}
              onClick={() => handleCall(contact.number)}
              className="w-full bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: contact.color }}>
                  <contact.icon size={24} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-black text-slate-900">{contact.name}</div>
                  <div className="text-lg font-black text-slate-400 tracking-widest">{contact.number}</div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-slate-900 group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                <PhoneOutgoing size={18} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Specialized Protection Section */}
      {profile.gender === 'female' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert size={12} className="fill-current" /> Specialized Protection Unit
            </h3>
            <span className="text-[8px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-black uppercase">Women Helplines</span>
          </div>

          <div className="space-y-3">
            {/* SHE TEAM - Telangana */}
            <button 
              onClick={() => handleCall(SHE_TEAM_NUMBER)}
              className="w-full bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-[40px] shadow-xl shadow-rose-200 flex items-center justify-between text-white relative overflow-hidden active:scale-[0.98] transition-all"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <ShieldAlert size={32} />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">SHE TEAM (Telangana)</div>
                  <div className="text-xl font-black tracking-tighter">{SHE_TEAM_NUMBER}</div>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-white text-rose-600 flex items-center justify-center shadow-lg relative z-10">
                <PhoneCall size={20} />
              </div>
            </button>

            {/* SHAKTHI TEAM - Andhra Pradesh (Updated to match Telangana style as requested) */}
            <button 
              onClick={() => handleCall(SHAKTHI_TEAM_NUMBER)}
              className="w-full bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-[40px] shadow-xl shadow-rose-200 flex items-center justify-between text-white relative overflow-hidden active:scale-[0.98] transition-all"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <ShieldAlert size={32} />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">SHAKTHI TEAM (Andhra)</div>
                  <div className="text-xl font-black tracking-tighter">{SHAKTHI_TEAM_NUMBER}</div>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-white text-rose-600 flex items-center justify-center shadow-lg relative z-10">
                <PhoneCall size={20} />
              </div>
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-400 font-bold px-4 leading-relaxed">
            These specialized police units (She Team in Telangana and Shakti Team in Andhra) are dedicated to your immediate safety. Use Disha App or dial these helplines for 24/7 assistance.
          </p>
        </section>
      )}

      {/* Safety Info */}
      <div className="bg-slate-100 p-6 rounded-[32px] border border-dashed border-slate-200">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Info size={12} /> Safety Pro Tip
        </h4>
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
          The SOS feature automatically captures your precise location. If you are in Andhra, the Shakti teams are integrated with the DISHA system for rapid 10-minute response times.
        </p>
      </div>
    </div>
  );
};

export default Emergency;
