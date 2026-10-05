import React from 'react';
import { Payment } from '../../types/ims';
import { useIMS } from '../../context/IMSContext';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  payment: Payment | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, onClose }) => {
  const { invoices, students, batches, courses } = useIMS();

  if (!payment) return null;

  const invoice = invoices.find((i) => i.id === payment.invoiceId);
  const student = students.find((s) => s.id === payment.studentId);
  const batch = batches.find((b) => b.id === invoice?.batchId);
  const course = courses.find((c) => c.id === batch?.courseId);

  const totalInvoiceAmount = invoice?.amount || 0;
  const currentPaid = invoice?.paidAmount || 0;
  const remainingDue = Math.max(0, totalInvoiceAmount - currentPaid);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center items-start p-3 sm:p-5 pt-3 sm:pt-6 pb-12">
      <div className="relative bg-[#deedf9] rounded-xl shadow-2xl max-w-2xl w-full border border-[#9ec5ea] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Action Bar (no-print) */}
        <div className="no-print bg-[#03045e] text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 border-b border-[#0077b6]/30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-300" />
            <span className="font-semibold text-sm">Official Novum Labs Money Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#0077b6] hover:bg-[#0096c7] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper (Tinted Light Blue - No Stark White) */}
        <div className="p-6 sm:p-8 bg-[#e8f3fc] text-[#051d38] space-y-6 overflow-y-auto flex-1 overscroll-contain print:p-6 print:m-0 print:shadow-none print:bg-[#e8f3fc] print:overflow-visible">
          {/* Header */}
          <div className="border-b-2 border-[#03045e] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#03045e] text-white font-bold text-lg flex items-center justify-center shadow-sm">
                  N
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#03045e]">
                    NOVUM LABS
                  </h1>
                  <p className="text-xs text-[#2c537a] font-medium">
                    Center for Advanced Engineering, Software & Research
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#385e85] mt-2">
                Tech Innovation Hub, Cyber Park Road · accounts@novumlabs.edu
              </p>
            </div>

            <div className="text-right sm:border-l sm:pl-6 border-[#b5d5ef]">
              <span className="inline-block bg-[#cfe4f6] text-[#03045e] text-xs font-bold px-2.5 py-1 rounded border border-[#0077b6]/40 uppercase tracking-wider">
                MONEY RECEIPT
              </span>
              <div className="mt-2 font-mono text-xs font-bold text-[#03045e]">
                {payment.receiptNo}
              </div>
              <div className="text-xs text-[#385e85] font-mono mt-0.5">
                Date: {payment.paymentDate}
              </div>
            </div>
          </div>

          {/* Student & Course Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#cfe4f6] p-4 rounded-lg border border-[#a6ceee] text-xs">
            <div>
              <div className="text-[#385e85] font-medium uppercase text-[10px] tracking-wider">
                Student Details
              </div>
              <div className="font-bold text-sm text-[#03045e] mt-1">{student?.name}</div>
              <div className="text-[#1c446c] mt-0.5">
                Roll No: <span className="font-mono font-semibold text-[#03045e]">{student?.studentRoll}</span>
              </div>
              <div className="text-[#1c446c]">Phone: {student?.phone}</div>
              <div className="text-[#1c446c]">Email: {student?.email}</div>
            </div>

            <div>
              <div className="text-[#385e85] font-medium uppercase text-[10px] tracking-wider">
                Academic Program
              </div>
              <div className="font-bold text-sm text-[#0077b6] mt-1">{course?.title}</div>
              <div className="text-[#1c446c] mt-0.5">
                Batch: <span className="font-medium text-[#03045e]">{batch?.name}</span> ({batch?.batchCode})
              </div>
              <div className="text-[#1c446c]">
                Invoice No: <span className="font-mono text-[#03045e]">{invoice?.invoiceNo}</span>
              </div>
              <div className="text-[#1c446c]">
                Purpose: {invoice?.title}
              </div>
            </div>
          </div>

          {/* Payment Line Item Table */}
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#9ec5ea] text-[#03045e] bg-[#cde4f7]">
                <th className="py-2.5 px-3 font-semibold">Description</th>
                <th className="py-2.5 px-3 font-semibold">Method</th>
                <th className="py-2.5 px-3 font-semibold">Ref / Trans ID</th>
                <th className="py-2.5 px-3 font-semibold text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3dcf2]">
              <tr>
                <td className="py-3 px-3 font-medium text-[#051d38]">
                  {invoice?.title || 'Academic Fee Payment'}
                  {payment.notes && (
                    <span className="block text-[11px] text-[#385e85]">{payment.notes}</span>
                  )}
                </td>
                <td className="py-3 px-3 font-medium">
                  <span className="bg-[#cfe4f6] text-[#0077b6] px-2 py-0.5 rounded text-[11px] font-semibold border border-[#a6ceee]">
                    {payment.paymentMethod}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-[#385e85]">
                  {payment.transactionId || 'Counter Deposit'}
                </td>
                <td className="py-3 px-3 font-mono font-bold text-[#03045e] text-right tabular-nums text-sm">
                  ₹{payment.amount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Financial Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-72 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#b5d5ef] text-[#1c446c]">
                <span>Total Invoice Amount:</span>
                <span className="font-mono tabular-nums font-semibold text-[#03045e]">
                  ₹{totalInvoiceAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#b5d5ef] text-[#03045e] font-bold">
                <span>Amount Paid This Receipt:</span>
                <span className="font-mono tabular-nums text-sm">
                  ₹{payment.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#b5d5ef] text-[#1c446c]">
                <span>Total Settled to Date:</span>
                <span className="font-mono tabular-nums font-semibold text-emerald-800">
                  ₹{currentPaid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 text-[#03045e] font-bold">
                <span>Remaining Due:</span>
                <span
                  className={`font-mono tabular-nums ${
                    remainingDue > 0 ? 'text-amber-900' : 'text-emerald-800'
                  }`}
                >
                  ₹{remainingDue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Stamp & Signatures */}
          <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs text-[#2c537a]">
            <div>
              <div className="h-10 border-b border-dashed border-[#8ebae0] w-36 mx-auto mb-1 flex items-end justify-center pb-1">
                <span className="font-serif italic text-[#03045e]">{student?.name}</span>
              </div>
              <div>Student / Depositor Signature</div>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-[#8ebae0] w-36 mx-auto mb-1 flex items-end justify-center pb-1">
                <div className="flex items-center gap-1 text-[#03045e] font-semibold text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-800" />
                  <span>{payment.receivedBy}</span>
                </div>
              </div>
              <div>Authorized Accounts Officer</div>
            </div>
          </div>

          {/* Footer note */}
          <div className="border-t border-[#b5d5ef] pt-4 text-center text-[11px] text-[#385e85]">
            This is an electronically generated official receipt verified by Novum Labs Financial & Academic Services.
          </div>
        </div>
      </div>
    </div>
  );
};
