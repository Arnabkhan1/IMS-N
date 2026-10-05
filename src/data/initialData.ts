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
  ClassRoutineSlot,
} from '../types/ims';

// Core administrative accounts for system access and role switching
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Admin Officer',
    email: 'admin@novumlabs.edu',
    role: 'ADMIN',
    phone: '+91 98765-00001',
  },
  {
    id: 'usr-teacher-1',
    name: 'Faculty Member',
    email: 'faculty@novumlabs.edu',
    role: 'TEACHER',
    phone: '+91 98765-00002',
    associatedId: 'inst-1',
  },
  {
    id: 'usr-accountant',
    name: 'Accounts Officer',
    email: 'accounts@novumlabs.edu',
    role: 'ACCOUNTANT',
    phone: '+91 98765-00003',
  },
  {
    id: 'usr-student-1',
    name: 'Student Member',
    email: 'student@novumlabs.edu',
    role: 'STUDENT',
    phone: '+91 98765-00004',
    associatedId: 'stu-1',
  },
];

// Clean slate: ready for user's original data
export const INITIAL_GUARDIANS: Guardian[] = [];

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_INSTRUCTORS: Instructor[] = [];

export const INITIAL_COURSES: Course[] = [];

export const INITIAL_BATCHES: Batch[] = [];

export const INITIAL_ROUTINE_SLOTS: ClassRoutineSlot[] = [];

export const INITIAL_ENROLLMENTS: Enrollment[] = [];

export const INITIAL_STUDENT_ATTENDANCE: StudentAttendance[] = [];

export const INITIAL_TEACHER_ATTENDANCE: TeacherAttendance[] = [];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_PAYMENTS: Payment[] = [];

export const INITIAL_EXAMS: Exam[] = [];

export const INITIAL_EXAM_RESULTS: ExamResult[] = [];

export const INITIAL_ROADMAPS: Roadmap[] = [];

export const INITIAL_STUDENT_TOPIC_PROGRESS: StudentTopicProgress[] = [];

export const INITIAL_REMINDERS: Reminder[] = [];

export const INITIAL_REMINDER_SETTINGS: ReminderSettings = {
  autoScanEnabled: true,
  preDueDays: 3,
  postDueDays: 7,
  emailEnabled: true,
  smsEnabled: false,
  whatsappEnabled: false,
  defaultTemplateEmail: 'Dear {{studentName}}, this is a reminder from Novum Labs that your monthly fee installment of ₹{{dueAmount}} is due on {{dueDate}}.',
  defaultTemplateSMS: 'Novum Labs: Fee ₹{{dueAmount}} due on {{dueDate}} for {{studentName}}.',
  defaultTemplateWhatsApp: 'Hello {{studentName}}, reminder from Novum Labs regarding fee due ₹{{dueAmount}} on {{dueDate}}.',
};
