import React, { useState } from 'react';
import { Student, Guardian } from '../../types/ims';
import { useIMS } from '../../context/IMSContext';
import { X, UserPlus, BookOpen } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editStudent?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  editStudent,
}) => {
  const { addStudent, updateStudent, guardians } = useIMS();

  const existingGuardian = editStudent
    ? guardians.find((g) => g.id === editStudent.guardianId)
    : undefined;

  // Student form state
  const [name, setName] = useState(editStudent?.name || '');
  const [studentRoll, setStudentRoll] = useState(editStudent?.studentRoll || '');
  const [classGrade, setClassGrade] = useState(editStudent?.classGrade || 'Class 10');
  const [email, setEmail] = useState(editStudent?.email || '');
  const [phone, setPhone] = useState(editStudent?.phone || '');
  const [gender, setGender] = useState(editStudent?.gender || 'Male');
  const [address, setAddress] = useState(editStudent?.address || '');

  // Guardian form state (Occupation removed as per request)
  const [guardianName, setGuardianName] = useState(existingGuardian?.name || '');
  const [guardianPhone, setGuardianPhone] = useState(existingGuardian?.phone || '');
  const [guardianRelation, setGuardianRelation] = useState<Guardian['relationship']>(
    existingGuardian?.relationship || 'Father'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editStudent) {
      updateStudent(
        editStudent.id,
        {
          name,
          studentRoll,
          classGrade,
          email,
          phone,
          gender,
          address,
        },
        {
          name: guardianName,
          phone: guardianPhone,
          relationship: guardianRelation,
        }
      );
    } else {
      addStudent(
        {
          name,
          studentRoll,
          classGrade,
          email,
          phone,
          gender,
          address,
          status: 'ACTIVE',
        },
        {
          name: guardianName,
          phone: guardianPhone,
          relationship: guardianRelation,
        }
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center items-start p-3 sm:p-5 pt-3 sm:pt-6 pb-12">
      {/* Modal Dialog Container - anchored safely from top without clipping */}
      <div className="relative bg-[#deedf9] rounded-xl shadow-2xl max-w-xl w-full border border-[#9ec5ea] flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header - Always Fixed & Fully Visible at top */}
        <div className="bg-[#03045e] text-white px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs border-b border-[#0077b6]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0077b6] flex items-center justify-center text-white shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white leading-tight">
                {editStudent ? 'Edit Student Profile' : 'Enroll New Student'}
              </h3>
              <p className="text-[11px] text-blue-200">
                Novum Labs Admissions & Student Register
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs text-[#1c446c] overflow-y-auto flex-1 overscroll-contain">
          
          {/* Section: Student Information */}
          <div className="space-y-3">
            <div className="font-bold text-xs text-[#03045e] uppercase tracking-wider border-b border-[#b5d5ef] pb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#0077b6]" />
                Student Personal & Academic Details
              </span>
              <span className="text-[10px] text-[#0077b6] font-normal lowercase">* required fields</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-[#03045e]">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aravind Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#03045e]">Student Roll (Auto if empty)</label>
                <input
                  type="text"
                  placeholder="e.g. NL-2026-105"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-2 focus:ring-[#0077b6] font-mono"
                />
              </div>

              {/* Class field added as requested */}
              <div>
                <label className="block font-semibold mb-1 text-[#03045e]">Class *</label>
                <input
                  list="class-list-options"
                  required
                  type="text"
                  placeholder="e.g. Class 10, Class 12, etc."
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                />
                <datalist id="class-list-options">
                  <option value="Class 6" />
                  <option value="Class 7" />
                  <option value="Class 8" />
                  <option value="Class 9" />
                  <option value="Class 10" />
                  <option value="Class 11" />
                  <option value="Class 12" />
                  <option value="BCA / Diploma" />
                  <option value="B.Tech / B.Sc" />
                  <option value="Competitive Exam / Foundation" />
                </datalist>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#03045e]">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765-12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#03045e]">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="student@novumlabs.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#03045e]">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#03045e]">Residential Address</label>
              <input
                type="text"
                placeholder="e.g. 102 Cyber Park Road, Block 4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
              />
            </div>
          </div>

          {/* Section: Guardian Information (Occupation removed as requested) */}
          <div className="space-y-3 pt-2">
            <div className="font-bold text-xs text-[#03045e] uppercase tracking-wider border-b border-[#b5d5ef] pb-1">
              Guardian Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-[#03045e]">Guardian Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Patel"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#03045e]">Relationship</label>
                <select
                  value={guardianRelation}
                  onChange={(e) => setGuardianRelation(e.target.value as Guardian['relationship'])}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Legal Guardian</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1 text-[#03045e]">Guardian Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765-67890"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#9ec5ea] bg-[#eaf4fd] text-[#03045e] focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                />
              </div>
            </div>
          </div>

          {/* Action buttons (Sticky inside modal at bottom) */}
          <div className="sticky bottom-0 bg-[#deedf9] pt-3 pb-1 border-t border-[#b5d5ef] flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#1c446c] hover:bg-[#cfe4f6] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#03045e] hover:bg-[#02023a] text-white rounded-lg transition-colors shadow-xs"
            >
              {editStudent ? 'Save Changes' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
