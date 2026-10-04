import React, { useState } from 'react';
import { X, Clock, BookOpen, CheckCircle, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogHours: (hours: number, subject: string, notes: string) => void;
}

export const StudyLogModal: React.FC<StudyLogModalProps> = ({
  isOpen,
  onClose,
  onLogHours,
}) => {
  const [hours, setHours] = useState(2);
  const [subject, setSubject] = useState('Distributed Systems');
  const [notes, setNotes] = useState('Reviewed Raft consensus algorithm & executed benchmark tests.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogHours(hours, subject, notes);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#34d399', '#c084fc'],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#0e101a] border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative text-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Log Study Session</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Hours Spent</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 6].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHours(h)}
                  className={`flex-1 py-2 rounded-xl font-bold font-mono transition-all ${
                    hours === h
                      ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                      : 'bg-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  +{h}h
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Distributed Systems">Distributed Systems</option>
              <option value="Linear Algebra & Math">Linear Algebra &amp; Math</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Database Systems">Database Systems</option>
              <option value="Compiler Design">Compiler Design</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Session Summary</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:opacity-95 transition-opacity"
            >
              Record Productivity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
