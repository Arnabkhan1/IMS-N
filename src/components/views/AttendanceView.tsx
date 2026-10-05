import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { AttendanceStatus } from '../../types/ims';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Check,
  UserCheck,
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    batches,
    enrollments,
    students,
    studentAttendance,
    saveBatchAttendance,
    instructors,
    teacherAttendance,
    recordTeacherAttendance,
    currentUser,
  } = useIMS();

  // If teacher logged in, default to their batch
  const myBatches =
    currentUser.role === 'TEACHER'
      ? batches.filter((b) => b.instructorId === currentUser.associatedId)
      : batches;

  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    myBatches[0]?.id || batches[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Enrolled students for selected batch
  const enrolledStudents = enrollments
    .filter((e) => e.batchId === selectedBatchId)
    .map((e) => students.find((s) => s.id === e.studentId))
    .filter((s): s is NonNullable<typeof s> => Boolean(s && !s.deletedAt));

  // Current attendance records for selected batch and date
  const [studentStatuses, setStudentStatuses] = useState<
    Record<string, { status: AttendanceStatus; remarks: string }>
  >({});

  // Sync state when batch or date changes
  React.useEffect(() => {
    const initialMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    enrolledStudents.forEach((s) => {
      const existing = studentAttendance.find(
        (a) => a.batchId === selectedBatchId && a.studentId === s.id && a.date === selectedDate
      );
      initialMap[s.id] = {
        status: existing ? existing.status : 'PRESENT',
        remarks: existing?.remarks || '',
      };
    });
    setStudentStatuses(initialMap);
  }, [selectedBatchId, selectedDate, enrolledStudents.length]);

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated = { ...studentStatuses };
    enrolledStudents.forEach((s) => {
      updated[s.id] = { ...updated[s.id], status };
    });
    setStudentStatuses(updated);
  };

  const handleSaveStudentAttendance = () => {
    const records = enrolledStudents.map((s) => ({
      studentId: s.id,
      status: studentStatuses[s.id]?.status || 'PRESENT',
      remarks: studentStatuses[s.id]?.remarks || undefined,
    }));

    saveBatchAttendance(selectedBatchId, selectedDate, records);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#03045e] tracking-tight">
            Novum Labs Attendance Hub & Registry
          </h1>
          <p className="text-xs text-[#284f76]">
            Batch-wise student presence tracking and daily faculty check-in registers
          </p>
        </div>

        {/* Tab switcher: Student vs Teacher */}
        {currentUser.role === 'ADMIN' && (
          <div className="flex items-center gap-1 bg-[#cfe4f6] p-1 rounded-lg border border-[#a6ceee]">
            <button
              onClick={() => setActiveTab('students')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'students'
                  ? 'bg-[#03045e] text-white shadow-xs'
                  : 'text-[#1c446c] hover:text-[#03045e]'
              }`}
            >
              Student Attendance
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'teachers'
                  ? 'bg-[#03045e] text-white shadow-xs'
                  : 'text-[#1c446c] hover:text-[#03045e]'
              }`}
            >
              Faculty Check-In
            </button>
          </div>
        )}
      </div>

      {/* Student Attendance Flow */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="bg-[#deedf9] p-4 rounded-xl border border-[#9ec5ea] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#2c537a] uppercase tracking-wider mb-1">
                  Class
                </label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="bg-[#eaf4fd] text-[#03045e] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#9ec5ea] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                >
                  {myBatches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#2c537a] uppercase tracking-wider mb-1">
                  Session Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-[#eaf4fd] text-[#03045e] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#9ec5ea] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                />
              </div>
            </div>

            {/* Bulk status toggles */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#2c537a] font-medium mr-1 hidden sm:inline">
                Bulk Action:
              </span>
              <button
                onClick={() => handleMarkAll('PRESENT')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-[#c8e8d8] text-emerald-900 border border-emerald-300 rounded hover:bg-[#b0dfc6] transition-colors"
              >
                Mark All Present
              </button>
              <button
                onClick={() => handleMarkAll('ABSENT')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-rose-100 text-rose-900 border border-rose-300 rounded hover:bg-rose-200 transition-colors"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#cde4f7] text-[#03045e] border-b border-[#9ec5ea] font-semibold">
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4 text-center">Attendance Status</th>
                  <th className="py-3 px-4">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3dcf2]">
                {enrolledStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#4a75a0]">
                      No active students enrolled in this batch.
                    </td>
                  </tr>
                ) : (
                  enrolledStudents.map((student) => {
                    const currentStatus = studentStatuses[student.id]?.status || 'PRESENT';
                    const currentRemarks = studentStatuses[student.id]?.remarks || '';

                    return (
                      <tr key={student.id} className="hover:bg-[#d4e7f7] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#03045e]">
                          {student.studentRoll}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#03045e]">{student.name}</div>
                          <div className="text-[11px] text-[#385e85]">{student.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {(['PRESENT', 'ABSENT', 'LATE', 'LEAVE'] as AttendanceStatus[]).map(
                              (st) => {
                                const active = currentStatus === st;
                                return (
                                  <button
                                    key={st}
                                    onClick={() =>
                                      setStudentStatuses((prev) => ({
                                        ...prev,
                                        [student.id]: {
                                          ...prev[student.id],
                                          status: st,
                                        },
                                      }))
                                    }
                                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all border ${
                                      active
                                        ? st === 'PRESENT'
                                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                                          : st === 'ABSENT'
                                          ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                                          : st === 'LATE'
                                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                          : 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                        : 'bg-[#cfe4f6] text-[#1c446c] border-[#a6ceee] hover:bg-[#bdddf5]'
                                    }`}
                                  >
                                    {st}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            placeholder="Optional note / reason..."
                            value={currentRemarks}
                            onChange={(e) =>
                              setStudentStatuses((prev) => ({
                                ...prev,
                                [student.id]: {
                                  ...prev[student.id],
                                  remarks: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-2.5 py-1 rounded border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] text-xs focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Bottom Save Bar */}
            <div className="p-4 bg-[#cfe4f6] border-t border-[#9ec5ea] flex items-center justify-between">
              <div className="text-xs text-[#1c446c]">
                <span>Total Enrolled: </span>
                <span className="font-bold text-[#03045e]">{enrolledStudents.length} Students</span>
              </div>

              <div className="flex items-center gap-3">
                {savedSuccess && (
                  <span className="flex items-center gap-1 text-emerald-800 font-semibold text-xs animate-in fade-in">
                    <Check className="w-4 h-4" />
                    <span>Attendance saved successfully!</span>
                  </span>
                )}
                <button
                  onClick={handleSaveStudentAttendance}
                  className="flex items-center gap-1.5 bg-[#03045e] hover:bg-[#02023a] text-white px-5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Batch Register</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Attendance Tab (Admin View) */}
      {activeTab === 'teachers' && (
        <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#b5d5ef]">
            <div>
              <h2 className="text-sm font-bold text-[#03045e]">
                Faculty Daily Check-In Roster
              </h2>
              <p className="text-xs text-[#2c537a]">
                Date: <span className="font-mono font-semibold text-[#03045e]">{selectedDate}</span>
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#c3dcf2]">
            {instructors.map((inst) => {
              const record = teacherAttendance.find(
                (a) => a.instructorId === inst.id && a.date === selectedDate
              );
              const currentStatus = record?.status || 'PRESENT';

              return (
                <div key={inst.id} className="py-3 flex items-center justify-between text-xs gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#cfe4f6] text-[#03045e] font-bold text-xs flex items-center justify-center border border-[#9ec5ea]">
                      {inst.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-[#03045e]">{inst.name}</div>
                      <div className="text-[11px] text-[#385e85]">{inst.department}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {(['PRESENT', 'ABSENT', 'LATE', 'LEAVE'] as AttendanceStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => recordTeacherAttendance(inst.id, selectedDate, st)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all border ${
                          currentStatus === st
                            ? st === 'PRESENT'
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : st === 'ABSENT'
                              ? 'bg-rose-700 text-white border-rose-700'
                              : 'bg-amber-600 text-white border-amber-600'
                            : 'bg-[#cfe4f6] text-[#1c446c] border-[#a6ceee] hover:bg-[#bdddf5]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
