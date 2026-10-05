import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { Invoice, Payment } from '../../types/ims';
import {
  IndianRupee,
  Printer,
  Bell,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Plus,
} from 'lucide-react';

interface PaymentsViewProps {
  onOpenPaymentModal: (invoice?: Invoice) => void;
  onOpenReceipt: (payment: Payment) => void;
  onOpenReminderModal: (invoice: Invoice) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  onOpenPaymentModal,
  onOpenReceipt,
  onOpenReminderModal,
}) => {
  const { invoices, payments, students, batches, currentUser } = useIMS();

  const [activeTab, setActiveTab] = useState<'invoices' | 'ledger'>('invoices');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'DUE' | 'PARTIAL' | 'PAID'>('ALL');

  const filteredInvoices = invoices.filter((inv) => {
    if (filterStatus === 'ALL') return true;
    return inv.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#03045e] tracking-tight">
            Novum Labs Accounts & Fee Register (₹)
          </h1>
          <p className="text-xs text-[#284f76]">
            Record and manage student monthly fee collections in Rupees (₹)
          </p>
        </div>

        {(currentUser.role === 'ADMIN' || currentUser.role === 'ACCOUNTANT') && (
          <button
            onClick={() => onOpenPaymentModal()}
            className="flex items-center gap-1.5 bg-[#03045e] hover:bg-[#02023a] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Record Fee (₹)</span>
          </button>
        )}
      </div>

      {/* Tabs & Filters */}
      <div className="bg-[#deedf9] p-3 rounded-xl border border-[#9ec5ea] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#cfe4f6] p-1 rounded-lg border border-[#a6ceee]">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'invoices'
                ? 'bg-[#03045e] text-white shadow-xs'
                : 'text-[#1c446c] hover:text-[#03045e]'
            }`}
          >
            Invoices & Dues ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'ledger'
                ? 'bg-[#03045e] text-white shadow-xs'
                : 'text-[#1c446c] hover:text-[#03045e]'
            }`}
          >
            Fee Records ({payments.length})
          </button>
        </div>

        {activeTab === 'invoices' && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#1c446c] mr-1 font-medium">Status:</span>
            {(['ALL', 'DUE', 'PARTIAL', 'PAID'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  filterStatus === st
                    ? 'bg-[#03045e] text-white'
                    : 'bg-[#cfe4f6] text-[#1c446c] hover:bg-[#bdddf5] border border-[#a6ceee]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab 1: Invoices Table */}
      {activeTab === 'invoices' && (
        <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#cde4f7] text-[#03045e] border-b border-[#9ec5ea] font-semibold">
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-right">Paid (₹)</th>
                <th className="py-3 px-4 text-right">Due (₹)</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3dcf2]">
              {filteredInvoices.map((inv) => {
                const student = students.find((s) => s.id === inv.studentId);
                const batch = batches.find((b) => b.id === inv.batchId);
                const dueAmount = inv.amount - inv.paidAmount;
                const isOverdue = inv.status !== 'PAID' && new Date(inv.dueDate) < new Date();

                return (
                  <tr key={inv.id} className="hover:bg-[#d4e7f7] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#03045e]">
                      {inv.invoiceNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#03045e]">{student?.name}</div>
                      <div className="font-mono text-[11px] text-[#385e85]">
                        {student?.studentRoll}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[#051d38] font-medium truncate max-w-xs">
                        {inv.title}
                      </div>
                      <div className="text-[11px] text-[#385e85]">{batch?.name}</div>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-right font-semibold text-[#051d38]">
                      ₹{inv.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-right text-emerald-800 font-semibold">
                      ₹{inv.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-right font-bold text-amber-900">
                      ₹{dueAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#1c446c]">
                      <span className={isOverdue ? 'text-rose-700 font-bold' : ''}>
                        {inv.dueDate}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.status === 'PAID'
                            ? 'bg-[#c8e8d8] text-emerald-900 border border-emerald-300'
                            : inv.status === 'PARTIAL'
                            ? 'bg-[#cfe4f6] text-[#0077b6] border border-[#9ec5ea]'
                            : isOverdue
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {isOverdue && inv.status === 'DUE' ? 'OVERDUE' : inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {inv.status !== 'PAID' &&
                        (currentUser.role === 'ADMIN' || currentUser.role === 'ACCOUNTANT') && (
                          <>
                            <button
                              onClick={() => onOpenPaymentModal(inv)}
                              title="Collect Payment in Rupees"
                              className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold transition-colors"
                            >
                              Collect
                            </button>
                            <button
                              onClick={() => onOpenReminderModal(inv)}
                              title="Send Due Reminder"
                              className="p-1 text-[#0077b6] hover:bg-[#cfe4f6] rounded"
                            >
                              <Bell className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Payments / Fee Records */}
      {activeTab === 'ledger' && (
        <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#cde4f7] text-[#03045e] border-b border-[#9ec5ea] font-semibold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Fee Month</th>
                <th className="py-3 px-4 text-right">Fee Paid (₹)</th>
                <th className="py-3 px-4">Date Recorded</th>
                <th className="py-3 px-4 text-right">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3dcf2]">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#4a75a0]">
                    No fee records yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const s = students.find((st) => st.id === p.studentId);
                  return (
                    <tr key={p.id} className="hover:bg-[#d4e7f7] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#03045e]">{s?.name || 'Student'}</div>
                        <div className="font-mono text-[11px] text-[#385e85]">
                          {s?.studentRoll}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-[#cfe4f6] text-[#03045e] border border-[#a6ceee]">
                          {s?.classGrade || 'Class 10'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#0077b6]">
                        {p.month || 'Monthly Fee'}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right font-bold text-[#03045e] text-sm">
                        ₹{p.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#1c446c]">{p.paymentDate}</td>
                      <td className="py-3 px-4 text-[#1c446c] text-right">{p.receivedBy}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
