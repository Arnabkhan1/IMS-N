import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { Payment } from '../../types/ims';
import {
  CalendarDays,
  CalendarCheck,
  CreditCard,
  Award,
  Milestone,
  Printer,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface StudentPortalProps {
  onOpenReceipt: (payment: Payment) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ onOpenReceipt }) => {
  const {
    currentUser,
    students,
    enrollments,
    batches,
    courses,
    instructors,
    studentAttendance,
    invoices,
    payments,
    exams,
    examResults,
    roadmaps,
    studentTopicProgress,
  } = useIMS();

  const student = students.find((s) => s.id === currentUser.associatedId);
  const myEnrollments = enrollments.filter((e) => e.studentId === currentUser.associatedId);
  const myBatches = batches.filter((b) =>
    myEnrollments.some((e) => e.batchId === b.id)
  );

  // Derive weekly routine from enrolled batches
  const routineSlots = myBatches.flatMap((b) => {
    const course = courses.find((c) => c.id === b.courseId);
    const teacher = instructors.find((i) => i.id === b.instructorId);
    return b.schedules.map((s) => ({
      ...s,
      batchName: b.name,
      courseTitle: course?.title,
      teacherName: teacher?.name,
    }));
  });

  // Attendance metrics
  const myAttendance = studentAttendance.filter((a) => a.studentId === currentUser.associatedId);
  const presentCount = myAttendance.filter(
    (a) => a.status === 'PRESENT' || a.status === 'LATE'
  ).length;
  const attendanceRate =
    myAttendance.length > 0 ? Math.round((presentCount / myAttendance.length) * 100) : 100;

  // Invoices & payments
  const myInvoices = invoices.filter((i) => i.studentId === currentUser.associatedId);
  const myPayments = payments.filter((p) => p.studentId === currentUser.associatedId);

  // Exam results
  const myResults = examResults.filter((r) => r.studentId === currentUser.associatedId);

  // Active tab in student portal
  const [activeTab, setActiveTab] = useState<
    'routine' | 'attendance' | 'invoices' | 'results' | 'roadmap'
  >('routine');

  // Active roadmap for student
  const activeBatch = myBatches[0];
  const targetRoadmap = roadmaps.find((r) => r.courseId === activeBatch?.courseId) || roadmaps[0];
  const topics = targetRoadmap?.topics || [];
  const completedTopics = topics.filter((t) => {
    const p = studentTopicProgress.find(
      (stp) => stp.studentId === currentUser.associatedId && stp.topicId === t.id
    );
    return Boolean(p?.isCompleted);
  }).length;
  const roadmapPct = topics.length > 0 ? Math.round((completedTopics / topics.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Student Profile Card */}
      <div className="bg-gradient-to-r from-[#03045e] to-[#0077b6] rounded-xl text-white p-6 shadow-sm border border-[#005f9e]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
              Novum Labs Student Academic Portal
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {student?.name || currentUser.name}
            </h1>
            <div className="text-xs text-blue-100 flex flex-wrap items-center gap-3 pt-1">
              <span>
                Roll: <strong className="font-mono text-white">{student?.studentRoll}</strong>
              </span>
              <span>·</span>
              <span>
                Program:{' '}
                <strong className="text-white">
                  {myBatches.map((b) => b.name).join(', ') || 'Enrolled Student'}
                </strong>
              </span>
              <span>·</span>
              <span className="bg-[#cfe4f6] text-[#03045e] text-[10px] font-bold px-2 py-0.5 rounded">
                {student?.status || 'ACTIVE'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div className="bg-[#03045e]/50 border border-blue-400/30 p-3 rounded-lg min-w-24">
              <div className="text-[10px] text-blue-200 uppercase font-semibold">Attendance</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{attendanceRate}%</div>
            </div>
            <div className="bg-[#03045e]/50 border border-blue-400/30 p-3 rounded-lg min-w-24">
              <div className="text-[10px] text-blue-200 uppercase font-semibold">Roadmap</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{roadmapPct}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-[#cfe4f6] p-1 rounded-lg border border-[#a6ceee]">
        <button
          onClick={() => setActiveTab('routine')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
            activeTab === 'routine'
              ? 'bg-[#03045e] text-white shadow-xs'
              : 'text-[#1c446c] hover:text-[#03045e]'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>My Class Routine</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'bg-[#03045e] text-white shadow-xs'
              : 'text-[#1c446c] hover:text-[#03045e]'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>My Attendance ({myAttendance.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
            activeTab === 'invoices'
              ? 'bg-[#03045e] text-white shadow-xs'
              : 'text-[#1c446c] hover:text-[#03045e]'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Invoices & Fee Dues (₹)</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
            activeTab === 'results'
              ? 'bg-[#03045e] text-white shadow-xs'
              : 'text-[#1c446c] hover:text-[#03045e]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Exam Results</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
            activeTab === 'roadmap'
              ? 'bg-[#03045e] text-white shadow-xs'
              : 'text-[#1c446c] hover:text-[#03045e]'
          }`}
        >
          <Milestone className="w-3.5 h-3.5" />
          <span>Learning Roadmap</span>
        </button>
      </div>

      {/* Tab 1: Class Routine (Timetable) */}
      {activeTab === 'routine' && (
        <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#b5d5ef] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#03045e]">
                Weekly Class Routine & Laboratory Timetable
              </h2>
              <p className="text-xs text-[#2c537a]">
                Generated automatically from your active batch enrollments
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 text-xs text-[#0077b6] hover:text-[#03045e] font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Routine</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {routineSlots.map((slot, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-[#cfe4f6] border border-[#a6ceee] space-y-2 hover:border-[#0077b6] transition-all text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[#03045e] bg-[#deedf9] px-2 py-0.5 rounded border border-[#9ec5ea]">
                    {slot.dayOfWeek}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[#1c446c] font-medium">
                    <Clock className="w-3 h-3 text-[#0077b6]" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <div className="font-bold text-[#03045e] text-sm">{slot.batchName}</div>
                  <div className="text-[#385e85] text-[11px] truncate">{slot.courseTitle}</div>
                </div>

                <div className="pt-2 border-t border-[#b5d5ef] flex items-center justify-between text-[11px] text-[#1c446c]">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0077b6]" />
                    <span>{slot.roomNumber}</span>
                  </div>
                  <span>{slot.teacherName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Attendance Records */}
      {activeTab === 'attendance' && (
        <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs p-6 space-y-4">
          <div className="border-b border-[#b5d5ef] pb-3">
            <h2 className="text-sm font-bold text-[#03045e]">
              My Classroom Attendance Record
            </h2>
            <p className="text-xs text-[#2c537a]">
              Presence verified by faculty instructor for all sessions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#cde4f7] text-[#03045e] border-b border-[#9ec5ea] font-semibold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Academic Batch</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3">Instructor Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3dcf2]">
                {myAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[#4a75a0]">
                      No attendance sessions recorded yet.
                    </td>
                  </tr>
                ) : (
                  myAttendance.map((rec) => {
                    const batch = batches.find((b) => b.id === rec.batchId);
                    return (
                      <tr key={rec.id} className="hover:bg-[#d4e7f7]">
                        <td className="py-2.5 px-3 font-mono text-[#051d38]">{rec.date}</td>
                        <td className="py-2.5 px-3 font-medium text-[#03045e]">{batch?.name}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              rec.status === 'PRESENT'
                                ? 'bg-[#c8e8d8] text-emerald-900 border border-emerald-300'
                                : rec.status === 'LATE'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[#385e85]">{rec.remarks || '—'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Invoices & Fees (Rupees ₹) */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs p-6 space-y-4">
            <div className="border-b border-[#b5d5ef] pb-3">
              <h2 className="text-sm font-bold text-[#03045e]">
                Invoices & Payment Dues in Rupees (₹)
              </h2>
              <p className="text-xs text-[#2c537a]">
                View tuition installments, payment deadlines, and settled receipts
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#cde4f7] text-[#03045e] border-b border-[#9ec5ea] font-semibold">
                    <th className="py-2.5 px-3">Invoice No</th>
                    <th className="py-2.5 px-3">Purpose</th>
                    <th className="py-2.5 px-3 text-right">Total (₹)</th>
                    <th className="py-2.5 px-3 text-right">Paid (₹)</th>
                    <th className="py-2.5 px-3 text-right">Due (₹)</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3dcf2]">
                  {myInvoices.map((inv) => {
                    const due = inv.amount - inv.paidAmount;
                    const isOverdue = inv.status !== 'PAID' && new Date(inv.dueDate) < new Date();

                    return (
                      <tr key={inv.id} className="hover:bg-[#d4e7f7]">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#03045e]">
                          {inv.invoiceNo}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-[#03045e]">{inv.title}</td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-right text-[#051d38]">
                          ₹{inv.amount.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-right text-emerald-800 font-semibold">
                          ₹{inv.paidAmount.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-right font-bold text-amber-900">
                          ₹{due.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[#1c446c]">
                          <span className={isOverdue ? 'text-rose-700 font-bold' : ''}>
                            {inv.dueDate}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              inv.status === 'PAID'
                                ? 'bg-[#c8e8d8] text-emerald-900 border border-emerald-300'
                                : inv.status === 'PARTIAL'
                                ? 'bg-[#cfe4f6] text-[#0077b6] border border-[#9ec5ea]'
                                : isOverdue
                                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Receipts History */}
          <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs p-6 space-y-4">
            <div className="border-b border-[#b5d5ef] pb-3">
              <h3 className="font-bold text-sm text-[#03045e]">Fee Payment History</h3>
              <p className="text-xs text-[#2c537a]">
                Summary of monthly fees settled for your academic batches
              </p>
            </div>

            <div className="space-y-2">
              {myPayments.length === 0 ? (
                <div className="text-xs text-[#4a75a0] italic">No fee records found yet.</div>
              ) : (
                myPayments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-lg bg-[#cfe4f6] border border-[#a6ceee] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#03045e]">{p.month || 'Monthly Fee'}</div>
                      <div className="text-[11px] text-[#385e85]">
                        Date Recorded: {p.paymentDate}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#03045e]">
                        ₹{p.amount.toLocaleString()}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#c8e8d8] text-emerald-900 border border-emerald-300">
                        Paid
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Exam Results */}
      {activeTab === 'results' && (
        <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs p-6 space-y-4">
          <div className="border-b border-[#b5d5ef] pb-3">
            <h2 className="text-sm font-bold text-[#03045e]">
              Examination Scores & Performance Evaluations
            </h2>
            <p className="text-xs text-[#2c537a]">
              Grades and instructor evaluation feedback
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#cde4f7] text-[#03045e] border-b border-[#9ec5ea] font-semibold">
                  <th className="py-2.5 px-3">Exam Title</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3dcf2]">
                {myResults.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-[#4a75a0]">
                      No graded exam results recorded yet.
                    </td>
                  </tr>
                ) : (
                  myResults.map((res) => {
                    const exam = exams.find((e) => e.id === res.examId);
                    return (
                      <tr key={res.id} className="hover:bg-[#d4e7f7]">
                        <td className="py-2.5 px-3 font-medium text-[#03045e]">
                          {exam?.title || 'Examination'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[#1c446c]">
                          {exam?.examDate || '—'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-center text-[#03045e]">
                          {res.marksObtained} / {exam?.totalMarks}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#c8e8d8] text-emerald-900 border border-emerald-300">
                            {res.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[#385e85]">{res.feedback || '—'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs p-6 space-y-4">
          <div className="border-b border-[#b5d5ef] pb-3">
            <h2 className="text-sm font-bold text-[#03045e]">
              {targetRoadmap?.title || 'Academic Roadmap'}
            </h2>
            <p className="text-xs text-[#2c537a]">
              Interactive progress tracking for enrolled curriculum modules
            </p>
          </div>

          <div className="space-y-3">
            {topics.map((t) => {
              const isCompleted = studentTopicProgress.some(
                (stp) =>
                  stp.studentId === currentUser.associatedId &&
                  stp.topicId === t.id &&
                  stp.isCompleted
              );

              return (
                <div
                  key={t.id}
                  className={`p-3.5 rounded-lg border text-xs flex items-center justify-between ${
                    isCompleted
                      ? 'bg-[#c8e8d8] border-emerald-300'
                      : 'bg-[#cfe4f6] border-[#a6ceee]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isCompleted ? 'text-emerald-800' : 'text-[#4a75a0]'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#03045e]">Week {t.weekNumber}:</span>
                        <span
                          className={`font-semibold ${
                            isCompleted ? 'line-through text-emerald-950' : 'text-[#03045e]'
                          }`}
                        >
                          {t.title}
                        </span>
                      </div>
                      {t.description && (
                        <p className="text-[11px] text-[#2c537a] mt-0.5">{t.description}</p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                      isCompleted ? 'bg-emerald-200 text-emerald-950' : 'bg-[#b5d7f3] text-[#1c446c]'
                    }`}
                  >
                    {isCompleted ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
