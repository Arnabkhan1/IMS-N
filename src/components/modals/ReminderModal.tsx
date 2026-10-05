import React, { useState } from 'react';
import { Invoice, ReminderChannel } from '../../types/ims';
import { useIMS } from '../../context/IMSContext';
import { X, Send, Mail, MessageSquare, PhoneCall, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, invoice }) => {
  const { students, reminderSettings, sendDueReminder, reminders } = useIMS();

  const [channel, setChannel] = useState<ReminderChannel>('SMS');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen || !invoice) return null;

  const student = students.find((s) => s.id === invoice.studentId);
  const dueAmount = invoice.amount - invoice.paidAmount;

  // Check if sent today
  const today = new Date().toISOString().split('T')[0];
  const alreadySentToday = reminders.some(
    (r) => r.invoiceId === invoice.id && r.channel === channel && r.sentAt.startsWith(today)
  );

  const getPreviewText = () => {
    if (!student) return '';
    let template = '';
    if (channel === 'EMAIL') template = reminderSettings.emailTemplate;
    else if (channel === 'SMS') template = reminderSettings.smsTemplate;
    else template = reminderSettings.whatsappTemplate;

    return template
      .replace(/{{studentName}}/g, student.name)
      .replace(/{{invoiceNo}}/g, invoice.invoiceNo)
      .replace(/{{invoiceTitle}}/g, invoice.title)
      .replace(/{{dueAmount}}/g, dueAmount.toLocaleString())
      .replace(/{{dueDate}}/g, invoice.dueDate);
  };

  const handleSend = () => {
    const res = sendDueReminder(invoice.id, channel);
    setFeedback(res);
    if (res.success) {
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center items-start p-3 sm:p-5 pt-3 sm:pt-6 pb-12">
      <div className="relative bg-[#deedf9] rounded-xl shadow-2xl max-w-lg w-full border border-[#9ec5ea] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#03045e] text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 border-b border-[#0077b6]/30">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-300" />
            <h3 className="font-bold text-sm">Send Instant Due Reminder</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 text-xs text-[#1c446c] overflow-y-auto flex-1 overscroll-contain">
          {/* Target Student & Invoice */}
          <div className="bg-[#cfe4f6] p-3.5 rounded-lg border border-[#a6ceee] space-y-1">
            <div className="flex justify-between">
              <span className="text-[#385e85]">Recipient Student:</span>
              <span className="font-bold text-[#03045e]">{student?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#385e85]">Invoice Ref:</span>
              <span className="font-mono text-[#03045e]">{invoice.invoiceNo}</span>
            </div>
            <div className="flex justify-between font-bold text-[#03045e] pt-1 border-t border-[#b5d5ef]">
              <span>Outstanding Due:</span>
              <span className="font-mono text-sm text-amber-900">₹{dueAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#385e85]">
              <span>Payment Due Date:</span>
              <span className="font-mono">{invoice.dueDate}</span>
            </div>
          </div>

          {/* Channel Selector */}
          <div>
            <label className="block font-medium mb-1 text-[#03045e]">
              Notification Dispatch Channel *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel('SMS')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border font-semibold transition-all ${
                  channel === 'SMS'
                    ? 'bg-[#0077b6] text-white border-[#0077b6]'
                    : 'bg-[#cfe4f6] text-[#03045e] border-[#a6ceee] hover:bg-[#bdddf5]'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>SMS</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('WHATSAPP')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border font-semibold transition-all ${
                  channel === 'WHATSAPP'
                    ? 'bg-[#0077b6] text-white border-[#0077b6]'
                    : 'bg-[#cfe4f6] text-[#03045e] border-[#a6ceee] hover:bg-[#bdddf5]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('EMAIL')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border font-semibold transition-all ${
                  channel === 'EMAIL'
                    ? 'bg-[#0077b6] text-white border-[#0077b6]'
                    : 'bg-[#cfe4f6] text-[#03045e] border-[#a6ceee] hover:bg-[#bdddf5]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Live Message Preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-[#03045e]">Generated Message Preview</label>
              <span className="text-[10px] text-[#385e85] font-mono">
                To:{' '}
                {channel === 'EMAIL'
                  ? student?.email
                  : student?.phone || '+91 98765-12345'}
              </span>
            </div>
            <div className="p-3 bg-[#eaf4fd] rounded-lg border border-[#9ec5ea] font-mono text-[11px] text-[#03045e] whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
              {getPreviewText()}
            </div>
          </div>

          {/* Duplicate warning if already sent */}
          {alreadySentToday && (
            <div className="p-2.5 bg-amber-100 border border-amber-300 rounded-lg flex items-center gap-2 text-amber-900 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-800" />
              <span>
                A reminder via {channel} was already sent to this student today. Sending again will log a duplicate entry.
              </span>
            </div>
          )}

          {/* Feedback Toast */}
          {feedback && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 text-xs font-semibold ${
                feedback.success
                  ? 'bg-[#c8e8d8] text-emerald-950 border border-emerald-300'
                  : 'bg-rose-100 text-rose-950 border border-rose-300'
              }`}
            >
              {feedback.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-800 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Actions */}
          <div className="sticky bottom-0 bg-[#deedf9] pt-3 pb-1 border-t border-[#b5d5ef] flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-[#1c446c] hover:bg-[#cfe4f6] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="flex items-center gap-1.5 px-5 py-2 font-semibold bg-[#03045e] hover:bg-[#02023a] text-white rounded-lg transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Reminder Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
