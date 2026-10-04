import React, { useState } from 'react';
import { Lightbulb, AlertTriangle, BookOpen, Code2, Plus, ChevronRight, CheckCircle2, Circle, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PriorityMilestone } from '../types';

interface UpcomingPrioritiesProps {
  priorities: PriorityMilestone[];
  onUpdatePriority: (updated: PriorityMilestone) => void;
  onOpenAddMilestone: () => void;
}

export const UpcomingPriorities: React.FC<UpcomingPrioritiesProps> = ({
  priorities,
  onUpdatePriority,
  onOpenAddMilestone,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<PriorityMilestone | null>(null);

  const getIcon = (type: PriorityMilestone['iconType'], colorTheme: PriorityMilestone['colorTheme']) => {
    switch (type) {
      case 'bulb':
        return <Lightbulb className="w-4 h-4 text-emerald-300" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-purple-300" />;
      case 'book':
        return <BookOpen className="w-4 h-4 text-cyan-300" />;
      case 'code':
        return <Code2 className="w-4 h-4 text-amber-300" />;
      default:
        return <Lightbulb className="w-4 h-4 text-emerald-300" />;
    }
  };

  const getThemeStyles = (theme: PriorityMilestone['colorTheme']) => {
    switch (theme) {
      case 'emerald':
        return {
          cardBorder: 'border-emerald-500/40 shadow-[0_0_18px_rgba(52,211,153,0.15)]',
          iconBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.3)]',
          barGradient: 'from-emerald-400 via-teal-300 to-purple-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]',
        };
      case 'purple':
        return {
          cardBorder: 'border-purple-500/40 shadow-[0_0_18px_rgba(192,132,252,0.15)]',
          iconBg: 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(192,132,252,0.3)]',
          barGradient: 'from-purple-400 via-fuchsia-400 to-pink-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]',
        };
      case 'cyan':
        return {
          cardBorder: 'border-cyan-500/40 shadow-[0_0_18px_rgba(56,189,248,0.15)]',
          iconBg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.3)]',
          barGradient: 'from-cyan-400 via-sky-300 to-blue-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]',
        };
      case 'amber':
        return {
          cardBorder: 'border-amber-500/40 shadow-[0_0_18px_rgba(251,191,36,0.15)]',
          iconBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)]',
          barGradient: 'from-amber-400 via-orange-400 to-rose-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]',
        };
      default:
        return {
          cardBorder: 'border-white/10',
          iconBg: 'bg-white/10 border-white/20 text-white',
          barGradient: 'from-emerald-400 to-purple-400',
        };
    }
  };

  const handleToggleSubtask = (milestoneId: string, subtaskId: string) => {
    const milestone = priorities.find((p) => p.id === milestoneId);
    if (!milestone) return;

    const newSubtasks = milestone.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    const completedCount = newSubtasks.filter((st) => st.completed).length;
    const newProgress = Math.round((completedCount / newSubtasks.length) * 100);

    const updated: PriorityMilestone = {
      ...milestone,
      subtasks: newSubtasks,
      progress: newProgress,
    };

    onUpdatePriority(updated);
    if (selectedMilestone?.id === milestoneId) {
      setSelectedMilestone(updated);
    }

    if (newProgress === 100) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#34d399', '#c084fc', '#38bdf8'],
      });
    }
  };

  return (
    <section className="mx-4 my-3">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <h2 className="text-base font-semibold text-white tracking-wide">
          Upcoming Priorities
        </h2>
        <button
          onClick={onOpenAddMilestone}
          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium px-2 py-1 rounded-lg hover:bg-emerald-500/10 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Horizontal Scroll Cards (matching screenshot layout) */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1.5 pt-0.5 px-0.5 snap-x">
        {priorities.map((item) => {
          const styles = getThemeStyles(item.colorTheme);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedMilestone(item)}
              role="button"
              tabIndex={0}
              className={`snap-start min-w-[245px] max-w-[270px] p-3.5 rounded-2xl glass-panel border ${styles.cardBorder} cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] select-none flex flex-col justify-between`}
            >
              {/* Top row: Icon badge + Title with countdown */}
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center border shrink-0 ${styles.iconBg}`}
                >
                  {getIcon(item.iconType, item.colorTheme)}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-semibold text-white truncate">
                    {item.title}{' '}
                    <span className="font-normal text-slate-400 text-[11px]">
                      - {item.daysLeft} {item.daysLeft === 1 ? 'day' : 'days'} left
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {item.subject}
                  </p>
                </div>
              </div>

              {/* Glowing Progress Bar */}
              <div>
                <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-[1px] border border-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${styles.barGradient} transition-all duration-700 ease-out`}
                    style={{ width: `${Math.max(5, item.progress)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1.5">
                  <span>
                    {item.subtasks.filter((s) => s.completed).length}/{item.subtasks.length} milestones
                  </span>
                  <span className="font-semibold text-slate-200">{item.progress}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone Details Drawer Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#10121c] border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl relative animate-in fade-in slide-in-from-bottom-6 duration-200">
            {/* Grab handle for mobile */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />

            {/* Modal Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                    getThemeStyles(selectedMilestone.colorTheme).iconBg
                  }`}
                >
                  {getIcon(selectedMilestone.iconType, selectedMilestone.colorTheme)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedMilestone.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedMilestone.subject} · Due in {selectedMilestone.daysLeft} days
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMilestone(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Slider */}
            <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Overall Completion</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {selectedMilestone.progress}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedMilestone.progress}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const updated = { ...selectedMilestone, progress: val };
                  setSelectedMilestone(updated);
                  onUpdatePriority(updated);
                }}
                className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Checklist of Subtasks */}
            <div className="space-y-2 mb-4 max-h-52 overflow-y-auto no-scrollbar">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Milestone Action Items
              </h4>
              {selectedMilestone.subtasks.map((subtask) => (
                <button
                  key={subtask.id}
                  type="button"
                  onClick={() => handleToggleSubtask(selectedMilestone.id, subtask.id)}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-3 transition-colors ${
                    subtask.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                      : 'bg-white/[0.02] border-white/10 text-slate-200 hover:bg-white/[0.05]'
                  }`}
                >
                  {subtask.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span
                    className={`text-xs flex-1 ${
                      subtask.completed ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}
                  >
                    {subtask.text}
                  </span>
                </button>
              ))}
            </div>

            {/* Close / Action footer */}
            <button
              onClick={() => setSelectedMilestone(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold tracking-wide transition-colors"
            >
              Done &amp; Save
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
