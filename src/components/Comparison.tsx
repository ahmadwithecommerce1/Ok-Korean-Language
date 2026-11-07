import { Check, X } from 'lucide-react';

const COMPARISON_ROWS = [
  {
    feature: 'Instructor Credentials',
    hanguel: '100% Certified Native Teachers from Seoul & Yonsei',
    others: 'Untrained tutors, community speakers, or non-natives',
  },
  {
    feature: 'Cohort Size & Speaking Time',
    hanguel: 'Strictly Max 5 Students (35+ min active speaking each)',
    others: '20–30 student lecture halls (under 3 min speaking time)',
  },
  {
    feature: 'Curriculum & TOPIK Alignment',
    hanguel: 'Systematic 6-tier progression mapped to NIIED standards',
    others: 'Disjointed textbook chapters without clear exam milestones',
  },
  {
    feature: 'Between-Class Speaking Feedback',
    hanguel: '24/7 AI Phoneme Trainer + weekly tutor voice reviews',
    others: 'Self-graded paper exercises with zero acoustic feedback',
  },
  {
    feature: 'Cultural & Colloquial Immersion',
    hanguel: 'Real K-Drama analysis, modern slang, honorific nuances',
    others: 'Outdated formal textbook dialogues from decades ago',
  },
  {
    feature: 'Scheduling Flexibility',
    hanguel: 'Free batch rescheduling & instant cloud class recordings',
    others: 'Missed classes are permanently forfeited with no make-ups',
  },
];

export function Comparison() {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8E8E93] font-medium mb-3">
            <span>The Difference</span>
            <span className="text-[#3A3A3A]">·</span>
            <span className="text-[#D2F865]">Ok-Centre vs The Rest</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-white text-balance mb-4">
            Why Discerning Learners Choose Ok-Centre.
          </h2>
          <p className="text-sm sm:text-base text-[#8E8E93] leading-relaxed">
            See how our Seoul-born immersion methodology compares to conventional language apps
            and crowded offline classrooms.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="rounded-3xl border border-[#222222] bg-[#101010] overflow-hidden shadow-2xl">
          {/* Header Row */}
          <div className="grid grid-cols-12 p-6 sm:p-8 bg-[#141414] border-b border-[#242424] text-xs uppercase tracking-wider font-semibold">
            <div className="col-span-4 sm:col-span-4 text-[#8E8E93]">Core Dimension</div>
            <div className="col-span-4 sm:col-span-4 text-[#D2F865] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D2F865]" />
              <span>Ok-Centre</span>
            </div>
            <div className="col-span-4 sm:col-span-4 text-[#7A7A7A]">Conventional Academies</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#1A1A1A]">
            {COMPARISON_ROWS.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 p-6 sm:p-8 hover:bg-[#131313] transition-colors items-center gap-2 sm:gap-4 text-xs sm:text-sm"
              >
                {/* Feature Column */}
                <div className="col-span-12 sm:col-span-4 font-semibold text-white mb-2 sm:mb-0">
                  {row.feature}
                </div>

                {/* HanGuel Column */}
                <div className="col-span-6 sm:col-span-4 text-[#E5E5E5] flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#D2F865]/15 text-[#D2F865] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="font-medium">{row.hanguel}</span>
                </div>

                {/* Others Column */}
                <div className="col-span-6 sm:col-span-4 text-[#737373] flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#202020] text-[#7A7A7A] flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span>{row.others}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
