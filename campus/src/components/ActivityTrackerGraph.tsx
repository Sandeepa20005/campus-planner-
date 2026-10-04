import React, { useState } from 'react';
import { Plus, Flame, Clock, Award } from 'lucide-react';
import { DayActivity } from '../types';

interface ActivityTrackerGraphProps {
  activityData: DayActivity[];
  onLogHoursForDay: (dayIndex: number, addedHours: number) => void;
  onOpenDetailedLogger: () => void;
}

export const ActivityTrackerGraph: React.FC<ActivityTrackerGraphProps> = ({
  activityData,
  onLogHoursForDay,
  onOpenDetailedLogger,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(5); // default to Fri (index 5) matching screenshot

  const maxHours = 16;
  const yTicks = [16, 12, 8, 4, 0];
  const chartHeight = 160; // svg height for graph area
  const chartWidth = 320; // svg width
  const xPadding = 26;
  const colWidth = (chartWidth - xPadding * 2) / (activityData.length - 1);

  // Compute points for spline curve
  const points = activityData.map((d, i) => {
    const x = xPadding + i * colWidth;
    // Normalized y: 0h is at bottom (y = 150), 16h is near top (y = 15)
    const ratio = Math.min(1, Math.max(0, d.hours / maxHours));
    const y = 150 - ratio * 135;
    return { x, y, ...d };
  });

  // Generate smooth cubic bezier SVG path across points
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const smoothCurvePath = generateSmoothPath(points);
  // Area path for gradient fill beneath curve
  const areaPath = `${smoothCurvePath} L ${points[points.length - 1].x} 155 L ${points[0].x} 155 Z`;

  const currentSelected = activityData[selectedDayIndex] || activityData[5];
  const totalWeeklyHours = activityData.reduce((acc, d) => acc + d.hours, 0);

  return (
    <section className="mx-4 my-3 p-4 rounded-3xl glass-panel relative overflow-hidden">
      {/* Background neon ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-base font-semibold text-white tracking-wide">
            Activity Tracker Graph
          </h2>
          <p className="text-[11px] text-slate-400">
            Weekly Focus: <span className="font-mono text-cyan-300 font-bold">{totalWeeklyHours}h</span> logged
          </p>
        </div>

        <button
          onClick={onOpenDetailedLogger}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 rounded-lg hover:bg-cyan-500/10 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Hours</span>
        </button>
      </div>

      {/* Graph Area Container */}
      <div className="relative pt-2 pb-1">
        {/* Y-Axis scale and chart */}
        <div className="flex">
          {/* Y-Axis Labels */}
          <div className="flex flex-col justify-between text-[11px] text-slate-400 font-mono pr-2 py-0.5 select-none h-[155px]">
            {yTicks.map((val) => (
              <span key={val} className="text-right w-4">
                {val}
              </span>
            ))}
          </div>

          {/* SVG Canvas for bars, rings and spline curve */}
          <div className="relative flex-1 h-[155px]">
            {/* Horizontal Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              {yTicks.map((val) => (
                <div key={val} className="border-b border-dashed border-slate-400/40 w-full" />
              ))}
            </div>

            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Curve Neon Gradient */}
                <linearGradient id="curveNeonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="40%" stopColor="#34d399" />
                  <stop offset="70%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>

                {/* Translucent Under-curve Fill Gradient */}
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#818cf8" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.0" />
                </linearGradient>

                {/* Vertical Bar Capsule Gradient */}
                <linearGradient id="barNeonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.6" />
                  <stop offset="80%" stopColor="#a855f7" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
                </linearGradient>

                {/* Glow Filter for Spline */}
                <filter id="splineGlow" x="-20%" y="-40%" width="140%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur1" />
                  <feGaussianBlur stdDeviation="6" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. Translucent Gradient Fill Area beneath curve */}
              <path d={areaPath} fill="url(#areaGradient)" />

              {/* 2. Vertical Rounded Capsule Bars matching screenshot */}
              {points.map((pt, idx) => {
                const barWidth = 20;
                const barTop = pt.y;
                const barBottom = 150;
                const barHeight = Math.max(8, barBottom - barTop);
                const isSelected = idx === selectedDayIndex;

                return (
                  <g
                    key={pt.dayName}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => setSelectedDayIndex(idx)}
                  >
                    {/* Hover hit-box */}
                    <rect
                      x={pt.x - colWidth / 2}
                      y={0}
                      width={colWidth}
                      height={chartHeight}
                      fill="transparent"
                    />

                    {/* Glowing Bar Background Capsule */}
                    <rect
                      x={pt.x - barWidth / 2}
                      y={barTop}
                      width={barWidth}
                      height={barHeight}
                      rx={barWidth / 2}
                      fill="url(#barNeonGrad)"
                      stroke={isSelected ? '#34d399' : 'rgba(255, 255, 255, 0.25)'}
                      strokeWidth={isSelected ? 1.8 : 1}
                      className="transition-all duration-300"
                      filter={isSelected ? 'url(#splineGlow)' : undefined}
                      opacity={isSelected ? 1 : 0.75}
                    />

                    {/* Bottom Glowing Circular Ring 'o' as shown in the screenshot */}
                    <circle
                      cx={pt.x}
                      cy={150}
                      r={6.5}
                      fill="#0e101a"
                      stroke={isSelected ? '#38bdf8' : '#c084fc'}
                      strokeWidth={2}
                      className="transition-all duration-300 shadow-[0_0_8px_#38bdf8]"
                    />
                    <circle
                      cx={pt.x}
                      cy={150}
                      r={2.5}
                      fill={isSelected ? '#38bdf8' : 'rgba(255,255,255,0.7)'}
                    />
                  </g>
                );
              })}

              {/* 3. Glowing Spline Curve over the pillars */}
              <path
                d={smoothCurvePath}
                fill="none"
                stroke="url(#curveNeonGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#splineGlow)"
              />
              <path
                d={smoothCurvePath}
                fill="none"
                stroke="url(#curveNeonGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* 4. Active point indicator bubble */}
              {points[selectedDayIndex] && (
                <circle
                  cx={points[selectedDayIndex].x}
                  cy={points[selectedDayIndex].y}
                  r="5"
                  fill="#ffffff"
                  stroke="#34d399"
                  strokeWidth="2.5"
                  filter="url(#splineGlow)"
                />
              )}
            </svg>
          </div>
        </div>

        {/* X-Axis Day Labels matching screenshot */}
        <div className="flex justify-between pl-6 pr-2 mt-2 text-xs font-medium text-slate-400">
          {activityData.map((d, idx) => (
            <button
              key={d.dayName}
              type="button"
              onClick={() => setSelectedDayIndex(idx)}
              className={`w-9 text-center py-0.5 rounded-lg transition-colors ${
                idx === selectedDayIndex
                  ? 'text-cyan-300 font-bold bg-white/10'
                  : 'hover:text-slate-200'
              }`}
            >
              {d.dayName}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Day Interactive Insight Bar */}
      <div className="mt-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold font-mono">
            {currentSelected.hours}h
          </div>
          <div>
            <p className="font-semibold text-white">
              {currentSelected.dayName} Focus ({currentSelected.dateStr})
            </p>
            <p className="text-[11px] text-slate-400">
              {currentSelected.completedTasks} tasks done ·{' '}
              {currentSelected.hours >= currentSelected.targetHours
                ? 'Target achieved 🎯'
                : `${currentSelected.targetHours - currentSelected.hours}h to target`}
            </p>
          </div>
        </div>

        {/* Quick +1 Hour increment button */}
        <button
          type="button"
          onClick={() => onLogHoursForDay(selectedDayIndex, 1)}
          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-medium active:scale-95 transition-all text-xs flex items-center gap-1 shadow-[0_0_10px_rgba(52,211,153,0.2)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+1h Log</span>
        </button>
      </div>
    </section>
  );
};
