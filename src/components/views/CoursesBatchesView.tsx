import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { DayOfWeek } from '../../types/ims';
import {
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  Printer,
  Trash2,
  GraduationCap,
  BookOpen,
  Filter,
} from 'lucide-react';

interface CoursesBatchesViewProps {
  onOpenBatchModal: () => void;
}

const ALL_DAYS: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const CoursesBatchesView: React.FC<CoursesBatchesViewProps> = ({
  onOpenBatchModal,
}) => {
  const { classRoutines, deleteClassRoutineSlot, currentUser } = useIMS();

  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  // Extract unique classes from routines
  const availableClasses = Array.from(
    new Set(classRoutines.map((r) => r.className))
  ).sort();

  // Filter slots
  const filteredSlots = classRoutines.filter((slot) => {
    if (selectedDay !== 'ALL' && slot.dayOfWeek !== selectedDay) return false;
    if (selectedClass !== 'ALL' && slot.className !== selectedClass) return false;
    return true;
  });

  // Group by Day of Week
  const daysToRender = selectedDay === 'ALL' ? ALL_DAYS : [selectedDay as DayOfWeek];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#03045e] flex items-center justify-center text-white">
              <CalendarDays className="w-4 h-4 text-blue-300" />
            </div>
            <h1 className="text-xl font-bold text-[#03045e] tracking-tight">
              Weekly Class Routine
            </h1>
          </div>
          <p className="text-xs text-[#284f76] mt-1">
            Weekly classroom timetable, subject periods, assigned faculty, and room allocations
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-[#cfe4f6] hover:bg-[#bdddf5] text-[#03045e] border border-[#9ec5ea] px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-[#0077b6]" />
            <span>Print Routine</span>
          </button>

          {(currentUser.role === 'ADMIN' || currentUser.role === 'TEACHER') && (
            <button
              onClick={onOpenBatchModal}
              className="flex items-center gap-1.5 bg-[#03045e] hover:bg-[#02023a] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Routine Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#deedf9] p-4 rounded-xl border border-[#9ec5ea] shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Class Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#03045e] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#0077b6]" />
            Class:
          </span>
          <button
            onClick={() => setSelectedClass('ALL')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              selectedClass === 'ALL'
                ? 'bg-[#03045e] text-white shadow-xs'
                : 'bg-[#cfe4f6] text-[#1c446c] hover:bg-[#bdddf5] border border-[#a6ceee]'
            }`}
          >
            All Classes ({classRoutines.length})
          </button>
          {availableClasses.map((cls) => {
            const count = classRoutines.filter((r) => r.className === cls).length;
            return (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  selectedClass === cls
                    ? 'bg-[#03045e] text-white shadow-xs'
                    : 'bg-[#cfe4f6] text-[#1c446c] hover:bg-[#bdddf5] border border-[#a6ceee]'
                }`}
              >
                {cls} ({count})
              </button>
            );
          })}
        </div>

        {/* Day Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#03045e] font-semibold mr-1">Day:</span>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] font-medium text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
          >
            <option value="ALL">All Days (Monday - Sunday)</option>
            {ALL_DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Routine Display By Days */}
      <div className="space-y-5">
        {daysToRender.map((day) => {
          const slotsForDay = filteredSlots.filter((s) => s.dayOfWeek === day);

          if (slotsForDay.length === 0 && selectedDay !== 'ALL') {
            return (
              <div
                key={day}
                className="bg-[#deedf9] p-8 rounded-xl border border-[#9ec5ea] text-center text-[#4a75a0] text-xs"
              >
                No class routine slots scheduled for {day}.
              </div>
            );
          }

          if (slotsForDay.length === 0) return null;

          return (
            <div
              key={day}
              className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs overflow-hidden"
            >
              {/* Day Header */}
              <div className="bg-[#cde4f7] px-5 py-3 border-b border-[#9ec5ea] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#03045e] uppercase tracking-wide">
                    {day}
                  </span>
                  <span className="text-xs bg-[#b5d7f3] text-[#03045e] font-bold px-2 py-0.5 rounded">
                    {slotsForDay.length} {slotsForDay.length === 1 ? 'Period' : 'Periods'}
                  </span>
                </div>
              </div>

              {/* Day Periods Grid */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {slotsForDay.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-4 rounded-xl bg-[#cfe4f6] border border-[#a6ceee] hover:border-[#0077b6] hover:bg-[#c6def4] transition-all space-y-2 text-xs relative group"
                  >
                    {/* Time & Class */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs bg-[#03045e] text-white px-2 py-0.5 rounded">
                        {slot.className}
                      </span>
                      <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-[#0077b6] bg-[#deedf9] px-2 py-0.5 rounded border border-[#9ec5ea]">
                        <Clock className="w-3 h-3 text-[#0077b6]" />
                        <span>
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="pt-1">
                      <div className="font-bold text-sm text-[#03045e] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#0077b6]" />
                        <span>{slot.subject}</span>
                      </div>
                    </div>

                    {/* Teacher & Room */}
                    <div className="pt-2 border-t border-[#b5d5ef] flex items-center justify-between text-[11px] text-[#1c446c]">
                      <div className="flex items-center gap-1 font-medium text-[#03045e]">
                        <GraduationCap className="w-3.5 h-3.5 text-[#0077b6]" />
                        <span>{slot.instructorName}</span>
                      </div>

                      <div className="flex items-center gap-1 font-mono text-[#385e85] bg-[#deedf9] px-1.5 py-0.5 rounded">
                        <MapPin className="w-3 h-3 text-[#0077b6]" />
                        <span>{slot.roomNumber}</span>
                      </div>
                    </div>

                    {/* Admin delete action */}
                    {currentUser.role === 'ADMIN' && (
                      <button
                        onClick={() => deleteClassRoutineSlot(slot.id)}
                        title="Delete Routine Period"
                        className="absolute top-2 right-2 p-1 text-rose-600 hover:bg-rose-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
