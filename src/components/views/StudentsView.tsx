import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { Student } from '../../types/ims';
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  RotateCcw,
  UserCheck,
  ChevronRight,
  GraduationCap,
  Calendar,
  X,
  CreditCard,
  Award,
} from 'lucide-react';

interface StudentsViewProps {
  onOpenAddModal: () => void;
  onEditStudent: (student: Student) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  onOpenAddModal,
  onEditStudent,
}) => {
  const {
    students,
    guardians,
    batches,
    enrollments,
    studentAttendance,
    invoices,
    examResults,
    softDeleteStudent,
    restoreStudent,
  } = useIMS();

  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Filter students based on active/archived and search query
  const filteredStudents = students.filter((s) => {
    const isArchived = Boolean(s.deletedAt);
    if (activeTab === 'active' && isArchived) return false;
    if (activeTab === 'archived' && !isArchived) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.studentRoll.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  });

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const selectedGuardian = guardians.find((g) => g.id === selectedStudent?.guardianId);
  const studentEnrollments = enrollments.filter((e) => e.studentId === selectedStudentId);
  const studentAttendanceRecords = studentAttendance.filter((a) => a.studentId === selectedStudentId);
  const studentInvoices = invoices.filter((i) => i.studentId === selectedStudentId);
  const studentResults = examResults.filter((r) => r.studentId === selectedStudentId);

  const presentCount = studentAttendanceRecords.filter(
    (a) => a.status === 'PRESENT' || a.status === 'LATE'
  ).length;
  const attendanceRate = studentAttendanceRecords.length > 0
    ? Math.round((presentCount / studentAttendanceRecords.length) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#03045e] tracking-tight">
            Novum Labs Student Admissions & Directory
          </h1>
          <p className="text-xs text-[#284f76]">
            Full lifecycle student records, guardian contacts, soft-delete management, and academic histories
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 bg-[#03045e] hover:bg-[#02023a] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Control Bar: Tabs + Search */}
      <div className="bg-[#deedf9] p-3 rounded-xl border border-[#9ec5ea] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Active vs Archived segmented button */}
        <div className="flex items-center gap-1 bg-[#cfe4f6] p-1 rounded-lg border border-[#a6ceee]">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'active'
                ? 'bg-[#03045e] text-white shadow-xs'
                : 'text-[#1c446c] hover:text-[#03045e]'
            }`}
          >
            Active Students ({students.filter((s) => !s.deletedAt).length})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'archived'
                ? 'bg-[#03045e] text-white shadow-xs'
                : 'text-[#1c446c] hover:text-[#03045e]'
            }`}
          >
            Archived / Soft-Deleted ({students.filter((s) => s.deletedAt).length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#4a75a0] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, roll no, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] placeholder-[#6087b0] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
          />
        </div>
      </div>

      {/* Main Content: Table on Desktop, Cards on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Student Table / Cards (Takes 2 cols if student selected, 3 cols if none) */}
        <div className={`space-y-3 ${selectedStudent ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {/* Desktop Table */}
          <div className="hidden md:block bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#cde4f7] text-[#03045e] border-b border-[#9ec5ea] font-semibold">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Contact & Email</th>
                  <th className="py-3 px-4">Admission</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3dcf2]">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#4a75a0]">
                      No students found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const isSelected = s.id === selectedStudentId;
                    return (
                      <tr
                        key={s.id}
                        className={`hover:bg-[#d4e7f7] transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#c6def4] font-medium' : ''
                        }`}
                        onClick={() => setSelectedStudentId(s.id)}
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#03045e]">{s.name}</div>
                          <div className="text-[11px] text-[#385e85]">
                            {s.gender || 'Student'}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#051d38]">
                          {s.studentRoll}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-[#cfe4f6] text-[#03045e] border border-[#a6ceee]">
                            {s.classGrade || 'Class 10'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-[#051d38]">{s.phone}</div>
                          <div className="text-[11px] text-[#385e85]">{s.email}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[#1c446c]">
                          {s.admissionDate}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                              s.status === 'ACTIVE'
                                ? 'bg-[#c8e8d8] text-emerald-900 border border-emerald-300'
                                : s.status === 'PASSED'
                                ? 'bg-[#cfe4f6] text-[#0077b6] border border-[#9ec5ea]'
                                : 'bg-[#e0eefa] text-[#385e85] border border-[#a6ceee]'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onEditStudent(s)}
                            title="Edit Student"
                            className="p-1.5 text-[#1c446c] hover:text-[#0077b6] hover:bg-[#cfe4f6] rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {s.deletedAt ? (
                            <button
                              onClick={() => restoreStudent(s.id)}
                              title="Restore Student"
                              className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-[#c8e8d8] rounded"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Soft-delete student "${s.name}"? Historical invoices and attendance records will remain preserved.`
                                  )
                                ) {
                                  softDeleteStudent(s.id);
                                }
                              }}
                              title="Soft Delete"
                              className="p-1.5 text-rose-700 hover:text-rose-900 hover:bg-rose-100 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredStudents.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedStudentId(s.id)}
                className="bg-[#deedf9] p-4 rounded-xl border border-[#9ec5ea] shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#03045e]">{s.name}</div>
                    <span className="text-[10px] text-[#0077b6] font-semibold">{s.classGrade || 'Class 10'}</span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-[#1c446c]">
                    {s.studentRoll}
                  </span>
                </div>
                <div className="text-[#385e85]">
                  {s.phone} · {s.email}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#b5d5ef]">
                  <span className="font-semibold text-emerald-800">{s.status}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditStudent(s);
                      }}
                      className="p-1 text-[#1c446c]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {s.deletedAt ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          restoreStudent(s.id);
                        }}
                        className="p-1 text-emerald-700"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          softDeleteStudent(s.id);
                        }}
                        className="p-1 text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student 360 Profile Panel (Right Col) */}
        {selectedStudent && (
          <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs p-5 space-y-5 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#b5d5ef]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#0077b6]" />
                <h3 className="font-bold text-sm text-[#03045e]">Student 360 Dossier</h3>
              </div>
              <button
                onClick={() => setSelectedStudentId(null)}
                className="text-[#4a75a0] hover:text-[#03045e]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="bg-[#cfe4f6] p-3.5 rounded-lg border border-[#a6ceee] space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-[#03045e]">{selectedStudent.name}</div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#03045e] text-white">
                  {selectedStudent.classGrade || 'Class 10'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[#1c446c]">
                <div>
                  <span className="text-[#4a75a0] block text-[10px]">Roll Number:</span>
                  <span className="font-mono font-semibold text-[#03045e]">
                    {selectedStudent.studentRoll}
                  </span>
                </div>
                <div>
                  <span className="text-[#4a75a0] block text-[10px]">Status:</span>
                  <span className="font-semibold text-emerald-800">{selectedStudent.status}</span>
                </div>
                <div>
                  <span className="text-[#4a75a0] block text-[10px]">Phone:</span>
                  <span>{selectedStudent.phone}</span>
                </div>
                <div>
                  <span className="text-[#4a75a0] block text-[10px]">Admitted:</span>
                  <span>{selectedStudent.admissionDate}</span>
                </div>
              </div>
              {selectedStudent.address && (
                <div className="text-[11px] text-[#385e85] border-t border-[#b5d5ef] pt-1">
                  Address: {selectedStudent.address}
                </div>
              )}
            </div>

            {/* Guardian Info */}
            <div>
              <div className="font-bold text-[#03045e] mb-2 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#0077b6]" />
                <span>Guardian Information</span>
              </div>
              {selectedGuardian ? (
                <div className="p-3 bg-[#cfe4f6] rounded-lg border border-[#a6ceee] space-y-1 text-[#1c446c]">
                  <div className="font-semibold text-[#03045e]">
                    {selectedGuardian.name} ({selectedGuardian.relationship})
                  </div>
                  <div>Phone: {selectedGuardian.phone}</div>
                  {selectedGuardian.occupation && (
                    <div>Occupation: {selectedGuardian.occupation}</div>
                  )}
                </div>
              ) : (
                <div className="text-[#4a75a0] italic">No guardian linked.</div>
              )}
            </div>

            {/* Enrolled Batches */}
            <div>
              <div className="font-bold text-[#03045e] mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0077b6]" />
                <span>Enrolled Academic Batches</span>
              </div>
              <div className="space-y-1.5">
                {studentEnrollments.length === 0 ? (
                  <div className="text-[#4a75a0] italic">No active enrollments.</div>
                ) : (
                  studentEnrollments.map((enr) => {
                    const b = batches.find((bt) => bt.id === enr.batchId);
                    return (
                      <div
                        key={enr.id}
                        className="p-2.5 rounded-lg bg-[#cfe4f6] border border-[#a6ceee] flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-[#03045e]">{b?.name}</div>
                          <div className="text-[11px] text-[#385e85]">{b?.batchCode}</div>
                        </div>
                        <span className="font-mono tabular-nums text-[#03045e] font-semibold">
                          ₹{enr.finalFee.toLocaleString()}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Attendance & Performance Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#b5d5ef]">
              <div className="p-3 bg-[#cfe4f6] rounded-lg text-center border border-[#a6ceee]">
                <div className="text-[10px] text-[#2c537a] font-semibold uppercase">
                  Attendance Rate
                </div>
                <div className="text-xl font-bold font-mono text-[#03045e] mt-1">
                  {attendanceRate}%
                </div>
                <div className="text-[10px] text-[#385e85]">
                  {presentCount}/{studentAttendanceRecords.length} sessions
                </div>
              </div>

              <div className="p-3 bg-[#c8e8d8] rounded-lg text-center border border-emerald-300">
                <div className="text-[10px] text-emerald-900 font-semibold uppercase">
                  Exam Records
                </div>
                <div className="text-xl font-bold font-mono text-emerald-900 mt-1">
                  {studentResults.length}
                </div>
                <div className="text-[10px] text-emerald-800">
                  Avg Grade: {studentResults[0]?.grade || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
