import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import {
  BookOpen,
  CalendarCheck,
  Award,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { TabType } from '../layout/Sidebar';

interface TeacherPortalProps {
  onNavigate: (tab: TabType) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({ onNavigate }) => {
  const {
    currentUser,
    instructors,
    batches,
    enrollments,
    students,
    teacherAttendance,
    studentAttendance,
    exams,
  } = useIMS();

  const instructor = instructors.find((i) => i.id === currentUser.associatedId);
  const myBatches = batches.filter((b) => b.instructorId === currentUser.associatedId);

  // My teacher attendance records
  const myAttendanceRecords = teacherAttendance.filter(
    (a) => a.instructorId === currentUser.associatedId
  );
  const presentDays = myAttendanceRecords.filter((a) => a.status === 'PRESENT').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#03045e] to-[#0077b6] rounded-xl text-white p-6 shadow-sm border border-[#005f9e]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
              Novum Labs Faculty Workspace · Role: Instructor
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1 text-white">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs text-blue-100/90 mt-1 max-w-xl">
              {instructor?.designation} · {instructor?.department}. Manage your active classroom batches, record student attendance, and evaluate practical exams.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center gap-1.5 bg-[#cde4f7] hover:bg-[#b8daf3] text-[#03045e] px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#0077b6]" />
              <span>Take Attendance</span>
            </button>
            <button
              onClick={() => onNavigate('exams')}
              className="flex items-center gap-1.5 bg-[#0096c7] hover:bg-[#00b4d8] text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Grade Marks</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#deedf9] p-4 rounded-xl border border-[#9ec5ea] shadow-xs">
          <div className="text-xs text-[#1c446c] font-medium">Weekly Class Routine</div>
          <div className="text-2xl font-bold text-[#03045e] font-mono mt-1">
            {myBatches.length} Classes
          </div>
          <div className="text-[11px] text-[#385e85] mt-1">Classroom & Lab sessions</div>
        </div>

        <div className="bg-[#deedf9] p-4 rounded-xl border border-[#9ec5ea] shadow-xs">
          <div className="text-xs text-[#1c446c] font-medium">Enrolled Students (My Batches)</div>
          <div className="text-2xl font-bold text-[#0077b6] font-mono mt-1">
            {myBatches.reduce(
              (acc, b) => acc + enrollments.filter((e) => e.batchId === b.id).length,
              0
            )}
          </div>
          <div className="text-[11px] text-[#385e85] mt-1">Active lab learners</div>
        </div>

        <div className="bg-[#deedf9] p-4 rounded-xl border border-[#9ec5ea] shadow-xs">
          <div className="text-xs text-[#1c446c] font-medium">My Faculty Attendance</div>
          <div className="text-2xl font-bold text-emerald-800 font-mono mt-1">
            {presentDays} Days
          </div>
          <div className="text-[11px] text-emerald-800 mt-1">Personal attendance log</div>
        </div>
      </div>

      {/* My Class Routine Grid */}
      <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#b5d5ef]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#0077b6]" />
            <h3 className="font-bold text-sm text-[#03045e]">My Weekly Class Routine & Schedule</h3>
          </div>
          <span className="text-xs text-[#2c537a]">
            Access restricted strictly to your assigned classes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myBatches.map((batch) => {
            const batchStudents = enrollments
              .filter((e) => e.batchId === batch.id)
              .map((e) => students.find((s) => s.id === e.studentId))
              .filter(Boolean);

            return (
              <div
                key={batch.id}
                className="p-4 rounded-xl bg-[#cfe4f6] border border-[#a6ceee] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#0077b6]">
                      {batch.batchCode}
                    </span>
                    <h4 className="font-bold text-sm text-[#03045e]">{batch.name}</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-[#03045e] bg-[#b5d7f3] px-2 py-0.5 rounded">
                    {batchStudents.length} Students
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  {batch.schedules.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between text-[#1c446c] bg-[#deedf9] p-1.5 rounded border border-[#a6ceee]"
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#0077b6]" />
                        <span>
                          {s.dayOfWeek}: {s.startTime} - {s.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#385e85]">
                        <MapPin className="w-3 h-3 text-[#0077b6]" />
                        <span>{s.roomNumber}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#b5d5ef]">
                  <button
                    onClick={() => onNavigate('attendance')}
                    className="px-3 py-1.5 bg-[#0077b6] hover:bg-[#0096c7] text-white rounded text-xs font-semibold transition-colors"
                  >
                    Attendance
                  </button>
                  <button
                    onClick={() => onNavigate('exams')}
                    className="px-3 py-1.5 bg-[#03045e] hover:bg-[#02023a] text-white rounded text-xs font-semibold transition-colors"
                  >
                    Exams & Marks
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
