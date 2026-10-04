import React from 'react';
import { SubjectBreakdown } from '../types';
import { Flame, Target, Trophy } from 'lucide-react';

interface SubjectDistributionCardProps {
  breakdowns: SubjectBreakdown[];
  streakDays: number;
}

export const SubjectDistributionCard: React.FC<SubjectDistributionCardProps> = ({
  breakdowns,
  streakDays = 7,
}) => {
  return (
    <section className="mx-4 my-3 p-4 rounded-3xl glass-panel relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-base font-semibold text-white tracking-wide">
            Subject Distribution &amp; Streak
          </h2>
          <p className="text-[11px] text-slate-400">
            Academic focus ratio across semester modules
          </p>
        </div>

        {/* Streak Flame Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-amber-300 shadow-[0_0_12px_rgba(249,115,22,0.25)]">
          <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
          <span className="text-xs font-bold font-mono">{streakDays} Days</span>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800/80 p-[1px] border border-white/10 mb-4">
        {breakdowns.map((sub) => (
          <div
            key={sub.id}
            style={{
              width: `${sub.percentage}%`,
              backgroundColor: sub.color,
              boxShadow: `0 0 10px ${sub.glowColor}`,
            }}
            className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
            title={`${sub.name}: ${sub.hours}h (${sub.percentage}%)`}
          />
        ))}
      </div>

      {/* Breakdown list */}
      <div className="grid grid-cols-2 gap-2.5">
        {breakdowns.map((sub) => (
          <div
            key={sub.id}
            className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: sub.color,
                  boxShadow: `0 0 8px ${sub.glowColor}`,
                }}
              />
              <span className="text-xs text-slate-200 truncate">
                {sub.name}
              </span>
            </div>

            <div className="text-right shrink-0 font-mono text-[11px] text-slate-400">
              <span className="text-white font-medium">{sub.hours}h</span>{' '}
              <span>({sub.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
