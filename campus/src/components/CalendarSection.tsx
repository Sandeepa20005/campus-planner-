import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Clock, MapPin, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarSectionProps {
  events: CalendarEvent[];
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  onToggleEventComplete: (id: string) => void;
  onOpenAddModal: (date?: string) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  events,
  selectedDate,
  onSelectDate,
  onToggleEventComplete,
  onOpenAddModal,
}) => {
  const [isMonthExpanded, setIsMonthExpanded] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Base date around 2026-10-26 (matching the screenshot)
  const baseDate = new Date(2026, 9, 26); // Oct 26, 2026
  
  // Build 7-day week strip (Sun 21 to Sat 27 for offset 0)
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    // 21 Oct was Sunday, 26 Oct is Friday
    const d = new Date(2026, 9, 21 + currentWeekOffset * 7 + i);
    const dayNumber = d.getDate();
    const dateStr = d.toISOString().split('T')[0];
    const isSelected = dateStr === selectedDate;

    // Check if this date has assignments or exams
    const dayEvents = events.filter((e) => e.date === dateStr);
    const hasAssignments = dayEvents.some((e) => e.category === 'assignment');
    const hasExams = dayEvents.some((e) => e.category === 'exam');

    return {
      name: weekDays[i],
      dayNumber,
      dateStr,
      isSelected,
      hasAssignments,
      hasExams,
      eventsCount: dayEvents.length,
    };
  });

  // Filter events for the selected date
  const selectedDayEvents = events.filter((e) => e.date === selectedDate);

  const handlePrevWeek = () => setCurrentWeekOffset((prev) => prev - 1);
  const handleNextWeek = () => setCurrentWeekOffset((prev) => prev + 1);

  return (
    <section className="mx-4 my-3 p-4 rounded-3xl glass-panel relative overflow-hidden transition-all duration-300">
      {/* Background subtle neon light bleeding */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-white tracking-wide">
            Calendar
          </h2>
          <button
            onClick={() => setIsMonthExpanded(!isMonthExpanded)}
            className="text-[11px] text-slate-400 hover:text-cyan-300 px-2 py-0.5 rounded-md hover:bg-white/5 transition-colors"
          >
            {isMonthExpanded ? 'Week view' : 'Month view'}
          </button>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevWeek}
            aria-label="Previous week"
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextWeek}
            aria-label="Next week"
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Strip matching screenshot */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDates.map((day) => (
          <div key={day.dateStr} className="flex flex-col items-center">
            {/* Day name */}
            <span className="text-xs font-medium text-slate-400 mb-1">
              {day.name}
            </span>

            {/* Day number button with stardust sparkle on active date */}
            <div className="relative">
              <button
                type="button"
                onClick={() => onSelectDate(day.dateStr)}
                className={`relative w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                  day.isSelected
                    ? 'text-white bg-slate-900 shadow-[0_0_20px_rgba(56,189,248,0.7)] border-2 border-cyan-400/90'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {day.dayNumber}
              </button>

              {/* Sparkling Particle Effects on Active Selected Day (like in screenshot) */}
              {day.isSelected && (
                <div className="absolute -inset-2 pointer-events-none">
                  {/* Floating sparkles */}
                  <span className="absolute top-0 right-0 w-1 h-1 bg-cyan-300 rounded-full animate-sparkle shadow-[0_0_6px_#38bdf8]" />
                  <span className="absolute -bottom-1 left-1 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-sparkle delay-200 shadow-[0_0_8px_#34d399]" />
                  <span className="absolute top-1 -left-1 w-1 h-1 bg-white rounded-full animate-sparkle delay-500 shadow-[0_0_5px_#fff]" />
                  <span className="absolute -top-1 left-2 w-0.5 h-0.5 bg-purple-300 rounded-full" />
                </div>
              )}

              {/* Event indicators dots below the number */}
              <div className="flex items-center justify-center gap-1 mt-1 h-1.5">
                {day.hasAssignments && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
                )}
                {day.hasExams && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_4px_#c084fc]" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend Row matching screenshot */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span className="text-[11px] text-slate-300">Assignments</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
            <span className="text-[11px] text-slate-300">Exams</span>
          </div>
        </div>

        <button
          onClick={() => onOpenAddModal(selectedDate)}
          className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200 hover:underline"
        >
          <Plus className="w-3 h-3" />
          <span>Add schedule</span>
        </button>
      </div>

      {/* Selected Day Schedule Preview */}
      <div className="mt-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
          <span>Schedule for {selectedDate}:</span>
          <span>{selectedDayEvents.length} items</span>
        </div>

        {selectedDayEvents.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-500 bg-white/[0.02] rounded-xl border border-white/5">
            No scheduled events for this date.
            <button
              onClick={() => onOpenAddModal(selectedDate)}
              className="block mx-auto mt-1 text-cyan-400 hover:underline font-medium"
            >
              + Add a class, assignment, or study goal
            </button>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar pr-0.5">
            {selectedDayEvents.map((event) => (
              <div
                key={event.id}
                className={`p-2.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  event.completed
                    ? 'bg-slate-900/40 border-white/5 opacity-60'
                    : event.category === 'exam'
                    ? 'bg-purple-950/20 border-purple-500/30 shadow-[0_0_12px_rgba(192,132,252,0.12)]'
                    : 'bg-emerald-950/15 border-emerald-500/25 shadow-[0_0_12px_rgba(52,211,153,0.1)]'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onToggleEventComplete(event.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {event.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-medium truncate ${
                        event.completed ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {event.title}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="text-emerald-300/90">{event.subject}</span>
                      {event.time && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {event.time}
                          </span>
                        </>
                      )}
                      {event.location && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {event.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category indicator badge */}
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                    event.category === 'exam'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : event.category === 'assignment'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  {event.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
