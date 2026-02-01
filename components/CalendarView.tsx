
import React, { useState } from 'react';
import { CalendarData, Todo } from '../types.ts';
import { Star, Plus, Trash2, Check, Clock } from 'lucide-react';

interface CalendarViewProps {
  calendarData: CalendarData;
  setCalendarData: React.Dispatch<React.SetStateAction<CalendarData>>;
  viewDate: Date;
  themeColor: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ calendarData, setCalendarData, viewDate, themeColor }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [todoInput, setTodoInput] = useState('');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDay }, (_, i) => i);

  const formatDateKey = (day: number) => {
    const d = String(day).padStart(2, '0');
    const m = String(month + 1).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const currentEntry = selectedDate ? calendarData[selectedDate] : null;

  const toggleImportance = (date: string) => {
    setCalendarData(prev => {
      const entry = prev[date] || { todos: [], isImportant: false };
      return {
        ...prev,
        [date]: { ...entry, isImportant: !entry.isImportant }
      };
    });
  };

  const addTodo = () => {
    if (!selectedDate || !todoInput.trim()) return;
    setCalendarData(prev => {
      const entry = prev[selectedDate] || { todos: [], isImportant: false };
      const newTodo: Todo = { id: Date.now().toString(), text: todoInput, completed: false };
      return {
        ...prev,
        [selectedDate]: { ...entry, todos: [...entry.todos, newTodo] }
      };
    });
    setTodoInput('');
  };

  const toggleTodo = (date: string, todoId: string) => {
    setCalendarData(prev => {
      const entry = prev[date];
      if (!entry) return prev;
      return {
        ...prev,
        [date]: {
          ...entry,
          todos: entry.todos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t)
        }
      };
    });
  };

  const deleteTodo = (date: string, todoId: string) => {
    setCalendarData(prev => {
      const entry = prev[date];
      if (!entry) return prev;
      return {
        ...prev,
        [date]: {
          ...entry,
          todos: entry.todos.filter(t => t.id !== todoId)
        }
      };
    });
  };

  return (
    <div className="p-6 space-y-8 pb-10 animate-in fade-in duration-500">
      {/* Calendar Grid */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="grid grid-cols-7 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {padding.map(p => <div key={`p-${p}`} />)}
          {days.map(d => {
            const dateKey = formatDateKey(d);
            const entry = calendarData[dateKey];
            const isSelected = selectedDate === dateKey;
            const hasTodos = entry?.todos && entry.todos.length > 0;
            const isImportant = entry?.isImportant;

            return (
              <button
                key={d}
                onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-bold relative transition-all
                  ${isSelected ? 'text-white shadow-lg scale-110 z-10' : 'text-slate-600 hover:bg-slate-50'}
                  ${isImportant && !isSelected ? 'ring-1 ring-amber-200' : ''}
                `}
                style={{ backgroundColor: isSelected ? themeColor : undefined }}
              >
                {d}
                <div className="flex gap-0.5 mt-0.5 h-1">
                  {hasTodos && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-300'}`} />}
                  {isImportant && <Star size={6} className={isSelected ? 'text-white fill-current' : 'text-amber-500 fill-current'} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day View */}
      {selectedDate ? (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Date Selection</h3>
              <p className="text-lg font-bold text-slate-800">{new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <button 
              onClick={() => toggleImportance(selectedDate)}
              className={`p-3 rounded-2xl transition-all ${currentEntry?.isImportant ? 'text-white shadow-lg' : 'bg-slate-50 text-slate-300'}`}
              style={{ backgroundColor: currentEntry?.isImportant ? '#f59e0b' : undefined }}
            >
              <Star size={20} fill={currentEntry?.isImportant ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Check size={12} /> Today's Focus
            </h4>
            
            <div className="space-y-2">
              {currentEntry?.todos.map(todo => (
                <div key={todo.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group">
                  <button 
                    onClick={() => toggleTodo(selectedDate, todo.id)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${todo.completed ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-200'}`}>
                      {todo.completed && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className={`text-sm font-semibold transition-all ${todo.completed ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                      {todo.text}
                    </span>
                  </button>
                  <button 
                    onClick={() => deleteTodo(selectedDate, todo.id)}
                    className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="relative">
              <input 
                type="text" 
                value={todoInput}
                onChange={e => setTodoInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTodo()}
                placeholder="Add a to-do..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-opacity-20 transition-all"
                style={{ '--tw-ring-color': themeColor } as any}
              />
              <button 
                onClick={addTodo}
                className="absolute right-2 top-1.5 p-1.5 rounded-xl text-white transition-all active:scale-90"
                style={{ backgroundColor: themeColor }}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-100 rounded-[32px] border border-dashed border-slate-200 space-y-2 opacity-60">
          <Clock size={32} className="mx-auto text-slate-300" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Select a date to view<br/>plans & highlights</p>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
