import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Guardian,
  Student,
  Instructor,
  Course,
  Batch,
  Enrollment,
  StudentAttendance,
  TeacherAttendance,
  Invoice,
  Payment,
  Exam,
  ExamResult,
  Roadmap,
  StudentTopicProgress,
  Reminder,
  ReminderSettings,
  Role,
  AttendanceStatus,
  PaymentMethod,
  ReminderChannel,
  ClassRoutineSlot,
} from '../types/ims';
import {
  INITIAL_USERS,
  INITIAL_GUARDIANS,
  INITIAL_STUDENTS,
  INITIAL_INSTRUCTORS,
  INITIAL_COURSES,
  INITIAL_BATCHES,
  INITIAL_ROUTINE_SLOTS,
  INITIAL_ENROLLMENTS,
  INITIAL_STUDENT_ATTENDANCE,
  INITIAL_TEACHER_ATTENDANCE,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_EXAMS,
  INITIAL_EXAM_RESULTS,
  INITIAL_ROADMAPS,
  INITIAL_STUDENT_TOPIC_PROGRESS,
  INITIAL_REMINDERS,
  INITIAL_REMINDER_SETTINGS,
} from '../data/initialData';

interface IMSContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  guardians: Guardian[];
  students: Student[];
  instructors: Instructor[];
  courses: Course[];
  batches: Batch[];
  classRoutines: ClassRoutineSlot[];
  addClassRoutineSlot: (slot: Omit<ClassRoutineSlot, 'id'>) => void;
  deleteClassRoutineSlot: (id: string) => void;
  enrollments: Enrollment[];
  studentAttendance: StudentAttendance[];
  teacherAttendance: TeacherAttendance[];
  invoices: Invoice[];
  payments: Payment[];
  exams: Exam[];
  examResults: ExamResult[];
  roadmaps: Roadmap[];
  studentTopicProgress: StudentTopicProgress[];
  reminders: Reminder[];
  reminderSettings: ReminderSettings;
  updateReminderSettings: (settings: ReminderSettings) => void;

  // Student CRUD (with soft-delete)
  addStudent: (studentData: Partial<Student>, guardianData: Partial<Guardian>) => void;
  updateStudent: (id: string, studentData: Partial<Student>, guardianData?: Partial<Guardian>) => void;
  softDeleteStudent: (id: string) => void;
  restoreStudent: (id: string) => void;

  // Teacher CRUD
  addInstructor: (instructorData: Omit<Instructor, 'id'>) => void;
  updateInstructor: (id: string, instructorData: Partial<Instructor>) => void;

  // Course & Batch
  addCourse: (courseData: Omit<Course, 'id'>) => void;
  addBatch: (batchData: Omit<Batch, 'id'>) => void;
  enrollStudentInBatch: (studentId: string, batchId: string, customFee?: number) => void;

  // Attendance
  saveBatchAttendance: (batchId: string, date: string, records: { studentId: string; status: AttendanceStatus; remarks?: string }[]) => void;
  recordTeacherAttendance: (instructorId: string, date: string, status: AttendanceStatus, checkIn?: string, checkOut?: string, remarks?: string) => void;

  // Billing & Payments
  createInvoice: (invoiceData: Omit<Invoice, 'id' | 'invoiceNo' | 'paidAmount' | 'status'>) => Invoice;
  recordPayment: (paymentData: {
    studentId?: string;
    month?: string;
    amount: number;
    invoiceId?: string;
    paymentMethod?: PaymentMethod;
    transactionId?: string;
    notes?: string;
  }) => Payment;

  // Exams & Marks
  createExam: (examData: Omit<Exam, 'id'>) => Exam;
  saveExamResults: (examId: string, results: { studentId: string; marksObtained: number; feedback?: string }[]) => void;

  // Roadmap & Progress
  toggleTopicCompletion: (studentId: string, topicId: string, completed: boolean) => void;

  // Reminders
  sendDueReminder: (invoiceId: string, channel: ReminderChannel, customMessage?: string) => { success: boolean; message: string };
  runAutomatedReminderScan: () => { sentCount: number; details: string[] };

  // Data management
  resetDataToFactory: () => void;
}

