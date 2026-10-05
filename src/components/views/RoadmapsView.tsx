import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import {
  Milestone,
  CheckCircle2,
  Circle,
  BookOpen,
  Users,
  Check,
} from 'lucide-react';

export const RoadmapsView: React.FC = () => {
  const {
    roadmaps,
    courses,
    students,
    studentTopicProgress,
    toggleTopicCompletion,
    currentUser,
  } = useIMS();

  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>(
    roadmaps[0]?.id || ''
  );

  // If student logged in, select themselves, else first active student
  const activeStudents = students.filter((s) => !s.deletedAt);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    currentUser.role === 'STUDENT'
      ? currentUser.associatedId || activeStudents[0]?.id || ''
      : activeStudents[0]?.id || ''
  );

  const selectedRoadmap = roadmaps.find((r) => r.id === selectedRoadmapId);
  const targetCourse = courses.find((c) => c.id === selectedRoadmap?.courseId);
  const targetStudent = students.find((s) => s.id === selectedStudentId);

  // Calculate student's progress for this roadmap
  const topics = selectedRoadmap?.topics || [];
  const completedCount = topics.filter((t) => {
    const prog = studentTopicProgress.find(
      (p) => p.studentId === selectedStudentId && p.topicId === t.id
    );
    return Boolean(prog?.isCompleted);
  }).length;

  const progressPercentage =
    topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#03045e] tracking-tight">
            Novum Labs Curriculum Roadmaps & Syllabus Progress
          </h1>
          <p className="text-xs text-[#284f76]">
            Competency milestones, week-by-week module tracking, and student learning achievement percentages
          </p>
        </div>

        {/* Roadmap selector */}
        <select
          value={selectedRoadmapId}
          onChange={(e) => setSelectedRoadmapId(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-xs font-semibold text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6] self-start sm:self-auto"
        >
          {roadmaps.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </div>

      {/* Progress Overview Card */}
      {selectedRoadmap && (
        <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold text-[#0077b6] uppercase">
                {targetCourse?.code} · {targetCourse?.title}
              </div>
              <h2 className="text-base font-bold text-[#03045e] mt-0.5">
                {selectedRoadmap.title}
              </h2>
              {selectedRoadmap.description && (
                <p className="text-xs text-[#2c537a] mt-1 max-w-xl">
                  {selectedRoadmap.description}
                </p>
              )}
            </div>

            {/* Student Selector for Progress */}
            {currentUser.role !== 'STUDENT' && (
              <div className="bg-[#cfe4f6] p-3 rounded-lg border border-[#a6ceee] flex items-center gap-3">
                <Users className="w-4 h-4 text-[#0077b6]" />
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-[#2c537a]">
                    Tracking Student:
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="text-xs font-bold text-[#03045e] bg-transparent focus:outline-none cursor-pointer"
                  >
                    {activeStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.studentRoll})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar Container */}
          <div className="space-y-1.5 pt-2 border-t border-[#b5d5ef]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#1c446c]">
                Curriculum Milestone Completion ({targetStudent?.name || 'Selected Student'}):
              </span>
              <span className="font-mono font-bold text-[#03045e]">
                {completedCount} of {topics.length} topics ({progressPercentage}%)
              </span>
            </div>
            <div className="h-3 w-full bg-[#cfe4f6] rounded-full overflow-hidden border border-[#a6ceee]">
              <div
                className="h-full bg-gradient-to-r from-[#0077b6] to-[#00b4d8] rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Week-by-Week Topics Timeline */}
      <div className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#b5d5ef]">
          <div className="flex items-center gap-2">
            <Milestone className="w-5 h-5 text-[#0077b6]" />
            <h3 className="font-bold text-sm text-[#03045e]">
              Weekly Topic Roadmap Modules
            </h3>
          </div>
          <span className="text-xs text-[#2c537a]">
            {currentUser.role === 'ADMIN' || currentUser.role === 'TEACHER'
              ? 'Click to toggle topic completion for selected student'
              : 'Interactive student learning status'}
          </span>
        </div>

        <div className="space-y-3">
          {topics.map((topic) => {
            const isCompleted = studentTopicProgress.some(
              (p) => p.studentId === selectedStudentId && p.topicId === topic.id && p.isCompleted
            );
            const canToggle = currentUser.role === 'ADMIN' || currentUser.role === 'TEACHER';

            return (
              <div
                key={topic.id}
                onClick={() => {
                  if (canToggle && selectedStudentId) {
                    toggleTopicCompletion(selectedStudentId, topic.id, !isCompleted);
                  }
                }}
                className={`p-4 rounded-xl border transition-all ${
                  canToggle ? 'cursor-pointer' : ''
                } ${
                  isCompleted
                    ? 'bg-[#c8e8d8] border-emerald-300'
                    : 'bg-[#cfe4f6] border-[#a6ceee] hover:bg-[#bdddf5]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-800" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#4a75a0]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#b5d7f3] text-[#03045e]">
                          Week {topic.weekNumber}
                        </span>
                        <h4
                          className={`font-bold text-xs sm:text-sm ${
                            isCompleted ? 'text-emerald-950 line-through' : 'text-[#03045e]'
                          }`}
                        >
                          {topic.title}
                        </h4>
                      </div>
                      {topic.description && (
                        <p className="text-xs text-[#2c537a] mt-1">
                          {topic.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-200 text-emerald-950'
                        : 'bg-[#b5d7f3] text-[#1c446c]'
                    }`}
                  >
                    {isCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
