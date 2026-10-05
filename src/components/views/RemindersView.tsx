import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { Invoice } from '../../types/ims';
import {
  BellRing,
  Send,
  MessageSquare,
  PhoneCall,
  Mail,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Settings,
  History,
  ShieldCheck,
} from 'lucide-react';

interface RemindersViewProps {
  onOpenReminderModal: (invoice: Invoice) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  onOpenReminderModal,
}) => {
  const {
    invoices,
    students,
    reminders,
    reminderSettings,
    updateReminderSettings,
    runAutomatedReminderScan,
  } = useIMS();

  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'settings'>('pending');
  const [scanResult, setScanResult] = useState<{ sentCount: number; details: string[] } | null>(null);

  // Settings local state
  const [daysBeforeDue, setDaysBeforeDue] = useState(reminderSettings.daysBeforeDue);
  const [overdueRepeatDays, setOverdueRepeatDays] = useState(reminderSettings.overdueRepeatDays);
  const [channels, setChannels] = useState(reminderSettings.channelsEnabled);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Invoices that need attention
  const pendingInvoices = invoices.filter((inv) => inv.status !== 'PAID');

  const handleRunScan = () => {
    const res = runAutomatedReminderScan();
    setScanResult(res);
    setTimeout(() => setScanResult(null), 6000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateReminderSettings({
      ...reminderSettings,
      daysBeforeDue: Number(daysBeforeDue),
      overdueRepeatDays: Number(overdueRepeatDays),
      channelsEnabled: channels,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#03045e] tracking-tight">
            Novum Labs Due Reminders & Dispatch Engine
          </h1>
          <p className="text-xs text-[#284f76]">
            Automated daily cron scheduler, multi-channel dispatch (SMS, WhatsApp, Email), and duplicate-suppression audit logs
          </p>
        </div>

        <button
          onClick={handleRunScan}
          className="flex items-center gap-1.5 bg-[#0077b6] hover:bg-[#0096c7] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <BellRing className="w-4 h-4" />
          <span>Run Scheduled Cron Scan Now</span>
        </button>
      </div>

      {/* Floating Scan Result Toast */}
      {scanResult && (
        <div className="p-4 bg-[#cfe4f6] rounded-xl border border-[#9ec5ea] text-xs text-[#03045e] space-y-1 animate-in fade-in duration-150">
          <div className="font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-800" />
            <span>Automated Cron Scan Finished</span>
          </div>
          <p className="text-[#1c446c]">
            {scanResult.sentCount > 0
              ? `Dispatched ${scanResult.sentCount} notice(s) successfully without duplicates.`
              : 'All due notices are up to date. No new duplicate notifications dispatched today.'}
          </p>
          {scanResult.details.length > 0 && (
            <ul className="list-disc pl-5 text-[11px] text-[#385e85] mt-1 space-y-0.5 font-mono">
              {scanResult.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Nav Tabs */}
      <div className="flex items-center gap-1 bg-[#cfe4f6] p-1 rounded-lg w-fit border border-[#a6ceee]">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'pending'
              ? 'bg-[#03045e] text-white shadow-xs'
              : 'text-[#1c446c] hover:text-[#03045e]'
          }`}
        >
          Pending Dues ({pendingInvoices.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'history'
              ? 'bg-[#03045e] text-white shadow-xs'
              : 'text-[#1c446c] hover:text-[#03045e]'
          }`}
        >
          Dispatch History & Log ({reminders.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'settings'
              ? 'bg-[#03045e] text-white shadow-xs'
              : 'text-[#1c446c] hover:text-[#03045e]'
          }`}
        >
          Schedule Rules & Channels
        </button>
      </div>

      {/* Tab 1: Pending Dues Requiring Attention */}
      {activeTab === 'pending' && (
        <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#cde4f7] text-[#03045e] border-b border-[#9ec5ea] font-semibold">
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4 text-right">Total (₹)</th>
                <th className="py-3 px-4 text-right">Outstanding (₹)</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status & Trigger</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3dcf2]">
              {pendingInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#4a75a0]">
                    All students are paid up! No outstanding dues.
                  </td>
                </tr>
              ) : (
                pendingInvoices.map((inv) => {
                  const student = students.find((s) => s.id === inv.studentId);
                  const due = inv.amount - inv.paidAmount;
                  const isOverdue = new Date(inv.dueDate) < new Date();

                  // Find last reminder sent
                  const lastRem = reminders
                    .filter((r) => r.invoiceId === inv.id)
                    .sort((a, b) => b.sentAt.localeCompare(a.sentAt))[0];

                  return (
                    <tr key={inv.id} className="hover:bg-[#d4e7f7] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#03045e]">
                        {inv.invoiceNo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#03045e]">{student?.name}</div>
                        <div className="font-mono text-[11px] text-[#385e85]">
                          {student?.studentRoll} · {student?.phone}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right text-[#051d38]">
                        ₹{inv.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right font-bold text-amber-900">
                        ₹{due.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#1c446c]">
                        <span className={isOverdue ? 'text-rose-700 font-bold' : ''}>
                          {inv.dueDate}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              isOverdue
                                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {isOverdue ? 'OVERDUE' : 'PRE-DUE'}
                          </span>
                          {lastRem && (
                            <span className="text-[10px] text-[#385e85] font-mono">
                              (Sent {lastRem.channel} {lastRem.sentAt.split('T')[0]})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onOpenReminderModal(inv)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0077b6] hover:bg-[#0096c7] text-white rounded text-[11px] font-semibold transition-colors shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Notice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Dispatch History */}
      {activeTab === 'history' && (
        <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#cde4f7] text-[#03045e] border-b border-[#9ec5ea] font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Message Excerpt</th>
                <th className="py-3 px-4">Trigger</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3dcf2]">
              {reminders.map((rem) => {
                return (
                  <tr key={rem.id} className="hover:bg-[#d4e7f7] transition-colors">
                    <td className="py-3 px-4 font-mono text-[#385e85] whitespace-nowrap">
                      {rem.sentAt.replace('T', ' ').substring(0, 16)}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#03045e]">{rem.studentName}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-[10px] px-2 py-0.5 rounded bg-[#cfe4f6] text-[#0077b6] border border-[#a6ceee]">
                        {rem.channel === 'EMAIL' && <Mail className="w-3 h-3" />}
                        {rem.channel === 'SMS' && <PhoneCall className="w-3 h-3" />}
                        {rem.channel === 'WHATSAPP' && <MessageSquare className="w-3 h-3" />}
                        <span>{rem.channel}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#1c446c]">{rem.recipientContact}</td>
                    <td className="py-3 px-4 text-[#2c537a] max-w-xs truncate">
                      {rem.messageBody}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold text-[#1c446c]">
                        {rem.triggerType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#c8e8d8] text-emerald-900 border border-emerald-300">
                        {rem.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Settings Form */}
      {activeTab === 'settings' && (
        <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs p-6 space-y-6 max-w-2xl">
          <div className="border-b border-[#b5d5ef] pb-3">
            <h3 className="font-bold text-sm text-[#03045e] flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#0077b6]" />
              <span>Automated Reminder Schedule & Channel Configuration</span>
            </h3>
            <p className="text-xs text-[#2c537a] mt-0.5">
              Controls when the scheduled Cron scan checks for pending dues and sends notices
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs text-[#1c446c]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1 text-[#03045e]">
                  Pre-due Alert (Days before due date)
                </label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={daysBeforeDue}
                  onChange={(e) => setDaysBeforeDue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] font-bold"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#03045e]">
                  Overdue Re-notification Interval (Days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={overdueRepeatDays}
                  onChange={(e) => setOverdueRepeatDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] font-bold"
                />
              </div>
            </div>

            {/* Channels Enabled */}
            <div>
              <label className="block font-medium mb-2 text-[#03045e]">
                Active Notification Gateways
              </label>
              <div className="flex flex-wrap gap-4 bg-[#cfe4f6] p-3 rounded-lg border border-[#a6ceee]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channels.sms}
                    onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0077b6] accent-[#0077b6]"
                  />
                  <span className="font-semibold text-[#03045e]">SMS Gateway</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channels.whatsapp}
                    onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0077b6] accent-[#0077b6]"
                  />
                  <span className="font-semibold text-[#03045e]">WhatsApp Business API</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channels.email}
                    onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0077b6] accent-[#0077b6]"
                  />
                  <span className="font-semibold text-[#03045e]">Email (Resend/SMTP)</span>
                </label>
              </div>
            </div>

            {/* Duplicate Suppression Guarantee */}
            <div className="p-3 bg-[#cfe4f6] rounded-lg border border-[#a6ceee] flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#0077b6] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#1c446c]">
                <span className="font-bold text-[#03045e]">Duplicate Suppression Engine Active:</span>{' '}
                Our cron engine checks the <code className="bg-[#b5d7f3] px-1 rounded text-[#03045e]">reminders</code> audit table before sending. A student will never receive duplicate notices for the same invoice on the same calendar day.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {settingsSaved ? (
                <span className="text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Settings updated successfully!</span>
                </span>
              ) : (
                <div />
              )}

              <button
                type="submit"
                className="px-5 py-2 font-semibold bg-[#03045e] hover:bg-[#02023a] text-white rounded-lg transition-colors shadow-xs"
              >
                Save Notification Rules
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
