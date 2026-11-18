import { useEffect, useState } from 'react';
import { X, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import logoImage from '../assets/logo.png';

interface WelcomeAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTrial: () => void;
}

export function WelcomeAnnouncementModal({
  isOpen,
  onClose,
  onBookTrial,
}: WelcomeAnnouncementModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small tick to ensure mounting before transition kicks in
      const t = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 transition-all duration-500 ease-out ${
        visible ? 'bg-black/75 backdrop-blur-md opacity-100' : 'bg-transparent backdrop-blur-0 opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
      aria-labelledby="welcome-modal-heading"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Container Card with Glassmorphism & Glowing Neon Lime Border */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md rounded-3xl bg-black/60 backdrop-blur-xl border border-[#a3e635]/60 p-6 sm:p-8 shadow-[0_0_50px_rgba(163,230,53,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] text-white overflow-hidden transition-all duration-500 ease-out transform ${
          visible ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-4 opacity-0'
        }`}
      >
        {/* Ambient Radial Lime Glows */}
        <div
          className="absolute -top-20 -right-20 w-44 h-44 bg-[#a3e635]/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -left-20 w-44 h-44 bg-[#a3e635]/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Sleek Close 'X' Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer z-10 hover:scale-105 active:scale-95"
          aria-label="Close welcome announcement"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge with Official Logo */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <img
              src="/logo.png"
              alt="OK Korean Language Center Logo"
              className="w-11 h-11 rounded-full object-contain bg-white/10 p-0.5 border border-[#a3e635]/40 shadow-[0_0_15px_rgba(163,230,53,0.4)]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = logoImage;
              }}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#a3e635] rounded-full border-2 border-black flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
            </span>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#a3e635]/15 border border-[#a3e635]/30 text-[11px] font-semibold text-[#a3e635] tracking-wide uppercase">
              <Sparkles className="w-3 h-3 text-[#a3e635]" />
              Official Announcement
            </span>
            <p className="text-[11px] font-mono text-zinc-400 tracking-wider mt-0.5">
              OK KOREAN LANGUAGE CENTER
            </p>
          </div>
        </div>

        {/* Bold Glowing Heading */}
        <h2
          id="welcome-modal-heading"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight drop-shadow-[0_0_20px_rgba(163,230,53,0.7)]"
        >
          Admissions <span className="text-[#a3e635] underline decoration-[#a3e635]/40 decoration-wavy underline-offset-4">Open!</span>
        </h2>

        {/* Subtitle Message */}
        <p className="text-zinc-300 text-sm sm:text-base font-medium mb-5 leading-relaxed">
          Join OK Korean Language Center today.
        </p>

        {/* Bullet Points with Star Icon */}
        <div className="space-y-3 mb-7 bg-white/[0.03] border border-white/5 rounded-2xl p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="text-[#a3e635] text-base leading-none select-none drop-shadow-[0_0_8px_rgba(163,230,53,0.9)]">
              ★
            </span>
            <span className="text-sm text-zinc-200 font-medium">
              18+ Years of Excellence
            </span>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#a3e635] text-base leading-none select-none drop-shadow-[0_0_8px_rgba(163,230,53,0.9)]">
              ★
            </span>
            <span className="text-sm text-zinc-200 font-medium">
              Learn from Expert Native Teachers
            </span>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#a3e635] text-base leading-none select-none drop-shadow-[0_0_8px_rgba(163,230,53,0.9)]">
              ★
            </span>
            <span className="text-sm text-zinc-200 font-medium">
              TOPIK Preparation &amp; Visa Guidance
            </span>
          </div>
        </div>

        {/* Call To Action (CTA) Button */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onClose();
              onBookTrial();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#a3e635] hover:bg-[#bbf451] active:bg-[#92cf2d] text-black font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(163,230,53,0.6)] hover:shadow-[0_0_40px_rgba(163,230,53,0.85)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Book a Free Trial</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <p className="text-center text-[11px] text-zinc-400">
            Limited seats available for the upcoming cohort.
          </p>
        </div>
      </div>
    </div>
  );
}
