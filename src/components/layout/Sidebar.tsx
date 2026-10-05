import React from 'react';
import { useIMS } from '../../context/IMSContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Award,
  Milestone,
  BellRing,
  CalendarDays,
  FileSpreadsheet,
  X,
} from 'lucide-react';

export type TabType =
  | 'overview'
  | 'students'
  | 'teachers'
  | 'batches'
  | 'attendance'
  | 'payments'
  | 'exams'
  | 'roadmaps'
  | 'reminders'
  | 'teacher_portal'
  | 'accountant_portal'
  | 'student_portal';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { currentUser, invoices } = useIMS();

  // Calculate badge numbers
  const pendingDues = invoices.filter((i) => i.status !== 'PAID').length;

  const handleTabClick = (tab: TabType) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  // Nav items for Admin
  const adminNav: NavItem[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students Directory', icon: Users },
    { id: 'teachers', label: 'Teachers & Faculty', icon: GraduationCap },
    { id: 'batches', label: 'Weekly Class Routine', icon: CalendarDays },
    { id: 'attendance', label: 'Attendance Hub', icon: CalendarCheck },
    { id: 'payments', label: 'Invoices & Payments', icon: CreditCard },
    { id: 'exams', label: 'Exams & Marks', icon: Award },
    { id: 'roadmaps', label: 'Roadmap & Progress', icon: Milestone },
    {
      id: 'reminders',
      label: 'Due Reminders',
      icon: BellRing,
      badge: pendingDues > 0 ? pendingDues : undefined,
    },
  ];

  // Dedicated role navigation items
  const teacherNav: NavItem[] = [
    { id: 'teacher_portal', label: 'Teacher Workspace', icon: BookOpen },
    { id: 'batches', label: 'Weekly Class Routine', icon: CalendarDays },
    { id: 'attendance', label: 'Class Attendance', icon: CalendarCheck },
    { id: 'exams', label: 'Exam Marks Grading', icon: Award },
    { id: 'roadmaps', label: 'Syllabus Roadmap', icon: Milestone },
  ];

  const accountantNav: NavItem[] = [
    { id: 'accountant_portal', label: 'Accounts Dashboard', icon: CreditCard },
    { id: 'payments', label: 'Invoices & Ledger', icon: FileSpreadsheet },
    {
      id: 'reminders',
      label: 'Due Reminder Engine',
      icon: BellRing,
      badge: pendingDues > 0 ? pendingDues : undefined,
    },
  ];

  const studentNav: NavItem[] = [
    { id: 'student_portal', label: 'Student Portal', icon: GraduationCap },
    { id: 'batches', label: 'Weekly Class Routine', icon: CalendarDays },
  ];

  const getActiveNavItems = () => {
    switch (currentUser.role) {
      case 'ADMIN':
        return adminNav;
      case 'TEACHER':
        return teacherNav;
      case 'ACCOUNTANT':
        return accountantNav;
      case 'STUDENT':
        return studentNav;
      default:
        return adminNav;
    }
  };

  const navItems = getActiveNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-[#e6f1fb] border-r border-[#0077b6]/25 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 overflow-y-auto">
          {/* Mobile close button */}
          <div className="flex items-center justify-between md:hidden mb-4 pb-2 border-b border-blue-200">
            <span className="text-xs font-bold text-[#03045e] uppercase tracking-wider">
              Navigation Menu
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Status Tag */}
          <div className="mb-4 p-3 rounded-lg bg-[#d6e7f7] border border-[#0077b6]/30">
            <div className="text-[11px] font-semibold text-[#0077b6] uppercase tracking-wider">
              Active Workspace
            </div>
            <div className="text-xs font-bold text-[#03045e] truncate mt-0.5">
              {currentUser.role === 'ADMIN'
                ? 'Central Administrator'
                : currentUser.role === 'TEACHER'
                ? 'Faculty Workspace'
                : currentUser.role === 'ACCOUNTANT'
                ? 'Finance & Accounts'
                : 'Student Learning Hub'}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#03045e] text-white shadow-xs'
                      : 'text-slate-800 hover:bg-[#d6e7f7] hover:text-[#03045e]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-blue-300' : 'text-[#0077b6]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-amber-400 text-[#03045e]'
                          : 'bg-amber-200 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Institute Info */}
        <div className="p-4 border-t border-[#0077b6]/20 bg-[#daebf8] text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#03045e]">Novum Labs</span>
            <span className="font-mono text-[11px] text-[#0077b6]">v1.0-prod</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            Single Institute · PostgreSQL Schema
          </p>
        </div>
      </aside>
    </>
  );
};
