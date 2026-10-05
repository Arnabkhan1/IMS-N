import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import {
  Bell,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Menu,
  Shield,
  GraduationCap,
  Calculator,
  UserCheck,
} from 'lucide-react';
import { Role } from '../../types/ims';

interface HeaderProps {
  onOpenPlanDoc: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPlanDoc, onToggleSidebar }) => {
  const {
    currentUser,
    setCurrentUser,
    users,
    invoices,
    runAutomatedReminderScan,
    resetDataToFactory,
  } = useIMS();

  const [scanNotification, setScanNotification] = useState<{ message: string; count: number } | null>(null);

  // Compute pending dues alert count
  const pendingDuesCount = invoices.filter((i) => i.status !== 'PAID').length;

  const handleScanReminders = () => {
    const result = runAutomatedReminderScan();
    setScanNotification({
      message: result.sentCount > 0
        ? `Scan completed: Dispatched ${result.sentCount} due reminder(s) without duplicates.`
        : 'Scan completed: No new due reminders needed today (all up to date or already sent).',
      count: result.sentCount,
    });
    setTimeout(() => setScanNotification(null), 5000);
  };

  const getRoleBadgeIcon = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-3.5 h-3.5 text-[#03045e]" />;
      case 'TEACHER':
        return <UserCheck className="w-3.5 h-3.5 text-[#0077b6]" />;
      case 'ACCOUNTANT':
        return <Calculator className="w-3.5 h-3.5 text-emerald-600" />;
      case 'STUDENT':
        return <GraduationCap className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#03045e] text-white border-b border-[#0077b6]/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-blue-200 hover:text-white hover:bg-[#0077b6]/30 transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#0077b6] to-[#00b4d8] flex items-center justify-center font-bold text-white shadow-sm border border-white/20">
              N
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <span>Novum Labs</span>
                <span className="text-[11px] font-medium text-blue-200 bg-[#0077b6]/40 px-2 py-0.5 rounded border border-blue-400/20">
                  IMS Portal
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80 hidden sm:block">
                Academic & Accounts Management
              </p>
            </div>
          </div>
        </div>

        {/* Center: Fast Role Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-[#02023a]/80 p-1 rounded-lg border border-blue-400/20 flex items-center gap-1.5">
            <span className="text-xs text-blue-300 font-medium pl-2 pr-1 hidden lg:inline">
              Role:
            </span>
            <select
              aria-label="Select Active User & Role"
              value={currentUser.id}
              onChange={(e) => {
                const target = users.find((u) => u.id === e.target.value);
                if (target) setCurrentUser(target);
              }}
              className="bg-[#03045e] text-xs font-semibold text-white px-2.5 py-1.5 rounded border border-blue-500/30 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
            >
              <optgroup label="System Roles">
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    [{u.role}] {u.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Due Reminder Trigger Button (Admin & Accountant) */}
          {(currentUser.role === 'ADMIN' || currentUser.role === 'ACCOUNTANT') && (
            <button
              onClick={handleScanReminders}
              title="Run Automated Due Reminder Scan"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-[#0077b6] hover:bg-[#0096c7] text-white px-3 py-2 rounded-lg transition-colors border border-blue-400/30 shadow-sm"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Scan Reminders</span>
              {pendingDuesCount > 0 && (
                <span className="bg-amber-400 text-[#03045e] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingDuesCount}
                </span>
              )}
            </button>
          )}

          {/* View IMS Plan / PDF Documentation */}
          <button
            onClick={onOpenPlanDoc}
            title="View Full IMS Architecture Plan & Schema"
            className="flex items-center gap-1.5 text-xs font-medium bg-[#0077b6]/30 hover:bg-[#0077b6]/60 text-blue-100 hover:text-white px-2.5 sm:px-3 py-2 rounded-lg transition-colors border border-blue-400/20"
          >
            <FileText className="w-3.5 h-3.5 text-blue-300" />
            <span className="hidden md:inline">IMS Plan</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (window.confirm('Reset all IMS database records to initial seed data?')) {
                resetDataToFactory();
              }
            }}
            title="Reset to Factory Seed Data"
            className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User Profile Info */}
          <div className="flex items-center gap-2 pl-2 border-l border-blue-400/20">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#03045e] font-bold text-xs flex items-center justify-center border border-white/20 overflow-hidden">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <div className="hidden xl:block text-left text-xs">
              <div className="font-semibold text-white truncate max-w-[120px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-blue-300 flex items-center gap-1">
                {getRoleBadgeIcon(currentUser.role)}
                <span>{currentUser.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Scan Notification Toast */}
      {scanNotification && (
        <div className="bg-[#0077b6] text-white text-xs px-4 py-2.5 flex items-center justify-between border-t border-blue-400/30 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 mx-auto">
            {scanNotification.count > 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
            )}
            <span>{scanNotification.message}</span>
          </div>
          <button
            onClick={() => setScanNotification(null)}
            className="text-xs text-blue-200 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </header>
  );
};
