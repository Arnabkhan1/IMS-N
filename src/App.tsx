import React, { useState, useEffect } from 'react';
import { IMSProvider, useIMS } from './context/IMSContext';
import { Header } from './components/layout/Header';
import { Sidebar, TabType } from './components/layout/Sidebar';
import { AdminDashboard } from './components/views/AdminDashboard';
import { StudentsView } from './components/views/StudentsView';
import { TeachersView } from './components/views/TeachersView';
import { CoursesBatchesView } from './components/views/CoursesBatchesView';
import { AttendanceView } from './components/views/AttendanceView';
import { PaymentsView } from './components/views/PaymentsView';
import { ExamsView } from './components/views/ExamsView';
import { RoadmapsView } from './components/views/RoadmapsView';
import { RemindersView } from './components/views/RemindersView';
import { TeacherPortal } from './components/views/TeacherPortal';
import { AccountantPortal } from './components/views/AccountantPortal';
import { StudentPortal } from './components/views/StudentPortal';
import { StudentModal } from './components/modals/StudentModal';
import { PaymentModal } from './components/modals/PaymentModal';
import { RoutineSlotModal } from './components/modals/RoutineSlotModal';
import { ReminderModal } from './components/modals/ReminderModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { PlanDocumentModal } from './components/modals/PlanDocumentModal';
import { Student, Invoice, Payment } from './types/ims';

const MainAppContent: React.FC = () => {
  const { currentUser } = useIMS();

  // Active tab state
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTargetInvoice, setPaymentTargetInvoice] = useState<Invoice | null>(null);

  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderTargetInvoice, setReminderTargetInvoice] = useState<Invoice | null>(null);

  const [activeReceiptPayment, setActiveReceiptPayment] = useState<Payment | null>(null);
  const [isPlanDocOpen, setIsPlanDocOpen] = useState(false);

  // Automatically update tab when switching role to match user perspective
  useEffect(() => {
    switch (currentUser.role) {
      case 'ADMIN':
        setCurrentTab('overview');
        break;
      case 'TEACHER':
        setCurrentTab('teacher_portal');
        break;
      case 'ACCOUNTANT':
        setCurrentTab('accountant_portal');
        break;
      case 'STUDENT':
        setCurrentTab('student_portal');
        break;
    }
  }, [currentUser.role]);

  const handleOpenEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenPayment = (invoice?: Invoice) => {
    setPaymentTargetInvoice(invoice || null);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // User requested: "kono slip banate hobe na" - No receipt slip popup
    setActiveReceiptPayment(null);
  };

  const handleOpenReminder = (invoice: Invoice) => {
    setReminderTargetInvoice(invoice);
    setIsReminderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#cee2f4] flex flex-col text-[#051d38]">
      {/* Global Header */}
      <Header
        onOpenPlanDoc={() => setIsPlanDocOpen(true)}
        onToggleSidebar={() => setIsSidebarOpenMobile((prev) => !prev)}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {/* View routing based on active tab */}
          {currentTab === 'overview' && (
            <AdminDashboard
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenStudentModal={handleOpenAddStudent}
              onOpenPaymentModal={() => handleOpenPayment()}
              onOpenBatchModal={() => setIsBatchModalOpen(true)}
            />
          )}

          {currentTab === 'students' && (
            <StudentsView
              onOpenAddModal={handleOpenAddStudent}
              onEditStudent={handleOpenEditStudent}
            />
          )}

          {currentTab === 'teachers' && <TeachersView />}

          {currentTab === 'batches' && (
            <CoursesBatchesView onOpenBatchModal={() => setIsBatchModalOpen(true)} />
          )}

          {currentTab === 'attendance' && <AttendanceView />}

          {currentTab === 'payments' && (
            <PaymentsView
              onOpenPaymentModal={handleOpenPayment}
              onOpenReceipt={(payment) => setActiveReceiptPayment(payment)}
              onOpenReminderModal={handleOpenReminder}
            />
          )}

          {currentTab === 'exams' && <ExamsView />}

          {currentTab === 'roadmaps' && <RoadmapsView />}

          {currentTab === 'reminders' && (
            <RemindersView onOpenReminderModal={handleOpenReminder} />
          )}

          {currentTab === 'teacher_portal' && (
            <TeacherPortal onNavigate={(tab) => setCurrentTab(tab)} />
          )}

          {currentTab === 'accountant_portal' && (
            <AccountantPortal
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenPaymentModal={handleOpenPayment}
              onOpenReceipt={(payment) => setActiveReceiptPayment(payment)}
              onOpenReminderModal={handleOpenReminder}
            />
          )}

          {currentTab === 'student_portal' && (
            <StudentPortal
              onOpenReceipt={(payment) => setActiveReceiptPayment(payment)}
            />
          )}
        </main>
      </div>

      {/* All Modal Overlays */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        editStudent={editingStudent}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedInvoice={paymentTargetInvoice}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <RoutineSlotModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
      />

      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        invoice={reminderTargetInvoice}
      />

      <ReceiptModal
        payment={activeReceiptPayment}
        onClose={() => setActiveReceiptPayment(null)}
      />

      <PlanDocumentModal
        isOpen={isPlanDocOpen}
        onClose={() => setIsPlanDocOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <IMSProvider>
      <MainAppContent />
    </IMSProvider>
  );
}
