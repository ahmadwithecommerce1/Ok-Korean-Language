import { useState, type FormEvent } from 'react';
import { X, CheckCircle2, Calendar, Clock, User, Mail, Sparkles, ArrowRight } from 'lucide-react';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCourse?: string;
}

export function TrialModal({ isOpen, onClose, preselectedCourse }: TrialModalProps) {
  const [level, setLevel] = useState('Complete Beginner (Zero knowledge)');
  const [goal, setGoal] = useState('Conversational Fluency & Travel');
  const [timeSlot, setTimeSlot] = useState('Weekday Evening (KST / Global friendly)');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName || !email) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      console.error('Web3Forms submit error:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0F0F0F] border border-[#262626] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Glow */}
        <div
          className="absolute -top-24 -right-24 w-60 h-60 bg-[#D2F865]/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[#181818] border border-[#2B2B2B] text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#2D2D2D] text-xs text-[#E5E5E5] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D2F865]" />
              <span>15-Minute Diagnostic Session</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Book Your Free Trial Class
            </h3>
            <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed mb-6">
              Connect 1-on-1 with a Seoul-certified educator. We evaluate your baseline, identify
              phonetic blind spots, and map your path to fluency. Zero obligations.
            </p>

            {preselectedCourse && (
              <div className="mb-5 p-3 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-between text-xs">
                <span className="text-[#8E8E93]">Interested in:</span>
                <span className="font-semibold text-[#D2F865]">{preselectedCourse}</span>
              </div>
            )}

            <form
              action="https://api.web3forms.com/submit"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-4 text-xs sm:text-sm"
            >
              <input type="hidden" name="access_key" value="ed03fc13-272f-4ea1-b292-b56df97fc40e" />
              <input type="hidden" name="subject" value="New Free Trial Booking - OK Korean Language Center" />
              <input type="hidden" name="time_window" value={timeSlot} />
              {preselectedCourse && <input type="hidden" name="course" value={preselectedCourse} />}

              {/* Level Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#CCCCCC] mb-1.5">
                  Current Korean Proficiency
                </label>
                <select
                  name="proficiency"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white focus:outline-none focus:border-[#D2F865] transition-colors"
                >
                  <option value="Complete Beginner (Zero knowledge)">
                    Complete Beginner (Cannot read Hangul yet)
                  </option>
                  <option value="Can Read Hangul (Limited vocabulary)">
                    Elementary (Can read Hangul, know basic greetings)
                  </option>
                  <option value="Intermediate (Simple conversations, TOPIK 2-3)">
                    Intermediate (Conversational, study grammar)
                  </option>
                  <option value="Advanced (TOPIK 4-6 / Business candidate)">
                    Advanced (Focusing on TOPIK II, career or university)
                  </option>
                </select>
              </div>

              {/* Learning Goal */}
              <div>
                <label className="block text-xs font-semibold text-[#CCCCCC] mb-1.5">
                  Primary Learning Objective
                </label>
                <select
                  name="objective"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white focus:outline-none focus:border-[#D2F865] transition-colors"
                >
                  <option value="Conversational Fluency & Travel">
                    Conversational Fluency & Travel in South Korea
                  </option>
                  <option value="K-Drama, K-Pop & Subtitle-Free Immersion">
                    K-Drama, Music & Subtitle-Free Immersion
                  </option>
                  <option value="Official TOPIK I or II Certification">
                    Official TOPIK I or II Examination Certification
                  </option>
                  <option value="Study Abroad / GKS Scholarship / Korean University">
                    Korean University Admission / GKS Scholarship
                  </option>
                  <option value="Business, Corporate Career & Workplace Korean">
                    Corporate Career & Business Korean in Seoul
                  </option>
                </select>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-xs font-semibold text-[#CCCCCC] mb-1.5">
                  Preferred Time Window
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Weekday Morning',
                    'Weekday Evening',
                    'Saturday Cohort',
                    'Sunday Cohort',
                  ].map((time) => (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setTimeSlot(time)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        timeSlot === time
                          ? 'bg-[#1C1C1C] border-[#D2F865] text-[#D2F865] font-semibold'
                          : 'bg-[#141414] border-[#262626] text-[#8E8E93] hover:text-white'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#CCCCCC] mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Minji Park"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white focus:outline-none focus:border-[#D2F865] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CCCCCC] mb-1.5">
                    Email for Zoom Link
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white focus:outline-none focus:border-[#D2F865] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#D2F865] hover:bg-[#c2e855] text-[#0A0A0A] font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-[0_0_25px_rgba(210,248,101,0.25)] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span>{isSubmitting ? 'Sending Reservation...' : 'Confirm Free 15-Minute Trial'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-[#666666] text-center mt-2">
                  No credit card required · Instant calendar invitation sent via email
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Success Screen */
          <div className="text-center py-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#D2F865]/15 border border-[#D2F865]/30 text-[#D2F865] flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(210,248,101,0.2)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono text-[#D2F865] uppercase tracking-wider">
              Diagnostic Confirmed
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-1 mb-2">
              반갑습니다, {fullName}!
            </h3>
            <p className="text-sm text-[#8E8E93] leading-relaxed max-w-sm mx-auto mb-6">
              Your free diagnostic class reservation has been scheduled with a Seoul-certified
              native instructor.
            </p>

            <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] text-left text-xs space-y-2 mb-6 max-w-sm mx-auto">
              <div className="flex items-center gap-2 text-[#CCCCCC]">
                <Calendar className="w-4 h-4 text-[#D2F865]" />
                <span>Selected Window: {timeSlot}</span>
              </div>
              <div className="flex items-center gap-2 text-[#CCCCCC]">
                <Clock className="w-4 h-4 text-[#D2F865]" />
                <span>Format: 15-Min Live Video via Zoom</span>
              </div>
              <div className="flex items-center gap-2 text-[#CCCCCC]">
                <Mail className="w-4 h-4 text-[#D2F865]" />
                <span>Calendar Invite sent to: {email}</span>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="px-6 py-2.5 rounded-full bg-[#202020] text-white hover:bg-[#282828] border border-[#333333] text-xs font-semibold transition-colors cursor-pointer"
            >
              Back to Centre Overview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
