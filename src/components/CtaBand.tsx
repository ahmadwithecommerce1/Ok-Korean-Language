import { ArrowUpRight, Sparkles } from 'lucide-react';

interface CtaBandProps {
  onBookTrial: () => void;
}

export function CtaBand({ onBookTrial }: CtaBandProps) {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-10 sm:p-16 lg:p-20 bg-gradient-to-b from-[#141414] to-[#0D0D0D] border border-[#222222] text-center overflow-hidden shadow-2xl">
          {/* Subtle accent glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#D2F865]/[0.06] blur-[120px] pointer-events-none rounded-full"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] text-xs text-[#E5E5E5] mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D2F865]" />
              <span className="uppercase tracking-[0.16em] text-[11px] font-medium text-[#C0C0C0]">
                Immediate Spoken Immersion
              </span>
            </div>

            {/* Massive Heading */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-white leading-[1.05] mb-6 text-balance">
              Ready to Speak Korean with Real Confidence?
            </h2>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#9E9E9E] max-w-xl leading-relaxed mb-10 text-balance">
              Stop memorizing robotic phrases in silence. Experience a 15-minute live diagnostic
              session with a Seoul-certified native educator. Free, with zero obligations.
            </p>

            {/* Primary Action Button */}
            <button
              onClick={onBookTrial}
              className="group inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-[#0A0A0A] bg-[#D2F865] rounded-full hover:bg-[#c2e855] transition-all duration-200 hover:scale-[1.03] shadow-[0_0_35px_rgba(210,248,101,0.35)] cursor-pointer whitespace-nowrap"
            >
              <span>Book Your Free Trial Class</span>
              <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            {/* Trust reassurance */}
            <div className="mt-6 text-xs text-[#6E6E6E]">
              No credit card required · 100% Online via Zoom/Classroom · Instant placement report
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
