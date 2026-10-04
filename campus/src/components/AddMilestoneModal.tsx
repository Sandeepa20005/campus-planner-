import React, { useState } from 'react';
import { X, Lightbulb, AlertTriangle, BookOpen, Code2 } from 'lucide-react';
import { PriorityMilestone, PriorityLevel } from '../types';

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMilestone: (milestone: PriorityMilestone) => void;
}

export const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({
  isOpen,
  onClose,
  onAddMilestone,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [daysLeft, setDaysLeft] = useState(3);
  const [priority, setPriority] = useState<PriorityLevel>('critical');
  const [colorTheme, setColorTheme] = useState<'emerald' | 'purple' | 'cyan' | 'amber'>('emerald');
  const [iconType, setIconType] = useState<'bulb' | 'alert' | 'book' | 'code'>('bulb');
  const [subtasksText, setSubtasksText] = useState('Draft architecture design\nRun unit benchmarks');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const subtasks = subtasksText
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((text, idx) => ({
        id: `st-${Date.now()}-${idx}`,
        text: text.trim(),
        completed: false,
      }));

    const newMilestone: PriorityMilestone = {
      id: `pm-${Date.now()}`,
      title: title.trim(),
      subject,
      dueDate: new Date(Date.now() + daysLeft * 86400000).toISOString().split('T')[0],
      daysLeft,
      progress: 0,
      priority,
      iconType,
      colorTheme,
      subtasks: subtasks.length > 0 ? subtasks : [{ id: `st-${Date.now()}-1`, text: 'Initial deliverable', completed: false }],
    };

    onAddMilestone(newMilestone);
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0e101a] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Create Academic Milestone</h3>
            <p className="text-xs text-slate-400">High-priority goal &amp; deliverables</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Milestone Name</label>
            <input
              type="text"
              required
              placeholder="e.g. CS Project Gamma"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Subject</label>
              <input
                type="text"
                placeholder="e.g. Algorithms"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Days Left</label>
              <input
                type="number"
                min="1"
                max="90"
                value={daysLeft}
                onChange={(e) => setDaysLeft(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Neon Glow Color</label>
              <div className="flex items-center gap-2 pt-1">
                {(['emerald', 'purple', 'cyan', 'amber'] as const).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setColorTheme(color)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      colorTheme === color ? 'scale-110 border-white' : 'border-transparent opacity-60'
                    } ${
                      color === 'emerald'
                        ? 'bg-emerald-400'
                        : color === 'purple'
                        ? 'bg-purple-400'
                        : color === 'cyan'
                        ? 'bg-cyan-400'
                        : 'bg-amber-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Icon Style</label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIconType('bulb')}
                  className={`p-1.5 rounded-lg border ${
                    iconType === 'bulb' ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/10'
                  }`}
                >
                  <Lightbulb className="w-4 h-4 text-emerald-300" />
                </button>
                <button
                  type="button"
                  onClick={() => setIconType('alert')}
                  className={`p-1.5 rounded-lg border ${
                    iconType === 'alert' ? 'border-purple-400 bg-purple-500/20' : 'border-white/10'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-purple-300" />
                </button>
                <button
                  type="button"
                  onClick={() => setIconType('book')}
                  className={`p-1.5 rounded-lg border ${
                    iconType === 'book' ? 'border-cyan-400 bg-cyan-500/20' : 'border-white/10'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-cyan-300" />
                </button>
                <button
                  type="button"
                  onClick={() => setIconType('code')}
                  className={`p-1.5 rounded-lg border ${
                    iconType === 'code' ? 'border-amber-400 bg-amber-500/20' : 'border-white/10'
                  }`}
                >
                  <Code2 className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Subtasks (One per line)
            </label>
            <textarea
              rows={3}
              value={subtasksText}
              onChange={(e) => setSubtasksText(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 resize-none font-mono text-[11px]"
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-purple-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:opacity-95 transition-opacity"
            >
              Create Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
