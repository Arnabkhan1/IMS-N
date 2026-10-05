import React from 'react';
import { useIMS } from '../../context/IMSContext';
import { Invoice, Payment } from '../../types/ims';
import {
  CreditCard,
  IndianRupee,
  AlertCircle,
  FileSpreadsheet,
  Plus,
  Bell,
  Printer,
  TrendingUp,
} from 'lucide-react';
import { TabType } from '../layout/Sidebar';

interface AccountantPortalProps {
  onNavigate: (tab: TabType) => void;
  onOpenPaymentModal: (invoice?: Invoice) => void;
  onOpenReceipt: (payment: Payment) => void;
  onOpenReminderModal: (invoice: Invoice) => void;
}

export const AccountantPortal: React.FC<AccountantPortalProps> = ({
  onNavigate,
  onOpenPaymentModal,
  onOpenReceipt,
  onOpenReminderModal,
}) => {
  const { invoices, payments, students, currentUser } = useIMS();

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalDue = Math.max(0, totalInvoiced - totalCollected);

  const pendingInvoices = invoices.filter((i) => i.status !== 'PAID');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#03045e] to-[#0077b6] rounded-xl text-white p-6 shadow-sm border border-[#005f9e]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
              Novum Labs Finance & Billing Workspace · Role: Accountant
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1 text-white">
              Fee Collections & Dues Management (₹)
            </h1>
            <p className="text-xs text-blue-100/90 mt-1 max-w-xl">
              Officer: {currentUser.name}. Record student monthly fees and track collected amounts in Rupees.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPaymentModal()}
              className="flex items-center gap-1.5 bg-[#cde4f7] hover:bg-[#b8daf3] text-[#03045e] px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Record Fee (₹)</span>
            </button>
            <button
              onClick={() => onNavigate('reminders')}
              className="flex items-center gap-1.5 bg-[#0096c7] hover:bg-[#00b4d8] text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Due Reminders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#deedf9] p-4 rounded-xl border border-[#9ec5ea] shadow-xs">
          <div className="text-xs text-[#1c446c] font-medium">Total Fees Collected</div>
          <div className="text-2xl font-bold text-[#03045e] font-mono mt-1">
            ₹{totalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-800 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{payments.length} verified fee entries</span>
          </div>
        </div>

        <div className="bg-[#deedf9] p-4 rounded-xl border border-[#9ec5ea] shadow-xs">
          <div className="text-xs text-[#1c446c] font-medium">Total Invoiced Billing</div>
          <div className="text-2xl font-bold text-[#0077b6] font-mono mt-1">
            ₹{totalInvoiced.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#385e85] mt-1">Across all student enrollments</div>
        </div>

        <div className="bg-[#deedf9] p-4 rounded-xl border border-[#9ec5ea] shadow-xs">
          <div className="text-xs text-[#1c446c] font-medium">Outstanding Student Dues</div>
          <div className="text-2xl font-bold text-amber-900 font-mono mt-1">
            ₹{totalDue.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-800 font-medium mt-1">
            {pendingInvoices.length} invoices pending settlement
          </div>
        </div>
      </div>

      {/* Recent Monthly Collections Summary */}
      <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs p-5 space-y-3">
        <h3 className="font-bold text-sm text-[#03045e]">
          Recent Fee Records (By Month)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {payments.slice(0, 3).map((p) => {
            const st = students.find((s) => s.id === p.studentId);
            return (
              <div key={p.id} className="p-3.5 rounded-lg bg-[#cfe4f6] border border-[#a6ceee] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#03045e]">{st?.name || 'Student'}</span>
                  <span className="text-[10px] font-semibold bg-[#deedf9] text-[#0077b6] px-1.5 py-0.5 rounded">
                    {st?.classGrade || 'Class 10'}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#0077b6]">{p.month || 'Monthly Fee'}</div>
                <div className="text-base font-bold font-mono text-[#03045e]">
                  ₹{p.amount.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#385e85]">{p.paymentDate}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Outstanding Dues Ledger */}
      <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#b5d5ef] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#03045e]">
              Invoices Pending Settlement
            </h3>
            <p className="text-xs text-[#2c537a]">
              Collect payments or dispatch instant reminders
            </p>
          </div>
          <button
            onClick={() => onNavigate('payments')}
            className="text-xs font-semibold text-[#0077b6] hover:text-[#03045e]"
          >
            Open Full Ledger →
          </button>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#cde4f7] text-[#03045e] border-b border-[#9ec5ea] font-semibold">
              <th className="py-2.5 px-4">Invoice No</th>
              <th className="py-2.5 px-4">Student</th>
              <th className="py-2.5 px-4 text-right">Invoice (₹)</th>
              <th className="py-2.5 px-4 text-right">Outstanding (₹)</th>
              <th className="py-2.5 px-4">Due Date</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c3dcf2]">
            {pendingInvoices.slice(0, 5).map((inv) => {
              const s = students.find((st) => st.id === inv.studentId);
              const due = inv.amount - inv.paidAmount;
              const isOverdue = new Date(inv.dueDate) < new Date();

              return (
                <tr key={inv.id} className="hover:bg-[#d4e7f7] transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-[#03045e]">
                    {inv.invoiceNo}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-bold text-[#03045e]">{s?.name}</div>
                    <div className="text-[11px] text-[#385e85]">{s?.studentRoll}</div>
                  </td>
                  <td className="py-2.5 px-4 font-mono tabular-nums text-right text-[#051d38]">
                    ₹{inv.amount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 font-mono tabular-nums text-right font-bold text-amber-900">
                    ₹{due.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[#1c446c]">
                    <span className={isOverdue ? 'text-rose-700 font-bold' : ''}>
                      {inv.dueDate}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => onOpenPaymentModal(inv)}
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold transition-colors"
                    >
                      Collect (₹)
                    </button>
                    <button
                      onClick={() => onOpenReminderModal(inv)}
                      className="p-1 text-[#0077b6] hover:bg-[#cfe4f6] rounded"
                    >
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
