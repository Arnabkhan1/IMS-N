import React, { useState } from 'react';
import { Invoice, Payment } from '../../types/ims';
import { useIMS } from '../../context/IMSContext';
import { X, CheckCircle2, IndianRupee, Calendar } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInvoice?: Invoice | null;
  onPaymentSuccess?: (payment: Payment) => void;
}

const MONTH_OPTIONS = [
  'January 2026',
  'February 2026',
  'March 2026',
  'April 2026',
  'May 2026',
  'June 2026',
  'July 2026',
  'August 2026',
  'September 2026',
  'October 2026',
  'November 2026',
  'December 2026',
];

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  selectedInvoice,
  onPaymentSuccess,
}) => {
  const { students, recordPayment } = useIMS();

  const activeStudents = students.filter((s) => !s.deletedAt);

  // Default student
  const initialStudentId = selectedInvoice?.studentId || activeStudents[0]?.id || '';
  const [studentId, setStudentId] = useState<string>(initialStudentId);

  // Default month: October 2026 (or current)
  const currentMonthName = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const [month, setMonth] = useState<string>(
    MONTH_OPTIONS.includes(currentMonthName) ? currentMonthName : 'October 2026'
  );

  // Amount
  const defaultAmount = selectedInvoice ? Math.max(0, selectedInvoice.amount - selectedInvoice.paidAmount) : 2000;
  const [amount, setAmount] = useState<number>(defaultAmount || 2000);

  // Keep state synced if selectedInvoice changes
  React.useEffect(() => {
    if (selectedInvoice) {
      if (selectedInvoice.studentId) {
        setStudentId(selectedInvoice.studentId);
      }
      const due = Math.max(0, selectedInvoice.amount - selectedInvoice.paidAmount);
      if (due > 0) setAmount(due);
    }
  }, [selectedInvoice]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || amount <= 0) return;

    try {
      const payment = recordPayment({
        studentId,
        month,
        amount: Number(amount),
        invoiceId: selectedInvoice?.id,
      });

      onClose();
      // No receipt/slip modal is opened, cleanly records the fee
      if (onPaymentSuccess) {
        onPaymentSuccess(payment);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center items-start p-3 sm:p-5 pt-3 sm:pt-6 pb-12">
      <div className="relative bg-[#deedf9] rounded-xl shadow-2xl max-w-md w-full border border-[#9ec5ea] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#03045e] text-white px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0 border-b border-[#0077b6]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0077b6] flex items-center justify-center text-white shrink-0">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white leading-tight">Record Fee</h3>
              <p className="text-[11px] text-blue-200">
                Novum Labs Student Fee Entry
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Only Student, Month, Amount */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs text-[#1c446c] overflow-y-auto flex-1 overscroll-contain">
          
          {/* 1. Kon Student (Which Student) */}
          <div>
            <label className="block font-semibold mb-1 text-[#03045e]">
              Student Name *
            </label>
            <select
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-2 focus:ring-[#0077b6] text-xs font-medium"
            >
              {activeStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.classGrade || 'Class 10'} · Roll: {s.studentRoll})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Kon Mase (Which Month) */}
          <div>
            <label className="block font-semibold mb-1 text-[#03045e] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0077b6]" />
              Fee Month *
            </label>
            <select
              required
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-2 focus:ring-[#0077b6] text-xs font-medium"
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Koto Taka (Fee Amount) */}
          <div>
            <label className="block font-semibold mb-1 text-[#03045e] flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-[#0077b6]" />
              Fee Amount (₹) *
            </label>
            <input
              type="number"
              required
              min={1}
              step={100}
              placeholder="e.g. 2000"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-2 focus:ring-[#0077b6] text-base font-bold font-mono"
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
              disabled={amount <= 0 || !studentId}
              className="flex items-center gap-1.5 px-5 py-2 font-semibold bg-[#03045e] hover:bg-[#02023a] text-white rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Fee</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
