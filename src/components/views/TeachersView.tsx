import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { Instructor } from '../../types/ims';
import {
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  CalendarCheck,
  Plus,
  X,
  UserCheck,
} from 'lucide-react';

export const TeachersView: React.FC = () => {
  const { instructors, batches, teacherAttendance, addInstructor } = useIMS();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('Senior Lecturer');
  const [department, setDepartment] = useState('Computer Science & Web');
  const [bio, setBio] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addInstructor({
      name,
      email,
      phone,
      designation,
      department,
      status: 'Active',
      joiningDate: new Date().toISOString().split('T')[0],
      bio: bio.trim() || undefined,
    });

    setIsAddOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setBio('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#03045e] tracking-tight">
            Novum Labs Faculty & Instructor Roster
          </h1>
          <p className="text-xs text-[#284f76]">
            Instructor departments, assigned academic batches, faculty attendance logs, and profile dossiers
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 bg-[#03045e] hover:bg-[#02023a] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((inst) => {
          const assignedBatches = batches.filter((b) => b.instructorId === inst.id);
          const attendanceRecords = teacherAttendance.filter(
            (a) => a.instructorId === inst.id
          );
          const presentDays = attendanceRecords.filter((a) => a.status === 'PRESENT').length;

          return (
            <div
              key={inst.id}
              className="bg-[#deedf9] rounded-xl border border-[#9ec5ea] shadow-xs p-5 space-y-4 hover:border-[#0077b6] hover:bg-[#d6e9f7] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#cfe4f6] text-[#03045e] font-bold text-sm flex items-center justify-center border border-[#9ec5ea]">
                      {inst.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#03045e]">{inst.name}</h3>
                      <div className="text-[11px] text-[#0077b6] font-semibold">
                        {inst.designation}
                      </div>
                    </div>
                  </div>
                  <span className="bg-[#c8e8d8] text-emerald-900 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-300">
                    {inst.status}
                  </span>
                </div>

                <div className="text-[11px] text-[#385e85]">{inst.department}</div>

                <div className="space-y-1 text-xs text-[#1c446c] pt-2 border-t border-[#b5d5ef]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#0077b6]" />
                    <span className="truncate">{inst.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#0077b6]" />
                    <span>{inst.phone}</span>
                  </div>
                </div>

                {/* Assigned Batches Pills */}
                <div className="pt-2">
                  <div className="text-[10px] uppercase font-bold text-[#2c537a] tracking-wider mb-1.5 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-[#0077b6]" />
                    <span>Assigned Batches ({assignedBatches.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {assignedBatches.length === 0 ? (
                      <span className="text-[11px] text-[#4a75a0] italic">No batches assigned.</span>
                    ) : (
                      assignedBatches.map((b) => (
                        <span
                          key={b.id}
                          className="bg-[#cfe4f6] text-[#03045e] text-[10px] font-semibold px-2 py-0.5 rounded border border-[#a6ceee]"
                        >
                          {b.name}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Attendance Record */}
              <div className="pt-3 border-t border-[#b5d5ef] flex items-center justify-between text-[11px] text-[#2c537a] bg-[#cfe4f6] p-2.5 rounded-lg border border-[#a6ceee]">
                <div className="flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-[#0077b6]" />
                  <span>Faculty Presence:</span>
                </div>
                <span className="font-mono font-bold text-[#03045e]">
                  {presentDays} days logged
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Instructor Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs flex justify-center items-start sm:items-center">
          <div className="relative bg-[#deedf9] rounded-xl shadow-2xl max-w-lg w-full border border-[#9ec5ea] my-auto max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#03045e] text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 border-b border-[#0077b6]/30">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-300" />
                <h3 className="font-bold text-sm">Add New Faculty Member</h3>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 sm:p-6 space-y-4 text-xs text-[#1c446c] overflow-y-auto flex-1 overscroll-contain">
              <div>
                <label className="block font-medium mb-1 text-[#03045e]">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Salman Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#03045e]">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="faculty@novumlabs.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#03045e]">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765-12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-[#03045e]">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-[#03045e]">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#03045e]">Biography & Research Focus</label>
                <textarea
                  rows={3}
                  placeholder="Brief specialization, lab expertise, industry certifications..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-1 focus:ring-[#0077b6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#b5d5ef]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 font-semibold text-[#1c446c] hover:bg-[#cfe4f6] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-[#03045e] hover:bg-[#02023a] text-white rounded-lg transition-colors shadow-xs"
                >
                  Add Instructor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
