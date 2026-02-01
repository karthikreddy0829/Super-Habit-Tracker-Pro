
import React, { useState } from 'react';
import { Habit } from '../types.ts';
import { PlusCircle, Trash2, Edit3, Check, X, Calendar, Info } from 'lucide-react';

const HabitList: React.FC<{ 
  habits: Habit[], 
  monthYearKey: string, 
  year: number, 
  month: number, 
  onToggleDay: (h: string, d: number) => void, 
  onUpdate: (i: string, u: any) => void, 
  onAdd: (n: string) => void, 
  onDelete: (i: string) => void, 
  themeColor: string 
}> = ({ habits, monthYearKey, year, month, onToggleDay, onAdd, onDelete, onUpdate, themeColor }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [name, setName] = useState('');
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getDayLabel = (d: number) => {
    const date = new Date(year, month, d);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isWeekend = (d: number) => {
    const day = new Date(year, month, d).getDay();
    return day === 0 || day === 6;
  };

  const startEdit = (h: Habit) => {
    setEditingId(h.id);
    setEditName(h.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onUpdate(editingId, { name: editName });
      setEditingId(null);
    }
  };

  return (
    <div className="py-4 space-y-6 pb-10">
      {habits.map(h => (
        <div key={h.id} className="px-4">
          <div className="flex items-center justify-between mb-3 px-2">
            {editingId === h.id ? (
              <div className="flex items-center gap-2 flex-1 mr-4 bg-white p-1.5 rounded-xl border-2 border-slate-900 shadow-md">
                <input 
                  type="text" 
                  value={editName} 
                  onChange={e => setEditName(e.target.value)}
                  className="bg-white outline-none text-sm font-black w-full px-2"
                  style={{ color: 'black' }}
                  autoFocus
                />
                <button onClick={saveEdit} className="text-green-600 p-1.5 hover:bg-green-50 rounded-lg"><Check size={20}/></button>
                <button onClick={() => setEditingId(null)} className="text-slate-400 p-1.5 hover:bg-slate-50 rounded-lg"><X size={20}/></button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-700">{h.name}</h3>
                <button onClick={() => startEdit(h)} className="text-slate-300 hover:text-slate-500 transition-colors"><Edit3 size={12}/></button>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onUpdate(h.id, { weekendsOff: !h.weekendsOff })}
                className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all border ${h.weekendsOff ? 'bg-indigo-50 border-indigo-100 text-indigo-500' : 'bg-white border-slate-100 text-slate-300'}`}
                title="Rest weekends"
              >
                <Calendar size={10}/> {h.weekendsOff ? 'Rest ON' : 'Rest OFF'}
              </button>
              <button onClick={() => onDelete(h.id)} className="text-slate-200 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 px-1 scroll-container">
            {days.map(d => {
              const active = (h.completions[monthYearKey] || []).includes(d);
              const weekend = isWeekend(d);
              const disabled = weekend && h.weekendsOff;
              const dayLabel = getDayLabel(d);

              return (
                <button 
                  key={d} 
                  disabled={disabled}
                  onClick={() => onToggleDay(h.id, d)} 
                  className={`flex-shrink-0 w-12 h-14 rounded-2xl flex flex-col items-center justify-center transition-all border 
                    ${active ? 'text-white shadow-lg border-transparent' : 'bg-white border-slate-100'} 
                    ${disabled ? 'opacity-30 grayscale cursor-not-allowed bg-slate-50' : 'hover:border-slate-300'}
                  `} 
                  style={{ backgroundColor: active ? themeColor : undefined }}
                >
                  <span className={`text-[8px] font-black uppercase tracking-tighter mb-1 ${active ? 'text-white/70' : 'text-slate-400'}`}>
                    {dayLabel}
                  </span>
                  <span className={`text-[11px] font-black ${active ? 'text-white' : 'text-slate-700'}`}>
                    {d}
                  </span>
                  {disabled && <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20"><X size={20}/></div>}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="px-4">
        {isAdding ? (
          <div className="bg-white p-5 rounded-[32px] border-2 border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Info size={14}/>
              <span className="text-[10px] font-bold uppercase tracking-widest">New Habit Definition</span>
            </div>
            <input 
              type="text" 
              autoFocus 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="E.g. Daily Reading" 
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-5 py-4 text-sm font-black outline-none focus:ring-2 focus:ring-slate-200 transition-all shadow-inner" 
              style={{ color: 'black' }}
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={() => { if(name){ onAdd(name); setName(''); setIsAdding(false); } }} 
                className="flex-[2] py-4 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest shadow-lg" 
                style={{ backgroundColor: themeColor }}
              >
                Start Tracking
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)} className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[32px] flex items-center justify-center gap-3 text-slate-300 hover:text-slate-400 hover:border-slate-300 transition-all font-black uppercase text-xs tracking-[0.2em]">
            <PlusCircle size={20} /> New Habit
          </button>
        )}
      </div>
    </div>
  );
};

export default HabitList;
