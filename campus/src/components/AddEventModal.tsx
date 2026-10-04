import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Tag, AlertCircle } from 'lucide-react';
import { CalendarEvent, EventCategory, PriorityLevel } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  defaultDate?: string;
  onClose: () => void;
  onAddEvent: (event: CalendarEvent) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  defaultDate = '2026-10-26',
  onClose,
  onAddEvent,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('11:59 PM');
  const [category, setCategory] = useState<EventCategory>('assignment');
  const [priority, setPriority] = useState<PriorityLevel>('high');
  const [location, setLocation] = useState('Campus Portal / Canvas');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvent: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: title.trim(),
      subject,
      date,
      time,
      category,
      priority,
      location,
      notes,
      completed: false,
    };

    onAddEvent(newEvent);
    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0e101a] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Schedule New Milestone</h3>
            <p className="text-xs text-slate-400">Class, Assignment, or Exam</p>
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
            <label className="block text-slate-300 font-medium mb-1">Title / Task Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Systems Lab 4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Database Tech">Database Tech</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="assignment">Assignment</option>
                <option value="exam">Exam</option>
                <option value="class">Class</option>
                <option value="study">Study Session</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Time</label>
              <input
                type="text"
                placeholder="e.g. 11:59 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Location / Link</label>
              <input
                type="text"
                placeholder="e.g. Science Hall 301"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Notes / Instructions</label>
            <textarea
              rows={2}
              placeholder="e.g. Topics to review, references, prerequisites..."
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:opacity-95 transition-opacity"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