const IMSContext = createContext<IMSContextType | undefined>(undefined);

const STORAGE_PREFIX = 'novum_labs_ims_live_clean_v1_';

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage`, err);
  }
}

export const IMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User>(() => getStorage('curr_user', INITIAL_USERS[0]));
  const [users] = useState<User[]>(INITIAL_USERS);
  const [guardians, setGuardians] = useState<Guardian[]>(() => getStorage('guardians', INITIAL_GUARDIANS));
  const [students, setStudents] = useState<Student[]>(() => getStorage('students', INITIAL_STUDENTS));
  const [instructors, setInstructors] = useState<Instructor[]>(() => getStorage('instructors', INITIAL_INSTRUCTORS));
  const [courses, setCourses] = useState<Course[]>(() => getStorage('courses', INITIAL_COURSES));
  const [batches, setBatches] = useState<Batch[]>(() => getStorage('batches', INITIAL_BATCHES));
  const [classRoutines, setClassRoutines] = useState<ClassRoutineSlot[]>(() => getStorage('class_routines', INITIAL_ROUTINE_SLOTS));
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => getStorage('enrollments', INITIAL_ENROLLMENTS));
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>(() => getStorage('stu_att', INITIAL_STUDENT_ATTENDANCE));
  const [teacherAttendance, setTeacherAttendance] = useState<TeacherAttendance[]>(() => getStorage('tch_att', INITIAL_TEACHER_ATTENDANCE));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStorage('invoices', INITIAL_INVOICES));
  const [payments, setPayments] = useState<Payment[]>(() => getStorage('payments', INITIAL_PAYMENTS));
  const [exams, setExams] = useState<Exam[]>(() => getStorage('exams', INITIAL_EXAMS));
  const [examResults, setExamResults] = useState<ExamResult[]>(() => getStorage('exam_results', INITIAL_EXAM_RESULTS));
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(() => getStorage('roadmaps', INITIAL_ROADMAPS));
  const [studentTopicProgress, setStudentTopicProgress] = useState<StudentTopicProgress[]>(() => getStorage('topic_progress', INITIAL_STUDENT_TOPIC_PROGRESS));
  const [reminders, setReminders] = useState<Reminder[]>(() => getStorage('reminders', INITIAL_REMINDERS));
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(() => getStorage('reminder_settings', INITIAL_REMINDER_SETTINGS));

  // Sync state to localStorage
  const setCurrentUser = (u: User) => {
    setCurrentUserState(u);
    setStorage('curr_user', u);
  };

  useEffect(() => { setStorage('guardians', guardians); }, [guardians]);
  useEffect(() => { setStorage('students', students); }, [students]);
  useEffect(() => { setStorage('instructors', instructors); }, [instructors]);
  useEffect(() => { setStorage('courses', courses); }, [courses]);
  useEffect(() => { setStorage('batches', batches); }, [batches]);
  useEffect(() => { setStorage('class_routines', classRoutines); }, [classRoutines]);
  useEffect(() => { setStorage('enrollments', enrollments); }, [enrollments]);
  useEffect(() => { setStorage('stu_att', studentAttendance); }, [studentAttendance]);
  useEffect(() => { setStorage('tch_att', teacherAttendance); }, [teacherAttendance]);
  useEffect(() => { setStorage('invoices', invoices); }, [invoices]);
  useEffect(() => { setStorage('payments', payments); }, [payments]);
  useEffect(() => { setStorage('exams', exams); }, [exams]);
  useEffect(() => { setStorage('exam_results', examResults); }, [examResults]);
  useEffect(() => { setStorage('roadmaps', roadmaps); }, [roadmaps]);
  useEffect(() => { setStorage('topic_progress', studentTopicProgress); }, [studentTopicProgress]);
  useEffect(() => { setStorage('reminders', reminders); }, [reminders]);
  useEffect(() => { setStorage('reminder_settings', reminderSettings); }, [reminderSettings]);

  // Student CRUD
  const addStudent = (studentData: Partial<Student>, guardianData: Partial<Guardian>) => {
    const guardianId = 'grd-' + Date.now().toString(36);
    const newGuardian: Guardian = {
      id: guardianId,
      name: guardianData.name || 'Guardian Name',
      phone: guardianData.phone || '',
      relationship: guardianData.relationship || 'Father',
      email: guardianData.email,
      occupation: guardianData.occupation,
    };

    const studentId = 'stu-' + Date.now().toString(36);
    const rollNumber = `NL-${new Date().getFullYear()}-${100 + students.length + 1}`;
    const newStudent: Student = {
      id: studentId,
      guardianId,
      guardian: newGuardian,
      name: studentData.name || 'New Student',
      studentRoll: studentData.studentRoll || rollNumber,
      classGrade: studentData.classGrade || 'Class 10',
      email: studentData.email || `${studentId}@student.novumlabs.edu`,
      phone: studentData.phone || '',
      dateOfBirth: studentData.dateOfBirth,
      gender: studentData.gender || 'Male',
      address: studentData.address || '',
      admissionDate: studentData.admissionDate || new Date().toISOString().split('T')[0],
      status: studentData.status || 'ACTIVE',
      deletedAt: null,
    };

    setGuardians((prev) => [...prev, newGuardian]);
    setStudents((prev) => [newStudent, ...prev]);
  };

  const updateStudent = (id: string, studentData: Partial<Student>, guardianData?: Partial<Guardian>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          ...studentData,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    if (guardianData) {
      const student = students.find((s) => s.id === id);
      if (student && student.guardianId) {
        setGuardians((prev) =>
          prev.map((g) => (g.id === student.guardianId ? { ...g, ...guardianData } : g))
        );
      }
    }
  };

  const softDeleteStudent = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, deletedAt: new Date().toISOString() } : s))
    );
  };

  const restoreStudent = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, deletedAt: null } : s))
    );
  };

  // Teacher CRUD
  const addInstructor = (data: Omit<Instructor, 'id'>) => {
    const id = 'inst-' + Date.now().toString(36);
    const newInst: Instructor = { id, ...data };
    setInstructors((prev) => [...prev, newInst]);
  };

  const updateInstructor = (id: string, data: Partial<Instructor>) => {
    setInstructors((prev) => prev.map((inst) => (inst.id === id ? { ...inst, ...data } : inst)));
  };

  // Course & Batch
  const addCourse = (data: Omit<Course, 'id'>) => {
    const id = 'crs-' + Date.now().toString(36);
    setCourses((prev) => [...prev, { id, ...data }]);
  };

  const addBatch = (data: Omit<Batch, 'id'>) => {
    const id = 'btc-' + Date.now().toString(36);
    setBatches((prev) => [...prev, { id, ...data }]);
  };

  const addClassRoutineSlot = (slotData: Omit<ClassRoutineSlot, 'id'>) => {
    const id = 'rtn-' + Date.now().toString(36);
    setClassRoutines((prev) => [...prev, { id, ...slotData }]);
  };

  const deleteClassRoutineSlot = (id: string) => {
    setClassRoutines((prev) => prev.filter((s) => s.id !== id));
  };

  const enrollStudentInBatch = (studentId: string, batchId: string, customFee?: number) => {
    const batch = batches.find((b) => b.id === batchId);
    const course = courses.find((c) => c.id === batch?.courseId);
    const finalFee = customFee !== undefined ? customFee : (course?.totalFee || 20000);

    const enrollmentId = 'enr-' + Date.now().toString(36);
    const newEnrollment: Enrollment = {
      id: enrollmentId,
      studentId,
      batchId,
      enrolledAt: new Date().toISOString().split('T')[0],
      status: 'Enrolled',
      finalFee,
    };

    setEnrollments((prev) => [...prev, newEnrollment]);

    // Create admission invoice automatically
    const invNo = `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`;
    const newInvoice: Invoice = {
      id: 'inv-' + Date.now().toString(36),
      invoiceNo: invNo,
      enrollmentId,
      studentId,
      batchId,
      title: `Admission Fee - ${batch?.name || 'Batch'}`,
      amount: finalFee,
      paidAmount: 0,
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      issueDate: new Date().toISOString().split('T')[0],
      status: 'DUE',
    };
    setInvoices((prev) => [...prev, newInvoice]);
  };

  // Attendance
  const saveBatchAttendance = (batchId: string, date: string, records: { studentId: string; status: AttendanceStatus; remarks?: string }[]) => {
    setStudentAttendance((prev) => {
      // Remove any existing records for this batch and date
      const filtered = prev.filter((r) => !(r.batchId === batchId && r.date === date));
      const newRecords: StudentAttendance[] = records.map((rec) => ({
        id: 'att-' + Math.random().toString(36).substring(2, 9),
        batchId,
        studentId: rec.studentId,
        date,
        status: rec.status,
        remarks: rec.remarks,
        recordedBy: currentUser.name,
      }));
      return [...filtered, ...newRecords];
    });
  };

  const recordTeacherAttendance = (instructorId: string, date: string, status: AttendanceStatus, checkIn?: string, checkOut?: string, remarks?: string) => {
    setTeacherAttendance((prev) => {
      const filtered = prev.filter((r) => !(r.instructorId === instructorId && r.date === date));
      const newRec: TeacherAttendance = {
        id: 'tatt-' + Math.random().toString(36).substring(2, 9),
        instructorId,
        date,
        status,
        checkInTime: checkIn || '09:30 AM',
        checkOutTime: checkOut || '05:30 PM',
        remarks,
      };
      return [...filtered, newRec];
    });
  };

  // Invoices & Payments
  const createInvoice = (data: Omit<Invoice, 'id' | 'invoiceNo' | 'paidAmount' | 'status'>) => {
    const invNo = `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`;
    const newInv: Invoice = {
      id: 'inv-' + Date.now().toString(36),
      invoiceNo: invNo,
      paidAmount: 0,
      status: 'DUE',
      ...data,
    };
    setInvoices((prev) => [newInv, ...prev]);
    return newInv;
  };

  const recordPayment = ({
    studentId,
    month,
    invoiceId,
    amount,
    paymentMethod = 'CASH',
    transactionId,
    notes,
  }: {
    studentId?: string;
    month?: string;
    invoiceId?: string;
    amount: number;
    paymentMethod?: PaymentMethod;
    transactionId?: string;
    notes?: string;
  }) => {
    let targetInv = invoiceId ? invoices.find((i) => i.id === invoiceId) : undefined;
    const effectiveStudentId = studentId || targetInv?.studentId || (students[0]?.id ?? '');

    if (!targetInv) {
      targetInv = invoices.find((i) => i.studentId === effectiveStudentId && i.status !== 'PAID');
    }

    const currentMonthLabel = month || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    if (!targetInv) {
      const invNo = `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`;
      targetInv = {
        id: 'inv-' + Date.now().toString(36),
        invoiceNo: invNo,
        enrollmentId: 'fee-rec',
        studentId: effectiveStudentId,
        batchId: 'btc-1',
        title: `Monthly Fee - ${currentMonthLabel}`,
        amount,
        paidAmount: amount,
        dueDate: new Date().toISOString().split('T')[0],
        issueDate: new Date().toISOString().split('T')[0],
        status: 'PAID',
      };
      setInvoices((prev) => [targetInv!, ...prev]);
    } else {
      const newPaidAmount = targetInv.paidAmount + amount;
      const newStatus = newPaidAmount >= targetInv.amount ? 'PAID' : newPaidAmount > 0 ? 'PARTIAL' : 'DUE';
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === targetInv!.id ? { ...i, paidAmount: newPaidAmount, status: newStatus } : i
        )
      );
    }

    const rcptNo = `FEE-${new Date().getFullYear()}-${(1000 + payments.length + 1)}`;
    const newPay: Payment = {
      id: 'pay-' + Date.now().toString(36),
      receiptNo: rcptNo,
      invoiceId: targetInv.id,
      studentId: effectiveStudentId,
      month: currentMonthLabel,
      amount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      transactionId,
      receivedBy: currentUser.name,
      notes,
    };

    setPayments((prev) => [newPay, ...prev]);
    return newPay;
  };

  // Exams & Marks
  const createExam = (examData: Omit<Exam, 'id'>) => {
    const id = 'ex-' + Date.now().toString(36);
    const newEx: Exam = { id, ...examData };
    setExams((prev) => [newEx, ...prev]);
    return newEx;
  };

  const saveExamResults = (examId: string, results: { studentId: string; marksObtained: number; feedback?: string }[]) => {
    const exam = exams.find((e) => e.id === examId);
    const totalMarks = exam?.totalMarks || 100;

    const calculateGrade = (marks: number, total: number): 'A+' | 'A' | 'A-' | 'B' | 'C' | 'F' => {
      const pct = (marks / total) * 100;
      if (pct >= 80) return 'A+';
      if (pct >= 70) return 'A';
      if (pct >= 60) return 'A-';
      if (pct >= 50) return 'B';
      if (pct >= 40) return 'C';
      return 'F';
    };

    setExamResults((prev) => {
      const filtered = prev.filter((r) => r.examId !== examId);
      const newResults: ExamResult[] = results.map((r) => ({
        id: 'res-' + Math.random().toString(36).substring(2, 9),
        examId,
        studentId: r.studentId,
        marksObtained: r.marksObtained,
        grade: calculateGrade(r.marksObtained, totalMarks),
        feedback: r.feedback,
        publishedAt: new Date().toISOString().split('T')[0],
      }));
      return [...filtered, ...newResults];
    });
  };

  // Roadmap & Progress
  const toggleTopicCompletion = (studentId: string, topicId: string, completed: boolean) => {
    setStudentTopicProgress((prev) => {
      const existing = prev.find((p) => p.studentId === studentId && p.topicId === topicId);
      if (existing) {
        return prev.map((p) =>
          p.studentId === studentId && p.topicId === topicId
            ? { ...p, isCompleted: completed, completedAt: completed ? new Date().toISOString().split('T')[0] : undefined }
            : p
        );
      } else {
        return [
          ...prev,
          {
            id: 'stp-' + Math.random().toString(36).substring(2, 9),
            studentId,
            topicId,
            isCompleted: completed,
            completedAt: completed ? new Date().toISOString().split('T')[0] : undefined,
          },
        ];
      }
    });
  };

  // Reminders
  const updateReminderSettings = (settings: ReminderSettings) => {
    setReminderSettings(settings);
  };

  const sendDueReminder = (invoiceId: string, channel: ReminderChannel, customMessage?: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return { success: false, message: 'Invoice not found' };

    const student = students.find((s) => s.id === inv.studentId);
    if (!student) return { success: false, message: 'Student not found' };

    // Anti-duplicate rule: check if reminder already sent for this invoice on the same date and channel
    const today = new Date().toISOString().split('T')[0];
    const alreadySentToday = reminders.some(
      (r) => r.invoiceId === invoiceId && r.channel === channel && r.sentAt.startsWith(today)
    );

    if (alreadySentToday) {
      return {
        success: false,
        message: `A ${channel} reminder was already dispatched today for Invoice ${inv.invoiceNo}. Duplicate suppressed.`,
      };
    }

    const dueAmount = inv.amount - inv.paidAmount;
    const recipientContact = channel === 'EMAIL' ? student.email : student.phone;

    let defaultMsg = '';
    if (channel === 'EMAIL') {
      defaultMsg = reminderSettings.emailTemplate
        .replace(/{{studentName}}/g, student.name)
        .replace(/{{invoiceNo}}/g, inv.invoiceNo)
        .replace(/{{invoiceTitle}}/g, inv.title)
        .replace(/{{dueAmount}}/g, dueAmount.toLocaleString())
        .replace(/{{dueDate}}/g, inv.dueDate);
    } else if (channel === 'SMS') {
      defaultMsg = reminderSettings.smsTemplate
        .replace(/{{studentName}}/g, student.name)
        .replace(/{{invoiceNo}}/g, inv.invoiceNo)
        .replace(/{{dueAmount}}/g, dueAmount.toLocaleString())
        .replace(/{{dueDate}}/g, inv.dueDate);
    } else {
      defaultMsg = reminderSettings.whatsappTemplate
        .replace(/{{studentName}}/g, student.name)
        .replace(/{{invoiceNo}}/g, inv.invoiceNo)
        .replace(/{{dueAmount}}/g, dueAmount.toLocaleString())
        .replace(/{{dueDate}}/g, inv.dueDate);
    }

    const isOverdue = new Date(inv.dueDate) < new Date();
    const newReminder: Reminder = {
      id: 'rem-' + Date.now().toString(36),
      invoiceId,
      studentId: student.id,
      studentName: student.name,
      channel,
      status: 'SENT',
      sentAt: new Date().toISOString(),
      recipientContact,
      messageBody: customMessage || defaultMsg,
      triggerType: isOverdue ? 'Overdue' : 'Pre-Due',
    };

    setReminders((prev) => [newReminder, ...prev]);
    return {
      success: true,
      message: `${channel} reminder successfully dispatched to ${student.name} (${recipientContact})`,
    };
  };

  const runAutomatedReminderScan = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingInvoices = invoices.filter((inv) => inv.status !== 'PAID');
    let sentCount = 0;
    const details: string[] = [];

    pendingInvoices.forEach((inv) => {
      const student = students.find((s) => s.id === inv.studentId);
      if (!student) return;

      const dueDate = new Date(inv.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      const diffDays = Math.round((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

      // Rule: Pre-due (e.g. within daysBeforeDue days) OR Overdue (diffDays < 0)
      const shouldSendPreDue = diffDays >= 0 && diffDays <= reminderSettings.daysBeforeDue;
      const shouldSendOverdue = diffDays < 0;

      if (shouldSendPreDue || shouldSendOverdue) {
        // Send SMS if enabled
        if (reminderSettings.channelsEnabled.sms) {
          const res = sendDueReminder(inv.id, 'SMS');
          if (res.success) {
            sentCount++;
            details.push(`[SMS] ${student.name} (${inv.invoiceNo}): ${diffDays < 0 ? 'Overdue' : 'Upcoming'}`);
          }
        }
        // Send WhatsApp if enabled
        if (reminderSettings.channelsEnabled.whatsapp) {
          const res = sendDueReminder(inv.id, 'WHATSAPP');
          if (res.success) {
            sentCount++;
            details.push(`[WhatsApp] ${student.name} (${inv.invoiceNo})`);
          }
        }
      }
    });

    return { sentCount, details };
  };

  const resetDataToFactory = () => {
    localStorage.clear();
    setCurrentUserState(INITIAL_USERS[0]);
    setGuardians(INITIAL_GUARDIANS);
    setStudents(INITIAL_STUDENTS);
    setInstructors(INITIAL_INSTRUCTORS);
    setCourses(INITIAL_COURSES);
    setBatches(INITIAL_BATCHES);
    setEnrollments(INITIAL_ENROLLMENTS);
    setStudentAttendance(INITIAL_STUDENT_ATTENDANCE);
    setTeacherAttendance(INITIAL_TEACHER_ATTENDANCE);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setExams(INITIAL_EXAMS);
    setExamResults(INITIAL_EXAM_RESULTS);
    setRoadmaps(INITIAL_ROADMAPS);
    setStudentTopicProgress(INITIAL_STUDENT_TOPIC_PROGRESS);
    setReminders(INITIAL_REMINDERS);
    setReminderSettings(INITIAL_REMINDER_SETTINGS);
  };

  return (
    <IMSContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        guardians,
        students,
        instructors,
        courses,
        batches,
        classRoutines,
        addClassRoutineSlot,
        deleteClassRoutineSlot,
        enrollments,
        studentAttendance,
        teacherAttendance,
        invoices,
        payments,
        exams,
        examResults,
        roadmaps,
        studentTopicProgress,
        reminders,
        reminderSettings,
        updateReminderSettings,
        addStudent,
        updateStudent,
        softDeleteStudent,
        restoreStudent,
        addInstructor,
        updateInstructor,
        addCourse,
        addBatch,
        enrollStudentInBatch,
        saveBatchAttendance,
        recordTeacherAttendance,
        createInvoice,
        recordPayment,
        createExam,
        saveExamResults,
        toggleTopicCompletion,
        sendDueReminder,
        runAutomatedReminderScan,
        resetDataToFactory,
      }}
    >
      {children}
    </IMSContext.Provider>
  );
};

export const useIMS = () => {
  const context = useContext(IMSContext);
  if (!context) throw new Error('useIMS must be used within an IMSProvider');
  return context;
};
