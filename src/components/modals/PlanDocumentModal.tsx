import React, { useState } from 'react';
import { FileText, Download, Printer, X, Check, Copy } from 'lucide-react';

interface PlanDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlanDocumentModal: React.FC<PlanDocumentModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDoc = () => {
    const content = document.getElementById('ims-plan-document-content')?.innerHTML;
    if (!content) return;

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Novum Labs IMS Plan & Architecture</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.5; background-color: #e8f3fc; }
        h1 { color: #03045e; font-size: 20pt; border-bottom: 2pt solid #0077b6; padding-bottom: 6pt; }
        h2 { color: #0077b6; font-size: 14pt; margin-top: 14pt; }
        table { border-collapse: collapse; width: 100%; margin-top: 10pt; }
        th, td { border: 1pt solid #9ec5ea; padding: 6pt 8pt; text-align: left; }
        th { background-color: #cde4f7; color: #03045e; }
        code { background-color: #cfe4f6; font-family: 'Courier New', monospace; padding: 2pt 4pt; }
      </style>
      </head><body>`;
    const footer = '</body></html>';
    const sourceHTML = header + content + footer;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement('a');
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'Novum_Labs_IMS_Full_Plan_and_Specification.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleCopyText = () => {
    const text = document.getElementById('ims-plan-document-content')?.innerText;
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-5 pt-3 sm:pt-6 pb-12 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#deedf9] rounded-xl shadow-2xl max-w-4xl w-full border border-[#9ec5ea] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)]">
        {/* Top Control Bar */}
        <div className="no-print bg-[#03045e] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-300" />
            <div>
              <h2 className="font-bold text-sm text-white">
                Novum Labs IMS - Full Architecture Plan & Specification
              </h2>
              <p className="text-[11px] text-blue-200">
                Novum Labs Single Institute Scope · PostgreSQL & Prisma 7 · 4 Roles · 6 Modules
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 bg-[#0077b6]/40 hover:bg-[#0077b6] text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handleDownloadDoc}
              className="flex items-center gap-1.5 bg-[#0077b6] hover:bg-[#0096c7] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Word (.doc)</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Content (Soft Tinted Light Blue, No White) */}
        <div
          id="ims-plan-document-content"
          className="p-8 sm:p-10 overflow-y-auto space-y-6 text-[#1c446c] text-xs sm:text-sm leading-relaxed bg-[#e8f3fc]"
        >
          <div className="border-b-2 border-[#03045e] pb-4">
            <div className="text-[#0077b6] font-mono text-xs uppercase tracking-wider font-semibold">
              Novum Labs Institute Management System (Single Institute)
            </div>
            <h1 className="text-2xl font-bold text-[#03045e] mt-1">
              Novum Labs IMS - Plan & Technical Architecture
            </h1>
            <p className="text-xs text-[#385e85] mt-1">
              Document Version: 1.0 · Novum Labs Deployment · Status: Step 2 Complete (Prisma Schema & Seed) · Currency: Indian Rupees (₹)
            </p>
          </div>

          {/* Section 1: Tech Stack */}
          <div>
            <h2 className="text-base font-bold text-[#03045e]">
              1. Tech Stack Overview
            </h2>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full border-collapse border border-[#b5d5ef] text-left text-xs">
                <thead>
                  <tr className="bg-[#cde4f7] text-[#03045e]">
                    <th className="p-2.5 border border-[#b5d5ef] font-semibold">Purpose</th>
                    <th className="p-2.5 border border-[#b5d5ef] font-semibold">Choice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3dcf2]">
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Framework</td>
                    <td className="p-2.5 border border-[#b5d5ef]">Next.js (App Router) + TypeScript</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Styling</td>
                    <td className="p-2.5 border border-[#b5d5ef]">
                      Tailwind v4, theme: Navy <code>#03045e</code>, Blue <code>#0077b6</code>, light blue backgrounds (no white)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Database</td>
                    <td className="p-2.5 border border-[#b5d5ef]">PostgreSQL (Neon)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">ORM</td>
                    <td className="p-2.5 border border-[#b5d5ef]">Prisma 7</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Currency</td>
                    <td className="p-2.5 border border-[#b5d5ef]">Indian Rupees (₹) across invoices, payments, vouchers, and receipts</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Login & Auth</td>
                    <td className="p-2.5 border border-[#b5d5ef]">Auth.js (email + password, bcrypt)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Validation</td>
                    <td className="p-2.5 border border-[#b5d5ef]">Zod schema validation</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Notifications</td>
                    <td className="p-2.5 border border-[#b5d5ef]">Resend (Email) + Local SMS Gateway + WhatsApp Business API</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Scheduled Cron</td>
                    <td className="p-2.5 border border-[#b5d5ef]">Vercel Cron (Daily automated due check with duplicate prevention)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Roles and Permissions */}
          <div>
            <h2 className="text-base font-bold text-[#03045e]">
              2. Roles and Permissions Matrix
            </h2>
            <p className="text-xs text-[#2c537a] mt-1 mb-2">
              Rule: Permissions are strictly enforced on server queries. Teacher queries always filter by <code>instructorId</code>.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-[#b5d5ef] text-left text-xs">
                <thead>
                  <tr className="bg-[#cde4f7] text-[#03045e]">
                    <th className="p-2.5 border border-[#b5d5ef] font-semibold">Action</th>
                    <th className="p-2.5 border border-[#b5d5ef] text-center font-semibold">Admin</th>
                    <th className="p-2.5 border border-[#b5d5ef] text-center font-semibold">Teacher</th>
                    <th className="p-2.5 border border-[#b5d5ef] text-center font-semibold">Accountant</th>
                    <th className="p-2.5 border border-[#b5d5ef] text-center font-semibold">Student</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3dcf2]">
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Add/edit/delete students</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center font-bold text-emerald-800">✅ Full</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Add/edit/delete teachers</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center font-bold text-emerald-800">✅ Full</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Set courses, batches, schedules</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center font-bold text-emerald-800">✅ Full</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Student attendance</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center font-bold text-emerald-800">✅ Full</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center font-semibold text-[#0077b6]">Own batches only</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#1c446c]">View own</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Teacher attendance</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center font-bold text-emerald-800">✅ Full</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#1c446c]">View own</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Payment entry and invoice history (₹)</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center font-bold text-emerald-800">✅ Full</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center font-bold text-emerald-800">✅ Full</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#1c446c]">View own</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Exam marks & results</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center font-bold text-emerald-800">✅ Full</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center font-semibold text-[#0077b6]">Own batches</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#1c446c]">View own</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Set syllabus roadmap & progress</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center font-bold text-emerald-800">✅ Full</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center font-semibold text-[#0077b6]">Own batches</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#1c446c]">View own</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#b5d5ef] font-medium">Due reminder trigger & settings</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center font-bold text-emerald-800">✅ Full</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center font-bold text-emerald-800">✅ Full</td>
                    <td className="p-2.5 border border-[#b5d5ef] text-center text-[#4a75a0]">❌</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: The 6 Core Modules */}
          <div>
            <h2 className="text-base font-bold text-[#03045e]">
              3. Architectural Modules Breakdown
            </h2>
            <div className="space-y-3 mt-2 text-xs">
              <div className="p-3 bg-[#cfe4f6] rounded-lg border border-[#a6ceee]">
                <span className="font-bold text-[#03045e]">1. Student Module:</span> Name, phone, email, guardian link, admission date, status (Active, Passed, Dropped). Soft delete (<code>deletedAt</code>) ensures historical invoices and attendance integrity are never destroyed.
              </div>
              <div className="p-3 bg-[#cfe4f6] rounded-lg border border-[#a6ceee]">
                <span className="font-bold text-[#03045e]">2. Teacher Module:</span> Profile, phone, joining date, assigned batches, department.
              </div>
              <div className="p-3 bg-[#cfe4f6] rounded-lg border border-[#a6ceee]">
                <span className="font-bold text-[#03045e]">3. Course, Batch, Schedule:</span> One course has many batches. Batch has assigned instructor, seat limit, days, start/end time, and room. Automatic routine generation for enrolled students.
              </div>
              <div className="p-3 bg-[#cfe4f6] rounded-lg border border-[#a6ceee]">
                <span className="font-bold text-[#03045e]">4. Attendance:</span> Separate tracking for students and teachers (Present, Absent, Late, Leave). Recorded per batch and per date with bulk marking and attendance % calculations.
              </div>
              <div className="p-3 bg-[#cfe4f6] rounded-lg border border-[#a6ceee]">
                <span className="font-bold text-[#03045e]">5. Payments & Invoices:</span> Invoices with due dates and statuses (Due, Partial, Paid). Payments recorded in Rupees (₹) with UPI/Cash/Bank Transfer/GPay/Card, transaction ID, receivedBy, and official printable receipt generator.
              </div>
              <div className="p-3 bg-[#cfe4f6] rounded-lg border border-[#a6ceee]">
                <span className="font-bold text-[#03045e]">6. Progress, Exam, Roadmap:</span> Exams with total/pass marks, results matrix with automatic grade calculation. Roadmaps with week-by-week topic completion tracking.
              </div>
              <div className="p-3 bg-[#cfe4f6] rounded-lg border border-[#a6ceee]">
                <span className="font-bold text-[#03045e]">7. Due Reminders Engine:</span> Sent X days before due date and when overdue by Email/SMS/WhatsApp. Logs every sent reminder to prevent duplicate dispatches.
              </div>
            </div>
          </div>

          {/* Section 4: Current Status & Step 2 Deliverables */}
          <div className="p-4 bg-[#c8e8d8] rounded-lg border border-emerald-300">
            <h3 className="font-bold text-emerald-950 text-sm">
              Current Project Status: Step 2 Complete
            </h3>
            <p className="text-xs text-emerald-900 mt-1">
              File <code>prisma/schema.prisma</code> has been created with all 18 relational tables, enums, foreign keys, and indexes. Seed data has been populated. Next step: User login and role middleware guarding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
