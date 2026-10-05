import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { Exam, ExamResult } from '../../types/ims';
import {
  Award,
  Plus,
  Save,
  Check,
  Calendar,
  X,
  CheckCircle2,
} from 'lucide-react';

export const ExamsView: React.FC = () => {
  const {
    exams,
    batches,
    enrollments,
    students,
    examResults,
    createExam,
    saveExamResults,
    currentUser,
  } = useIMS();

  const myBatches =
    currentUser.role === 'TEACHER'
      ? batches.filter((b) => b.instructorId === currentUser.associatedId)
      : batches;

  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New exam form state
  const [newTitle, setNewTitle] = useState('');
  const [newBatchId, setNewBatchId] = useState(myBatches[0]?.id || batches[0]?.id || '');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTotalMarks, setNewTotalMarks] = useState(100);
  const [newPassMarks, setNewPassMarks] = useState(40);
  const [newType, setNewType] = useState<Exam['type']>('Midterm');

  const selectedExam = exams.find((e) => e.id === selectedExamId);
  const targetBatch = batches.find((b) => b.id === selectedExam?.batchId);

  // Students enrolled in the selected exam's batch
  const enrolledStudents = enrollments
    .filter((e) => e.batchId === selectedExam?.batchId)
    .map((e) => students.find((s) => s.id === e.studentId))
    .filter((s): s is NonNullable<typeof s> => Boolean(s && !s.deletedAt));

  // Local state for grading inputs
  const [marksState, setMarksState] = useState<
    Record<string, { marks: number; feedback: string }>
  >({});

  React.useEffect(() => {
    if (!selectedExamId) return;
    const initialMap: Record<string, { marks: number; feedback: string }> = {};
    enrolledStudents.forEach((s) => {
      const existing = examResults.find(
        (r) => r.examId === selectedExamId && r.studentId === s.id
      );
      initialMap[s.id] = {
        marks: existing ? Number(existing.marksObtained) : 0,
        feedback: existing?.feedback || '',
      };
    });
    setMarksState(initialMap);
  }, [selectedExamId, enrolledStudents.length]);

  const calculateGrade = (marks: number, total: number) => {
    const pct = (marks / total) * 100;
    if (pct >= 80) return 'A+';
    if (pct >= 70) return 'A';
    if (pct >= 60) return 'A-';
    if (pct >= 50) return 'B';
    if (pct >= 40) return 'C';
    return 'F';
  };

  const handleSaveGrades = () => {
    if (!selectedExamId) return;
    const results = enrolledStudents.map((s) => ({
      studentId: s.id,
      marksObtained: marksState[s.id]?.marks || 0,
      feedback: marksState[s.id]?.feedback,
    }));

    saveExamResults(selectedExamId, results);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = createExam({
      title: newTitle,
      batchId: newBatchId,
      examDate: newDate,
      totalMarks: Number(newTotalMarks),
      passMarks: Number(newPassMarks),
      type: newType,
    });

    setIsCreateOpen(false);
    setSelectedExamId(created.id);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#03045e] tracking-tight">
            Novum Labs Examinations & Gradebook
          </h1>
          <p className="text-xs text-[#284f76]">
            Schedule technical assessments, record lab marks, and compute GPA/grades
          </p>
        </div>

        {(currentUser.role === 'ADMIN' || currentUser.role === 'TEACHER') && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 bg-[#03045e] hover:bg-[#02023a] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Exam</span>
          </button>
        )}
      </div>

      {/* Main Grid: Exam List (Left) + Grading Sheet (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Exam Cards List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#03045e] uppercase tracking-wider">
            Examinations ({exams.length})
          </div>

          <div className="space-y-2">
            {exams.map((ex) => {
              const b = batches.find((bt) => bt.id === ex.batchId);
              const isSelected = ex.id === selectedExamId;
              const resultsCount = examResults.filter((r) => r.examId === ex.id).length;

              return (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExamId(ex.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#c6def4] border-[#0077b6] shadow-sm'
                      : 'bg-[#deedf9] border-[#9ec5ea] hover:bg-[#d6e9f7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#cfe4f6] text-[#0077b6] border border-[#a6ceee]">
                      {ex.type}
                    </span>
                    <span className="text-[11px] font-mono text-[#385e85]">{ex.examDate}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#03045e] mt-1">{ex.title}</h4>
                  <div className="text-xs text-[#2c537a] mt-0.5">{b?.name}</div>

                  <div className="flex items-center justify-between text-[11px] text-[#385e85] mt-3 pt-2 border-t border-[#b5d5ef]">
                    <span>Total Marks: {ex.totalMarks}</span>
                    <span className="font-semibold text-emerald-800">
                      {resultsCount > 0 ? `${resultsCount} graded` : 'Pending grading'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grading Matrix Sheet */}
        <div className="lg:col-span-2 space-y-4">
          {selectedExam ? (
            <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs overflow-hidden">
              <div className="p-5 border-b border-[#b5d5ef] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#0077b6]" />
                    <h3 className="font-bold text-base text-[#03045e]">
                      {selectedExam.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#2c537a] mt-0.5">
                    Batch: <span className="font-medium text-[#03045e]">{targetBatch?.name}</span> · Pass Marks: {selectedExam.passMarks}/{selectedExam.totalMarks}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {savedSuccess && (
                    <span className="flex items-center gap-1 text-emerald-800 font-semibold text-xs">
                      <Check className="w-4 h-4" />
                      <span>Grades Saved!</span>
                    </span>
                  )}
                  <button
                    onClick={handleSaveGrades}
                    className="flex items-center gap-1.5 bg-[#03045e] hover:bg-[#02023a] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Gradebook</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#cde4f7] text-[#03045e] border-b border-[#9ec5ea] font-semibold">
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4 w-28 text-center">Marks Obtained</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4">Instructor Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3dcf2]">
                  {enrolledStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#4a75a0]">
                        No active students in this batch to grade.
                      </td>
                    </tr>
                  ) : (
                    enrolledStudents.map((student) => {
                      const marks = marksState[student.id]?.marks || 0;
                      const feedback = marksState[student.id]?.feedback || '';
                      const grade = calculateGrade(marks, selectedExam.totalMarks);
                      const isPassed = marks >= selectedExam.passMarks;

                      return (
                        <tr key={student.id} className="hover:bg-[#d4e7f7] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#03045e]">
                            {student.studentRoll}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#03045e]">{student.name}</div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <input
                              type="number"
                              min={0}
                              max={selectedExam.totalMarks}
                              value={marks}
                              onChange={(e) =>
                                setMarksState((prev) => ({
                                  ...prev,
                                  [student.id]: {
                                    ...prev[student.id],
                                    marks: Number(e.target.value),
                                  },
                                }))
                              }
                              className="w-20 px-2 py-1 text-center font-mono font-bold text-xs rounded border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                                isPassed
                                  ? 'bg-[#c8e8d8] text-emerald-900 border border-emerald-300'
                                  : 'bg-rose-100 text-rose-900 border border-rose-300'
                              }`}
                            >
                              {grade}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              placeholder="e.g. Excellent algorithms logic..."
                              value={feedback}
                              onChange={(e) =>
                                setMarksState((prev) => ({
                                  ...prev,
                                  [student.id]: {
                                    ...prev[student.id],
                                    feedback: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-2.5 py-1 text-xs rounded border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] p-12 text-center text-[#4a75a0]">
              Select an exam from the left to view and edit student gradebook records.
            </div>
          )}
        </div>
      </div>

      {/* Create Exam Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs flex justify-center items-start sm:items-center">
          <div className="relative bg-[#deedf9] rounded-xl shadow-2xl max-w-lg w-full border border-[#9ec5ea] my-auto max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#03045e] text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 border-b border-[#0077b6]/30">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-300" />
                <h3 className="font-bold text-sm">Schedule New Examination</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-blue-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-5 sm:p-6 space-y-4 text-xs text-[#1c446c] overflow-y-auto flex-1 overscroll-contain">
              <div>
                <label className="block font-medium mb-1 text-[#03045e]">Exam Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Evaluation: System Architecture"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#03045e]">Academic Batch *</label>
                <select
                  required
                  value={newBatchId}
                  onChange={(e) => setNewBatchId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                >
                  {myBatches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.batchCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-[#03045e]">Exam Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as Exam['type'])}
                    className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                  >
                    <option value="Quiz">Quiz</option>
                    <option value="Midterm">Midterm</option>
                    <option value="Final">Final</option>
                    <option value="Lab Test">Lab Test</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-[#03045e]">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-[#03045e]">Total Marks</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={newTotalMarks}
                    onChange={(e) => setNewTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-[#03045e]">Pass Marks</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={newTotalMarks}
                    value={newPassMarks}
                    onChange={(e) => setNewPassMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#b5d5ef]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 font-semibold text-[#1c446c] hover:bg-[#cfe4f6] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-[#03045e] hover:bg-[#02023a] text-white rounded-lg transition-colors shadow-xs"
                >
                  Create Examination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
