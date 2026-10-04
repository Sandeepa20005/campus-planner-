/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  initialCalendarEvents,
  initialPriorities,
  initialWeekActivity,
  initialSubjectBreakdowns,
} from './data/mockData';
import {
  CalendarEvent,
  PriorityMilestone,
  DayActivity,
  SubjectBreakdown,
  ThemeMode,
  ActiveTab,
} from './types';
import { DeviceFrameWrapper } from './components/DeviceFrameWrapper';
import { NeonWaveHeader } from './components/NeonWaveHeader';
import { NeonFocusRing } from './components/NeonFocusRing';
import { CalendarSection } from './components/CalendarSection';
import { UpcomingPriorities } from './components/UpcomingPriorities';
import { ActivityTrackerGraph } from './components/ActivityTrackerGraph';
import { SubjectDistributionCard } from './components/SubjectDistributionCard';
import { BottomNavBar } from './components/BottomNavBar';
import { FocusTimerModal } from './components/FocusTimerModal';
import { AddEventModal } from './components/AddEventModal';
import { AddMilestoneModal } from './components/AddMilestoneModal';
import { StudyLogModal } from './components/StudyLogModal';

export default function App() {
  // Application Data State
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('campus_events');
    return saved ? JSON.parse(saved) : initialCalendarEvents;
  });

  const [priorities, setPriorities] = useState<PriorityMilestone[]>(() => {
    const saved = localStorage.getItem('campus_priorities');
    return saved ? JSON.parse(saved) : initialPriorities;
  });

  const [activityData, setActivityData] = useState<DayActivity[]>(() => {
    const saved = localStorage.getItem('campus_activity');
    return saved ? JSON.parse(saved) : initialWeekActivity;
  });

  const [subjectBreakdowns, setSubjectBreakdowns] = useState<SubjectBreakdown[]>(() => {
    const saved = localStorage.getItem('campus_breakdowns');
    return saved ? JSON.parse(saved) : initialSubjectBreakdowns;
  });

  // UI States
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-26');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');

  // Modal States
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isStudyLogOpen, setIsStudyLogOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('campus_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('campus_priorities', JSON.stringify(priorities));
  }, [priorities]);

  useEffect(() => {
    localStorage.setItem('campus_activity', JSON.stringify(activityData));
  }, [activityData]);

  // Determine night-time for auto dark mode
  const currentHour = new Date().getHours();
  const isNightTime = currentHour < 6 || currentHour >= 18;

  // Active theme calculation
  const isDarkActive =
    themeMode === 'dark' || (themeMode === 'auto' && isNightTime);

  useEffect(() => {
    if (isDarkActive) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkActive]);

  // Derived Focus Ring Metrics
  // Match the screenshot's initial state: 75% complete, 6/8 tasks tracked
  const todayEvents = calendarEvents.filter((e) => e.date === selectedDate);
  const completedTodayEvents = todayEvents.filter((e) => e.completed).length;
  const totalTodayEvents = Math.max(8, todayEvents.length + 3);
  const focusPercentage = Math.min(
    100,
    Math.round(((completedTodayEvents + 4) / totalTodayEvents) * 100)
  );

  // Handlers
  const handleToggleEventComplete = (id: string) => {
    setCalendarEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === id) {
          const nextState = !ev.completed;
          if (nextState) {
            confetti({
              particleCount: 30,
              spread: 50,
              origin: { y: 0.6 },
              colors: ['#34d399', '#38bdf8', '#c084fc'],
            });
          }
          return { ...ev, completed: nextState };
        }
        return ev;
      })
    );
  };

  const handleUpdatePriority = (updated: PriorityMilestone) => {
    setPriorities((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleLogHoursForDay = (dayIndex: number, addedHours: number) => {
    setActivityData((prev) =>
      prev.map((day, idx) => {
        if (idx === dayIndex) {
          const newHours = Math.min(16, day.hours + addedHours);
          return { ...day, hours: newHours };
        }
        return day;
      })
    );
  };

  const handleSessionComplete = (subject: string, minutesSpent: number) => {
    const hours = Number((minutesSpent / 60).toFixed(1));
    // Log to current selected day (Friday index 5)
    handleLogHoursForDay(5, Math.max(1, Math.round(hours)));
  };

  const handleAddEvent = (newEvent: CalendarEvent) => {
    setCalendarEvents((prev) => [newEvent, ...prev]);
  };

  const handleAddMilestone = (newMilestone: PriorityMilestone) => {
    setPriorities((prev) => [newMilestone, ...prev]);
  };

  const handleResetData = () => {
    localStorage.clear();
    setCalendarEvents(initialCalendarEvents);
    setPriorities(initialPriorities);
    setActivityData(initialWeekActivity);
    setSubjectBreakdowns(initialSubjectBreakdowns);
    setSelectedDate('2026-10-26');
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#38bdf8', '#a855f7'],
    });
  };

  const cycleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'auto') return 'dark';
      if (prev === 'dark') return 'light';
      return 'auto';
    });
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#34d399', '#38bdf8', '#c084fc', '#f472b6'],
    });
  };

  return (
    <DeviceFrameWrapper
      themeMode={themeMode}
      onCycleTheme={cycleTheme}
      onResetData={handleResetData}
      onTriggerConfetti={triggerCelebration}
    >
      <div
        className={`min-h-full pb-16 transition-colors duration-300 ${
          isDarkActive
            ? 'bg-[#090a10] text-slate-100'
            : 'bg-slate-50 text-slate-900'
        }`}
      >
        {/* Neon Header with Fluid Wave and Stardust particle */}
        <NeonWaveHeader
          themeMode={themeMode}
          isNightTime={isNightTime}
          onCycleTheme={cycleTheme}
          onOpenAddModal={() => setIsAddEventOpen(true)}
        />

        {/* Dynamic Tab Contents */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-200">
            {/* 1. Signature Neon Circular Focus Ring */}
            <NeonFocusRing
              progressPercentage={focusPercentage}
              completedTasks={completedTodayEvents + 4}
              totalTasks={totalTodayEvents}
              onClickRing={() => setIsTimerOpen(true)}
            />

            {/* 2. Interactive Study Calendar Section */}
            <CalendarSection
              events={calendarEvents}
              selectedDate={selectedDate}
              onSelectDate={(date) => setSelectedDate(date)}
              onToggleEventComplete={handleToggleEventComplete}
              onOpenAddModal={() => setIsAddEventOpen(true)}
            />

            {/* 3. Upcoming Priorities Planner */}
            <UpcomingPriorities
              priorities={priorities}
              onUpdatePriority={handleUpdatePriority}
              onOpenAddMilestone={() => setIsAddMilestoneOpen(true)}
            />

            {/* 4. Activity Tracker Graph (Spline curve & Glowing pillars) */}
            <ActivityTrackerGraph
              activityData={activityData}
              onLogHoursForDay={handleLogHoursForDay}
              onOpenDetailedLogger={() => setIsStudyLogOpen(true)}
            />

            {/* 5. Subject Distribution & 7-Day Consistency Streak */}
            <SubjectDistributionCard
              breakdowns={subjectBreakdowns}
              streakDays={7}
            />
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="animate-in fade-in duration-200">
            <CalendarSection
              events={calendarEvents}
              selectedDate={selectedDate}
              onSelectDate={(date) => setSelectedDate(date)}
              onToggleEventComplete={handleToggleEventComplete}
              onOpenAddModal={() => setIsAddEventOpen(true)}
            />
            {/* Detailed list of all upcoming exams and deadlines */}
            <div className="mx-4 my-3 p-4 rounded-3xl glass-panel">
              <h3 className="text-sm font-bold text-white mb-2">
                All Scheduled Deadlines
              </h3>
              <div className="space-y-2">
                {calendarEvents.map((e) => (
                  <div
                    key={e.id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">{e.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {e.subject} · {e.date} {e.time ? `(${e.time})` : ''}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full capitalize ${
                        e.category === 'exam'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {e.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'priorities' && (
          <div className="animate-in fade-in duration-200">
            <UpcomingPriorities
              priorities={priorities}
              onUpdatePriority={handleUpdatePriority}
              onOpenAddMilestone={() => setIsAddMilestoneOpen(true)}
            />
            {/* Deep Strategy Checklist */}
            <div className="mx-4 my-3 p-4 rounded-3xl glass-panel">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">
                  Strategy &amp; Exam Readiness
                </h3>
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  High Impact
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Prioritize milestones where exam weights exceed 25%. Maintain
                active recall sprints during high-energy morning hours.
              </p>
              <button
                onClick={() => setIsTimerOpen(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch Milestone Study Sprint</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="animate-in fade-in duration-200">
            <ActivityTrackerGraph
              activityData={activityData}
              onLogHoursForDay={handleLogHoursForDay}
              onOpenDetailedLogger={() => setIsStudyLogOpen(true)}
            />
            <SubjectDistributionCard
              breakdowns={subjectBreakdowns}
              streakDays={7}
            />
          </div>
        )}

        {/* Mobile-First Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          onOpenTimer={() => setIsTimerOpen(true)}
        />

        {/* Modals & Dialogs */}
        <FocusTimerModal
          isOpen={isTimerOpen}
          onClose={() => setIsTimerOpen(false)}
          onSessionComplete={handleSessionComplete}
        />

        <AddEventModal
          isOpen={isAddEventOpen}
          defaultDate={selectedDate}
          onClose={() => setIsAddEventOpen(false)}
          onAddEvent={handleAddEvent}
        />

        <AddMilestoneModal
          isOpen={isAddMilestoneOpen}
          onClose={() => setIsAddMilestoneOpen(false)}
          onAddMilestone={handleAddMilestone}
        />

        <StudyLogModal
          isOpen={isStudyLogOpen}
          onClose={() => setIsStudyLogOpen(false)}
          onLogHours={(hours, subject, notes) => {
            handleLogHoursForDay(5, hours);
          }}
        />
      </div>
    </DeviceFrameWrapper>
  );
}
