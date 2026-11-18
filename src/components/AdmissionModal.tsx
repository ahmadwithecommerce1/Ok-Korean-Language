import { useState, useRef, type FormEvent } from 'react';
import {
  X,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  GraduationCap,
  Users,
  FileText,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { submitAdmissionRequest } from '../utils/admissionFirestore';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BATCH_OPTIONS = ['Morning', 'Evening'];

export function AdmissionModal({ isOpen, onClose }: AdmissionModalProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [fullNameEnglish, setFullNameEnglish] = useState('');
  const [koreanName, setKoreanName] = useState('');
  const [fatherGuardianName, setFatherGuardianName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [studentContactPhone, setStudentContactPhone] = useState('');
  const [parentWhatsapp, setParentWhatsapp] = useState('');
  const [assignedBatch, setAssignedBatch] = useState('Morning');
  const [enrollmentDate, setEnrollmentDate] = useState(todayStr);
  const [academicNotes, setAcademicNotes] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submittingRef = useRef(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setFullNameEnglish('');
    setKoreanName('');
    setFatherGuardianName('');
    setEmailAddress('');
    setStudentContactPhone('');
    setParentWhatsapp('');
    setAssignedBatch('Morning');
    setEnrollmentDate(new Date().toISOString().split('T')[0]);
    setAcademicNotes('');
    setWhatsappOptIn(false);
    setErrorMessage(null);
  };

  const handleClose = () => {
    setSubmitted(false);
    setErrorMessage(null);
    onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submittingRef.current || isSubmitting || submitted) return;

    setErrorMessage(null);

    if (
      !fullNameEnglish.trim() ||
      !fatherGuardianName.trim() ||
      !studentContactPhone.trim() ||
      !parentWhatsapp.trim() ||
      !enrollmentDate
    ) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!whatsappOptIn) {
      setErrorMessage('Please agree to receive WhatsApp notifications to proceed.');
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      await submitAdmissionRequest({
        fullName: fullNameEnglish,
        koreanName,
        fatherName: fatherGuardianName,
        email: emailAddress,
        contactNumber: studentContactPhone,
        parentWhatsApp: parentWhatsapp,
        batch: assignedBatch,
        enrollmentDate,
        notes: academicNotes,
        whatsappOptIn,
      });

      setSubmitted(true);
      resetForm();
    } catch (err: any) {
      console.error('Firestore admission submission error:', err);
      setErrorMessage(
        err?.message || 'Unable to submit application right now. Please try again.'
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-[#0F0F0F] border border-[#262626] p-5 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Accent Glow */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 bg-[#D2F865]/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-full bg-[#181818] border border-[#2B2B2B] text-[#A0A0A0] hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Close admission form"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#2D2D2D] text-xs text-[#E5E5E5] mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-[#D2F865]" />
              <span>Official Student Enrollment</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5 pr-8">
              Admission Form
            </h3>
            <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed mb-6">
              Complete your student details below to submit your official admission request to OK Korean Language Center.
            </p>

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs sm:text-sm text-red-400 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Row 1: Full Name (English) & Korean Name (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#CCCCCC] mb-1.5">
                    Full Name (English) <span className="text-[#D2F865]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Muhammad Ali"
                      value={fullNameEnglish}
                      onChange={(e) => setFullNameEnglish(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white placeholder-[#555555] focus:outline-none focus:border-[#D2F865] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CCCCCC] mb-1.5">
                    Korean Name <span className="text-[#666666] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                    <input
                      type="text"
                      name="koreanName"
                      placeholder="e.g. 무함마드 알리"
                      value={koreanName}
                      onChange={(e) => setKoreanName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white placeholder-[#555555] focus:outline-none focus:border-[#D2F865] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Father/Guardian Name & Email Address (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#CCCCCC] mb-1.5">
                    Father/Guardian Name <span className="text-[#D2F865]">*</span>
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                    <input
                      type="text"
                      name="fatherName"
                      required
                      placeholder="Father or guardian name"
                      value={fatherGuardianName}
                      onChange={(e) => setFatherGuardianName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white placeholder-[#555555] focus:outline-none focus:border-[#D2F865] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CCCCCC] mb-1.5">
                    Email Address <span className="text-[#666666] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                    <input
                      type="email"
                      name="email"
                      placeholder="student@example.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white placeholder-[#555555] focus:outline-none focus:border-[#D2F865] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Student Contact Phone & Parent WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#CCCCCC] mb-1.5">
                    Student Contact Phone <span className="text-[#D2F865]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                    <input
                      type="tel"
                      name="contactNumber"
                      required
                      placeholder="+92 300 0000000"
                      value={studentContactPhone}
                      onChange={(e) => setStudentContactPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white placeholder-[#555555] focus:outline-none focus:border-[#D2F865] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CCCCCC] mb-1.5">
                    Parent WhatsApp <span className="text-[#D2F865]">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                    <input
                      type="tel"
                      name="parentWhatsApp"
                      required
                      placeholder="+92 300 0000000"
                      value={parentWhatsapp}
                      onChange={(e) => setParentWhatsapp(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white placeholder-[#555555] focus:outline-none focus:border-[#D2F865] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Assigned Batch & Enrollment Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#CCCCCC] mb-1.5">
                    Assigned Batch <span className="text-[#D2F865]">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#666666] absolute left-3 top-3 pointer-events-none" />
                    <select
                      name="batch"
                      value={assignedBatch}
                      onChange={(e) => setAssignedBatch(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white focus:outline-none focus:border-[#D2F865] transition-colors cursor-pointer"
                    >
                      {BATCH_OPTIONS.map((batch) => (
                        <option key={batch} value={batch}>
                          {batch}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CCCCCC] mb-1.5">
                    Enrollment Date <span className="text-[#D2F865]">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#666666] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="date"
                      name="enrollmentDate"
                      required
                      value={enrollmentDate}
                      onChange={(e) => setEnrollmentDate(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white focus:outline-none focus:border-[#D2F865] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Academic Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#CCCCCC] mb-1.5">
                  Academic Notes
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-[#666666] absolute left-3 top-3 pointer-events-none" />
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Prior Korean study experience, EPS-TOPIK goals, or special notes..."
                    value={academicNotes}
                    onChange={(e) => setAcademicNotes(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white placeholder-[#555555] focus:outline-none focus:border-[#D2F865] transition-colors resize-y"
                  />
                </div>
              </div>

              {/* WhatsApp Opt-in Checkbox (Mandatory for Meta Compliance) */}
              <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626]">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="whatsappOptIn"
                    required
                    checked={whatsappOptIn}
                    onChange={(e) => setWhatsappOptIn(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#3A3A3A] bg-[#161616] accent-[#D2F865] shrink-0 cursor-pointer"
                  />
                  <span className="text-xs text-[#CCCCCC] leading-relaxed">
                    I agree to receive attendance alerts, test scores, and fee reminders via WhatsApp from OK Korean Language Center.{' '}
                    <span className="text-[#D2F865]">*</span>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#D2F865] hover:bg-[#c2e855] text-[#0A0A0A] font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-[0_0_25px_rgba(210,248,101,0.25)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-8 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#D2F865]/15 border border-[#D2F865]/30 text-[#D2F865] flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(210,248,101,0.2)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono text-[#D2F865] uppercase tracking-wider">
              Admission Request Received
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2 mb-3">
              Application submitted successfully! Our team will contact you soon.
            </h3>
            <p className="text-xs sm:text-sm text-[#8E8E93] max-w-md mx-auto mb-6">
              Your enrollment application has been securely recorded. An admissions coordinator will review your batch placement and reach out shortly.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="px-7 py-2.5 rounded-full bg-[#D2F865] hover:bg-[#c2e855] text-[#0A0A0A] text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
