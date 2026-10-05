import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { X, BookOpen, Plus, Trash2 } from 'lucide-react';
import { ScheduleSlot } from '../../types/ims';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatchModal: React.FC<BatchModalProps> = ({ isOpen, onClose }) => {
  const { courses, instructors, addBatch, batches } = useIMS();

  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [instructorId, setInstructorId] = useState(instructors[0]?.id || '');
  const [name, setName] = useState('');
  const [batchCode, setBatchCode] = useState(`NL-B${batches.length + 101}`);
  const [seatLimit, setSeatLimit] = useState(25);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedules, setSchedules] = useState<Omit<ScheduleSlot, 'id' | 'batchId'>[]>([
    {
      dayOfWeek: 'Sun',
      startTime: '04:00 PM',
      endTime: '06:00 PM',
      roomNumber: 'Software Lab 301',
    },
    {
      dayOfWeek: 'Tue',
      startTime: '04:00 PM',
      endTime: '06:00 PM',
      roomNumber: 'Software Lab 301',
    },
  ]);

  if (!isOpen) return null;

  const handleAddSlot = () => {
    setSchedules((prev) => [
      ...prev,
      {
        dayOfWeek: 'Thu',
        startTime: '04:00 PM',
        endTime: '06:00 PM',
        roomNumber: 'Software Lab 301',
      },
    ]);
  };

  const handleRemoveSlot = (index: number) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const fullSchedules: ScheduleSlot[] = schedules.map((s, idx) => ({
      ...s,
      id: 'sch-' + Date.now().toString(36) + idx,
      batchId: '',
    }));

    addBatch({
      courseId,
      instructorId,
      name,
      batchCode,
      seatLimit: Number(seatLimit),
      startDate,
      status: 'Ongoing',
      schedules: fullSchedules,
    });

    onClose();
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center items-start p-3 sm:p-5 pt-3 sm:pt-6 pb-12">
      <div className="relative bg-[#deedf9] rounded-xl shadow-2xl max-w-xl w-full border border-[#9ec5ea] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#03045e] text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 border-b border-[#0077b6]/30">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-300" />
            <h3 className="font-bold text-sm">Create New Academic Batch</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs text-[#1c446c] overflow-y-auto flex-1 overscroll-contain">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1 text-[#03045e]">Course Curriculum *</label>
              <select
                required
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#03045e]">Assigned Faculty Instructor *</label>
              <select
                required
                value={instructorId}
                onChange={(e) => setInstructorId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
              >
                {instructors.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1 text-[#03045e]">Batch Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. AI Engineers Cohort 2026-B"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#03045e]">Batch Code</label>
              <input
                type="text"
                required
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1 text-[#03045e]">Seat Quota</label>
              <input
                type="number"
                required
                min={5}
                max={100}
                value={seatLimit}
                onChange={(e) => setSeatLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#03045e]">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
              />
            </div>
          </div>

          {/* Schedule Slots */}
          <div className="space-y-2 pt-2 border-t border-[#b5d5ef]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#03045e] uppercase tracking-wider">
                Weekly Class Routine Timetable
              </span>
              <button
                type="button"
                onClick={handleAddSlot}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#0077b6] hover:text-[#03045e]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Routine Slot</span>
              </button>
            </div>

            <div className="space-y-2">
              {schedules.map((slot, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 p-2.5 rounded-lg bg-[#cfe4f6] border border-[#a6ceee] items-center"
                >
                  <div className="col-span-3">
                    <select
                      value={slot.dayOfWeek}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[index].dayOfWeek = e.target.value as ScheduleSlot['dayOfWeek'];
                        setSchedules(updated);
                      }}
                      className="w-full px-2 py-1 text-xs rounded border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e]"
                    >
                      <option value="Sun">Sun</option>
                      <option value="Mon">Mon</option>
                      <option value="Tue">Tue</option>
                      <option value="Wed">Wed</option>
                      <option value="Thu">Thu</option>
                      <option value="Fri">Fri</option>
                      <option value="Sat">Sat</option>
                    </select>
                  </div>

                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="Start Time"
                      value={slot.startTime}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[index].startTime = e.target.value;
                        setSchedules(updated);
                      }}
                      className="w-full px-2 py-1 text-xs rounded border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e]"
                    />
                  </div>

                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="End Time"
                      value={slot.endTime}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[index].endTime = e.target.value;
                        setSchedules(updated);
                      }}
                      className="w-full px-2 py-1 text-xs rounded border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e]"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Room"
                      value={slot.roomNumber}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[index].roomNumber = e.target.value;
                        setSchedules(updated);
                      }}
                      className="w-full px-2 py-1 text-xs rounded border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e]"
                    />
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(index)}
                      className="p-1 text-rose-700 hover:text-rose-900"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 bg-[#deedf9] pt-3 pb-1 border-t border-[#b5d5ef] flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#1c446c] hover:bg-[#cfe4f6] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#03045e] hover:bg-[#02023a] text-white rounded-lg transition-colors shadow-xs"
            >
              Create Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
