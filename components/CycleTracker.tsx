
import React, { useState, useMemo } from 'react';
import { CycleData, CycleLog } from '../types.ts';
import { Heart, Activity, Sparkles, Plus, Clock, Trash2, Edit2, Check, X, Calendar, AlertTriangle, Info } from 'lucide-react';

interface CycleTrackerProps {
  cycleData: CycleData;
  setCycleData: React.Dispatch<React.SetStateAction<CycleData>>;
  viewDate: Date;
  themeColor: string;
}

const CycleTracker: React.FC<CycleTrackerProps> = ({ cycleData, setCycleData, viewDate, themeColor }) => {
  const [isLogging, setIsLogging] = useState(false);
  const [newLogDate, setNewLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newLogDuration, setNewLogDuration] = useState<number>(5);
  
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editDuration, setEditDuration] = useState<number>(5);
  const [editDate, setEditDate] = useState<string>('');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const padding = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // The logs are sorted by date descending (latest first)
  const lastLog = cycleData.logs[0];

  // Validation Clause Logic: 20-40 days from last log
  const validation = useMemo(() => {
    if (!lastLog) return { isValid: true, minDate: '', maxDate: '', message: '' };

    const lastDate = new Date(lastLog.startDate);
    const minDateObj = new Date(lastDate.getTime() + 20 * 24 * 3600 * 1000);
    const maxDateObj = new Date(lastDate.getTime() + 40 * 24 * 3600 * 1000);
    
    const minStr = minDateObj.toISOString().split('T')[0];
    const maxStr = maxDateObj.toISOString().split('T')[0];
    
    const selectedDateObj = new Date(newLogDate);
    const isValid = selectedDateObj >= minDateObj && selectedDateObj <= maxDateObj;

    const displayRange = `${minDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${maxDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    return {
      isValid,
      minDate: minStr,
      maxDate: maxStr,
      displayRange,
      message: isValid ? `Valid cycle window: ${displayRange}` : `Next cycle must be between 20-40 days from your last log (${displayRange}).`
    };
  }, [lastLog, newLogDate]);

  const isPeriodDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return cycleData.logs.some(log => {
      const start = new Date(log.startDate);
      const current = new Date(dateStr);
      const diff = Math.floor((current.getTime() - start.getTime()) / (1000 * 3600 * 24));
      return diff >= 0 && diff < log.duration;
    });
  };

  const handleAddLogManual = () => {
    if (!newLogDate) return;
    if (lastLog && !validation.isValid) return; // Clause enforcement

    const newEntry: CycleLog = { 
      id: `log-${Date.now()}`, 
      startDate: newLogDate, 
      duration: newLogDuration 
    };
    
    setCycleData(prev => ({
      ...prev,
      logs: [newEntry, ...prev.logs].sort((a, b) => b.startDate.localeCompare(a.startDate))
    }));
    setIsLogging(false);
  };

  const deleteLog = (logId: string) => {
    setCycleData(prev => ({
      ...prev,
      logs: prev.logs.filter(l => l.id !== logId)
    }));
    if (editingLogId === logId) setEditingLogId(null);
  };

  const clearAllHistory = () => {
    if (window.confirm("Clear ALL cycle history? This cannot be undone.")) {
      setCycleData(prev => ({ ...prev, logs: [] }));
    }
  };

  const startEdit = (log: CycleLog) => {
    setEditingLogId(log.id);
    setEditDate(log.startDate);
    setEditDuration(log.duration);
  };

  const saveEdit = (logId: string) => {
    setCycleData(prev => {
      const updatedLogs = prev.logs.map(l => 
        l.id === logId 
          ? { ...l, startDate: editDate, duration: editDuration } 
          : l
      );
      return { 
        ...prev, 
        logs: [...updatedLogs].sort((a, b) => b.startDate.localeCompare(a.startDate)) 
      };
    });
    setEditingLogId(null);
  };

  const nextPeriod = lastLog ? new Date(new Date(lastLog.startDate).getTime() + cycleData.avgLength * 24 * 3600 * 1000) : null;

  return (
    <div className="p-6 space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <Heart size={24} className="text-rose-500 mb-2" fill="currentColor" />
          <div className="text-2xl font-black text-slate-900">
            {nextPeriod ? Math.max(0, Math.ceil((nextPeriod.getTime() - Date.now()) / (1000*3600*24))) : '--'}
          </div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Days to Next</div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <Activity size={24} className="text-blue-500 mb-2" />
          <div className="text-2xl font-black text-slate-900">{cycleData.avgLength}</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Avg Cycle</div>
        </div>
      </div>

      {/* Grid Calendar */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-7 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {padding.map(p => <div key={`p-${p}`} />)}
          {days.map(d => {
            const active = isPeriodDay(d);
            return (
              <div
                key={d}
                className={`aspect-square rounded-xl flex items-center justify-center text-sm font-black transition-all ${active ? 'text-white shadow-lg scale-105' : 'text-slate-600'}`}
                style={{ backgroundColor: active ? themeColor : undefined }}
              >
                {d}
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Entry Flow */}
      <div className="bg-rose-50 border border-rose-100 p-6 rounded-[32px] shadow-sm space-y-4">
        <h3 className="text-sm font-black text-rose-600 flex items-center gap-2">
          <Sparkles size={16} /> New Entry
        </h3>
        
        {isLogging ? (
          <div className="bg-white p-5 rounded-3xl shadow-xl border-2 border-rose-200 space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cycle Start Date</label>
              <input 
                type="date" 
                value={newLogDate}
                onChange={e => setNewLogDate(e.target.value)}
                className={`w-full bg-slate-50 border-2 rounded-xl px-4 py-3 text-sm font-black outline-none transition-colors shadow-inner ${lastLog && !validation.isValid ? 'border-amber-400 focus:border-amber-500' : 'border-slate-100 focus:border-rose-400'}`}
                style={{ color: 'black' }}
              />
              {lastLog && (
                <p className={`text-[9px] font-black uppercase tracking-wider mt-1 px-1 flex items-center gap-1 ${validation.isValid ? 'text-green-500' : 'text-amber-500'}`}>
                  {validation.isValid ? <Check size={10} /> : <AlertTriangle size={10} />}
                  {validation.message}
                </p>
              )}
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Period Length (Days)</label>
              <input 
                type="number" 
                min="1" max="15"
                value={newLogDuration}
                onChange={e => setNewLogDuration(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-black outline-none focus:border-rose-400 shadow-inner"
                style={{ color: 'black' }}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setIsLogging(false)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest">Cancel</button>
              <button 
                onClick={handleAddLogManual} 
                disabled={lastLog && !validation.isValid}
                className={`flex-[2] py-3 rounded-xl text-white font-black uppercase text-[10px] tracking-widest shadow-lg transition-all ${lastLog && !validation.isValid ? 'bg-slate-300 cursor-not-allowed opacity-50' : ''}`}
                style={{ backgroundColor: (lastLog && !validation.isValid) ? undefined : themeColor }}
              >
                Save Log
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsLogging(true)}
            className="w-full py-4 rounded-2xl text-white font-black uppercase text-xs tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ backgroundColor: themeColor }}
          >
            <Plus size={18} /> Log Period Start
          </button>
        )}
      </div>

      {/* History & Correction */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">History & Correction</h3>
          {cycleData.logs.length > 1 && (
            <button onClick={clearAllHistory} className="text-[9px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1 hover:text-red-600">
              <AlertTriangle size={10} /> Clear All
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {cycleData.logs.length > 0 ? (
            cycleData.logs.map((log) => {
              const isEditing = editingLogId === log.id;

              return (
                <div key={log.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl flex-shrink-0">
                      <Clock size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="space-y-2 p-2 bg-slate-100 rounded-2xl border-2 border-slate-900 shadow-inner">
                          <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-slate-400"/>
                            <input 
                              type="date" 
                              value={editDate} 
                              onChange={e => setEditDate(e.target.value)}
                              className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-black outline-none w-full"
                              style={{ color: 'black' }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity size={12} className="text-slate-400"/>
                            <input 
                              type="number" 
                              value={editDuration} 
                              onChange={e => setEditDuration(parseInt(e.target.value) || 1)}
                              className="w-16 bg-white border border-slate-200 rounded px-2 py-1 text-xs font-black outline-none"
                              style={{ color: 'black' }}
                              min="1" max="20"
                            />
                            <span className="text-[9px] text-slate-500 font-black uppercase">Days</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-xs font-black text-slate-800 truncate">
                            {new Date(log.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Duration: {log.duration} Days
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    {isEditing ? (
                      <>
                        <button onClick={() => saveEdit(log.id)} className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all active:scale-90" title="Save"><Check size={24}/></button>
                        <button onClick={() => setEditingLogId(null)} className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all active:scale-90" title="Cancel"><X size={24}/></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(log)} className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Edit"><Edit2 size={20}/></button>
                        <button onClick={() => deleteLog(log.id)} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete"><Trash2 size={20}/></button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-slate-100 rounded-[32px] border border-dashed border-slate-200 space-y-2 opacity-60">
              <Clock size={32} className="mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose text-center">No history found<br/>Tap "Log Period Start" above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CycleTracker;
