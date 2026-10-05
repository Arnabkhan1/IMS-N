import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { DayOfWeek } from '../../types/ims';
import { X, CalendarDays, Plus } from 'lucide-react';

interface RoutineSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAYS: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const RoutineSlotModal: React.FC<RoutineSlotModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { instructors, addClassRoutineSlot } = useIMS();

  const [className, setClassName] = useState('Class 10');
  const [subject, setSubject] = useState('');
  const [instructorId, setInstructorId] = useState(instructors[0]?.id || '');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('Monday');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('10:30 AM');
  const [roomNumber, setRoomNumber] = useState('Room 101');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const selectedTeacher = instructors.find((i) => i.id === instructorId);

    addClassRoutineSlot({
      className,
      subject: subject.trim(),
      instructorName: selectedTeacher?.name || 'Faculty Member',
      instructorId,
      dayOfWeek,
      startTime,
      endTime,
      roomNumber: roomNumber.trim() || 'Room 101',
    });

    setSubject('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center items-start p-3 sm:p-5 pt-3 sm:pt-6 pb-12">
      <div className="relative bg-[#deedf9] rounded-xl shadow-2xl max-w-lg w-full border border-[#9ec5ea] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#03045e] text-white px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0 border-b border-[#0077b6]/30">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-300" />
            <div>
              <h3 className="font-bold text-sm text-white">Add Class Routine Period</h3>
              <p className="text-[11px] text-blue-200">
                Schedule weekly classroom & lab sessions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs text-[#1c446c] overflow-y-auto flex-1 overscroll-contain">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Class */}
            <div>
              <label className="block font-semibold mb-1 text-[#03045e]">Class *</label>
              <input
                list="routine-class-options"
                required
                type="text"
                placeholder="e.g. Class 10"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
              />
              <datalist id="routine-class-options">
                <option value="Class 9" />
                <option value="Class 10" />
                <option value="Class 11" />
                <option value="Class 12" />
                <option value="BCA / Diploma" />
                <option value="B.Tech" />
              </datalist>
            </div>

            {/* Subject */}
            <div>
              <label className="block font-semibold mb-1 text-[#03045e]">Subject / Paper *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mathematics, Physics, Computer"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
              />
            </div>

            {/* Faculty */}
            <div>
              <label className="block font-semibold mb-1 text-[#03045e]">Assigned Teacher *</label>
              <select
                value={instructorId}
                onChange={(e) => setInstructorId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
              >
                {instructors.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Day of Week */}
            <div>
              <label className="block font-semibold mb-1 text-[#03045e]">Day of Week *</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block font-semibold mb-1 text-[#03045e]">Start Time *</label>
              <input
                type="text"
                required
                placeholder="e.g. 09:00 AM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6] font-mono"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block font-semibold mb-1 text-[#03045e]">End Time *</label>
              <input
                type="text"
                required
                placeholder="e.g. 10:30 AM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6] font-mono"
              />
            </div>
          </div>

          {/* Room Number */}
          <div>
            <label className="block font-semibold mb-1 text-[#03045e]">Room / Lab Allocation *</label>
            <input
              type="text"
              required
              placeholder="e.g. Room 101 / Software Lab 301"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-[#b5d5ef] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-[#1c446c] hover:bg-[#cfe4f6] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 font-semibold bg-[#03045e] hover:bg-[#02023a] text-white rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Routine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
