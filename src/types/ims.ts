// Types for Novum Labs Institute Management System (IMS)

export type Role = 'ADMIN' | 'TEACHER' | 'ACCOUNTANT' | 'STUDENT';

export type StudentStatus = 'ACTIVE' | 'PASSED' | 'DROPPED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
export type InvoiceStatus = 'DUE' | 'PARTIAL' | 'PAID';
export type PaymentMethod = 'UPI' | 'CASH' | 'BANK' | 'GPAY' | 'CARD';
export type ReminderChannel = 'EMAIL' | 'SMS' | 'WHATSAPP';
export type ReminderStatus = 'SENT' | 'FAILED' | 'PENDING';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;
  associatedId?: string; // studentId or instructorId
}

export interface Guardian {
  id: string;
  name: string;
  phone: string;
  relationship: 'Father' | 'Mother' | 'Guardian';
  email?: string;
  occupation?: string;
}

export interface Student {
  id: string;
  userId?: string;
  guardianId: string;
  guardian?: Guardian;
  name: string;
  studentRoll: string;
  classGrade?: string; // Class / Grade (e.g. Class 10, Class 12, etc.)
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  admissionDate: string;
  status: StudentStatus;
  deletedAt?: string | null; // Soft-delete
}

export interface Instructor {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  joiningDate: string;
  status: 'Active' | 'On Leave';
  bio?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  durationWeeks: number;
  totalFee: number;
  syllabusOverview?: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface ClassRoutineSlot {
  id: string;
  className: string;      // e.g. "Class 10", "Class 11", "Class 12"
  subject: string;        // e.g. "Mathematics", "Physics", "Computer Science", "Chemistry"
  instructorName: string; // e.g. "Dr. Salman Khan"
  instructorId?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;      // e.g. "09:00 AM"
  endTime: string;        // e.g. "10:30 AM"
  roomNumber: string;     // e.g. "Room 101" / "Lab 301"
}

export interface ScheduleSlot {
  id: string;
  batchId: string;
  dayOfWeek: 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  startTime: string; // e.g. "10:00 AM"
  endTime: string;   // e.g. "12:00 PM"
  roomNumber: string;
}

export interface Batch {
  id: string;
  courseId: string;
  course?: Course;
  instructorId: string;
  instructor?: Instructor;
  name: string;
  batchCode: string;
  seatLimit: number;
  startDate: string;
  endDate?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  schedules: ScheduleSlot[];
}

export interface Enrollment {
  id: string;
  studentId: string;
  student?: Student;
  batchId: string;
  batch?: Batch;
  enrolledAt: string;
  status: 'Enrolled' | 'Completed' | 'Withdrawn';
  finalFee: number;
}

export interface StudentAttendance {
  id: string;
  batchId: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
  recordedBy?: string;
}

export interface TeacherAttendance {
  id: string;
  instructorId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  enrollmentId: string;
  studentId: string;
  student?: Student;
  batchId: string;
  batch?: Batch;
  title: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  issueDate: string;
  status: InvoiceStatus;
}

export interface Payment {
  id: string;
  receiptNo: string;
  invoiceId: string;
  invoice?: Invoice;
  studentId: string;
  month?: string; // Fee Month e.g. "March 2026"
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  receivedBy: string;
  notes?: string;
}

export interface Exam {
  id: string;
  batchId: string;
  batch?: Batch;
  title: string;
  examDate: string;
  totalMarks: number;
  passMarks: number;
  type: 'Quiz' | 'Midterm' | 'Final' | 'Project';
}

export interface ExamResult {
  id: string;
  examId: string;
  exam?: Exam;
  studentId: string;
  marksObtained: number;
  grade: 'A+' | 'A' | 'A-' | 'B' | 'C' | 'F';
  feedback?: string;
  publishedAt: string;
}

export interface RoadmapTopic {
  id: string;
  roadmapId: string;
  orderIndex: number;
  weekNumber: number;
  title: string;
  description?: string;
}

export interface Roadmap {
  id: string;
  courseId: string;
  course?: Course;
  title: string;
  description?: string;
  topics: RoadmapTopic[];
}

export interface StudentTopicProgress {
  id: string;
  studentId: string;
  topicId: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface Reminder {
  id: string;
  invoiceId: string;
  invoice?: Invoice;
  studentId: string;
  studentName?: string;
  channel: ReminderChannel;
  status: ReminderStatus;
  sentAt: string;
  recipientContact: string;
  messageBody: string;
  triggerType: 'Pre-Due' | 'Overdue' | 'Manual';
}

export interface ReminderSettings {
  daysBeforeDue: number;
  sendOnDueDate: boolean;
  overdueRepeatDays: number;
  channelsEnabled: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  emailTemplate: string;
  smsTemplate: string;
  whatsappTemplate: string;
}
