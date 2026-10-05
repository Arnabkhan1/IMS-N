import React from 'react';
import { useIMS } from '../../context/IMSContext';
import {
  Users,
  GraduationCap,
  BookOpen,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
  CalendarCheck,
  Calendar,
  TrendingUp,
  ArrowRight,
  Bell,
  CreditCard,
  UserPlus,
  Plus,
} from 'lucide-react';
import { TabType } from '../layout/Sidebar';

interface AdminDashboardProps {
  onNavigate: (tab: TabType) => void;
  onOpenStudentModal: () => void;
  onOpenPaymentModal: () => void;
  onOpenBatchModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenStudentModal,
  onOpenPaymentModal,
  onOpenBatchModal,
}) => {
  const {
    students,
    instructors,
    batches,
    classRoutines,
    invoices,
    payments,
    studentAttendance,
  } = useIMS();

  // Active students (excluding soft-deleted)
  const activeStudents = students.filter((s) => !s.deletedAt);
  const softDeletedCount = students.filter((s) => s.deletedAt).length;

  // Financial aggregates in Rupees (₹)
  const totalRevenueCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalOutstandingDue = Math.max(0, totalInvoiced - totalRevenueCollected);
  const overdueInvoices = invoices.filter(
    (inv) => inv.status !== 'PAID' && new Date(inv.dueDate) < new Date()
  );

  // Student Fee Status calculation
  const studentsFeeStatus = activeStudents.slice(0, 5).map((s) => {
    const studentPayments = payments.filter((p) => p.studentId === s.id);
    const lastPayment = studentPayments[0];
    const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
    const studentInvoices = invoices.filter((inv) => inv.studentId === s.id);
    const hasPendingDue = studentInvoices.some((inv) => inv.status !== 'PAID');
    const isPaid = !hasPendingDue && totalPaid > 0;
    const latestMonth = lastPayment?.month || 'October 2026';

    return {
      student: s,
      latestMonth,
      totalPaid,
      lastPaymentAmount: lastPayment?.amount || 0,
      isPaid,
    };
  });

  // Today's attendance percentage
  const totalAttendanceRecords = studentAttendance.length;
  const presentRecords = studentAttendance.filter(
    (a) => a.status === 'PRESENT' || a.status === 'LATE'
  ).length;
  const attendanceRate = totalAttendanceRecords > 0
    ? Math.round((presentRecords / totalAttendanceRecords) * 100)
    : 92;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-[#03045e] to-[#0077b6] rounded-xl text-white p-6 shadow-sm border border-[#005f9e]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
              Novum Labs Control Room
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1 text-white">
              Institutional Operations & Analytics
            </h1>
            <p className="text-xs text-blue-100/90 mt-1 max-w-xl">
              Real-time monitoring across 6 core modules: Admissions, Academic Batches, Multi-role Attendance, Fee Ledgers in Rupees (₹), Roadmap Progress, and Due Reminders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenStudentModal}
              className="flex items-center gap-1.5 bg-[#cde4f7] hover:bg-[#b8daf3] text-[#03045e] px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll Student</span>
            </button>
            <button
              onClick={onOpenPaymentModal}
              className="flex items-center gap-1.5 bg-[#0096c7] hover:bg-[#00b4d8] text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Record Fee (₹)</span>
            </button>
            <button
              onClick={onOpenBatchModal}
              className="flex items-center gap-1.5 bg-[#03045e]/70 hover:bg-[#03045e] border border-blue-400/40 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>+ Add Routine Slot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row (Light Blue Non-white Surfaces) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Students */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-[#deedf9] p-4 rounded-xl border border-[#9ec5ea] shadow-xs hover:border-[#0077b6] hover:bg-[#d6e9f7] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#1c446c] font-medium">
            <span>Enrolled Students</span>
            <div className="w-8 h-8 rounded-lg bg-[#cfe4f6] text-[#0077b6] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#9ec5ea]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#03045e] font-mono tabular-nums mt-2">
            {activeStudents.length}
          </div>
          <div className="text-[11px] text-[#2c537a] mt-1 flex items-center gap-1">
            <span className="text-emerald-700 font-semibold">Active</span>
            <span>·</span>
            <span>{softDeletedCount} archived / soft-deleted</span>
          </div>
        </div>

        {/* Metric 2: Weekly Class Routine */}
        <div
          onClick={() => onNavigate('batches')}
          className="bg-[#deedf9] p-4 rounded-xl border border-[#9ec5ea] shadow-xs hover:border-[#0077b6] hover:bg-[#d6e9f7] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#1c446c] font-medium">
            <span>Weekly Class Routine</span>
            <div className="w-8 h-8 rounded-lg bg-[#cfe4f6] text-[#0077b6] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#9ec5ea]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#03045e] font-mono tabular-nums mt-2">
            {classRoutines.length} Periods
          </div>
          <div className="text-[11px] text-[#2c537a] mt-1 flex items-center gap-1">
            <span>{instructors.length} Faculty Members</span>
            <span>·</span>
            <span>Mon to Sat Schedule</span>
          </div>
        </div>

        {/* Metric 3: Fee Collections in Rupees */}
        <div
          onClick={() => onNavigate('payments')}
          className="bg-[#deedf9] p-4 rounded-xl border border-[#9ec5ea] shadow-xs hover:border-[#0077b6] hover:bg-[#d6e9f7] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#1c446c] font-medium">
            <span>Collected Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#c8e8d8] text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform border border-emerald-300">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#03045e] font-mono tabular-nums mt-2">
            ₹{totalRevenueCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{payments.length} verified vouchers</span>
          </div>
        </div>

        {/* Metric 4: Outstanding Dues in Rupees */}
        <div
          onClick={() => onNavigate('reminders')}
          className="bg-[#deedf9] p-4 rounded-xl border border-[#9ec5ea] shadow-xs hover:border-amber-400 hover:bg-[#d6e9f7] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#1c446c] font-medium">
            <span>Pending Dues</span>
            <div className="w-8 h-8 rounded-lg bg-[#faeed8] text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform border border-amber-300">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-900 font-mono tabular-nums mt-2">
            ₹{totalOutstandingDue.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-800 font-medium mt-1 flex items-center gap-1">
            <span>{overdueInvoices.length} invoices overdue</span>
            <span>·</span>
            <span className="underline">Scan reminders</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Overdue Invoices Alert & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Student Fee Status (Replaced Outstanding Invoices & Reminder Scanner) */}
        <div className="lg:col-span-2 bg-[#deedf9] rounded-xl border border-[#9ec5ea] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#b5d5ef] gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#0077b6] flex items-center justify-center text-white">
                    <IndianRupee className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-sm font-bold text-[#03045e]">
                    Student Fee Status
                  </h2>
                </div>
                <p className="text-xs text-[#2c537a] mt-0.5">
                  Monthly fee collection overview, settled records, and current pending status
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={onOpenPaymentModal}
                  className="flex items-center gap-1 text-xs font-semibold bg-[#03045e] hover:bg-[#02023a] text-white px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Fee</span>
                </button>
                <button
                  onClick={() => onNavigate('payments')}
                  className="text-xs text-[#0077b6] hover:text-[#03045e] font-semibold flex items-center gap-1"
                >
                  <span>Full Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Fee Status Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#cde4f7] text-[#03045e] border-b border-[#9ec5ea] font-semibold">
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3">Fee Month</th>
                    <th className="py-2.5 px-3 text-right">Fee (₹)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3dcf2]">
                  {studentsFeeStatus.map(({ student, latestMonth, totalPaid, lastPaymentAmount, isPaid }) => (
                    <tr key={student.id} className="hover:bg-[#d4e7f7] transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#03045e]">{student.name}</div>
                        <div className="font-mono text-[10px] text-[#385e85]">{student.studentRoll}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#cfe4f6] text-[#03045e] border border-[#a6ceee]">
                          {student.classGrade || 'Class 10'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#0077b6]">
                        {latestMonth}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#03045e] tabular-nums text-right">
                        ₹{(lastPaymentAmount || totalPaid || 2000).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            isPaid
                              ? 'bg-[#c8e8d8] text-emerald-900 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {isPaid ? 'Fee Paid' : 'Fee Due'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={onOpenPaymentModal}
                          className="px-2.5 py-1 bg-[#0077b6] hover:bg-[#0096c7] text-white rounded text-[10px] font-semibold transition-colors"
                        >
                          Collect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#b5d5ef] flex items-center justify-between bg-[#cfe4f6] p-3 rounded-lg border border-[#a4c9eb]">
            <div className="text-xs text-[#1c446c] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Real-time fee tracking by student, month, and amount</span>
            </div>
            <button
              onClick={() => onNavigate('payments')}
              className="text-xs font-semibold text-[#0077b6] hover:text-[#03045e]"
            >
              View Full Fee Register →
            </button>
          </div>
        </div>

        {/* Right 1 Col: Quick System Health & Attendance Rate */}
        <div className="space-y-4">
          <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#03045e] mb-1">
              Attendance Efficiency
            </h3>
            <p className="text-xs text-[#2c537a] mb-4">
              Aggregate student presence rate across all active lab batches
            </p>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full border-4 border-[#0077b6]/30 bg-[#cfe4f6] flex items-center justify-center font-bold text-lg text-[#03045e] font-mono">
                {attendanceRate}%
              </div>
              <div className="space-y-1 text-xs text-[#1c446c]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>On-time attendance stable</span>
                </div>
                <div className="text-[11px] text-[#385e85]">
                  {presentRecords} marked present / late
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('attendance')}
              className="w-full mt-4 py-2 text-xs font-semibold text-[#03045e] bg-[#cfe4f6] hover:bg-[#bdddf5] border border-[#9ec5ea] rounded-lg transition-colors text-center block"
            >
              Open Attendance Hub →
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] p-5 shadow-xs space-y-2 text-xs">
            <div className="font-bold text-[#03045e] mb-2">Operational Shortcuts</div>
            <button
              onClick={() => onNavigate('roadmaps')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#cfe4f6] text-[#03045e] transition-colors border border-transparent hover:border-[#9ec5ea]"
            >
              <span>Track Course Roadmaps</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0077b6]" />
            </button>
            <button
              onClick={() => onNavigate('exams')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#cfe4f6] text-[#03045e] transition-colors border border-transparent hover:border-[#9ec5ea]"
            >
              <span>Enter Exam Marks</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0077b6]" />
            </button>
            <button
              onClick={() => onNavigate('teachers')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#cfe4f6] text-[#03045e] transition-colors border border-transparent hover:border-[#9ec5ea]"
            >
              <span>Faculty Workload & Roster</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0077b6]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
