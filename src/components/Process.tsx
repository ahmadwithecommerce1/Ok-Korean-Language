interface ProcessProps {
  onStartProcess: () => void;
}

const STEPS = [
  {
    step: '01',
    korean: '레벨 진단 테스트',
    title: 'Free Diagnostic Assessment',
    description:
      'A relaxed 15-minute 1-on-1 video evaluation with a Seoul educator to map your exact speaking, listening, and Hangul reading level.',
  },
  {
    step: '02',
    korean: '맞춤형 학습 설계',
    title: 'Personalized Roadmap',
    description:
      'We tailor your cohort match, syllabus targets, and TOPIK timeline based on whether your focus is career, travel, or university admission.',
  },
  {
    step: '03',
    korean: '실전 몰입형 수업',
    title: 'Live Immersion Cohorts',
    description:
      'Engage in dynamic small-batch classes (capped at 5) where 80%+ of time is spent speaking, debating, and roleplaying in Korean.',
  },
  {
    step: '04',
    korean: '공인 인증 및 유창성',
    title: 'TOPIK Certification',
    description:
      'Pass official TOPIK exams with targeted mock testing and achieve effortless, accent-free spoken confidence that lasts a lifetime.',
  },
];

export function Process({ onStartProcess }: ProcessProps) {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8E8E93] font-medium mb-3">
              <span>Roadmap</span>
              <span className="text-[#3A3A3A]">·</span>
              <span className="text-[#D2F865]">Methodology</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-white text-balance">
              Our Proven Process.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#8E8E93] max-w-md leading-relaxed">
            From complete beginner to certified fluency through a tested, milestone-based academic
            framework.
          </p>
        </div>

        {/* 4-Step Horizontal Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#111111]/80 border border-[#1E1E1E] hover:border-[#383838] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Step Number + Korean Hint */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#181818] border border-[#262626] flex items-center justify-center font-mono text-base font-bold text-[#D2F865] group-hover:bg-[#D2F865] group-hover:text-[#0A0A0A] transition-all duration-300">
                    {item.step}
                  </div>
                  <span className="text-[11px] font-medium text-[#666666]">{item.korean}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white tracking-tight mb-3 group-hover:text-[#D2F865] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-8 pt-4 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] text-[#666666]">
                <span>Phase {idx + 1} of 4</span>
                <span className="text-[#D2F865] opacity-0 group-hover:opacity-100 transition-opacity">
                  Guided
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onStartProcess}
            className="inline-flex items-center justify-center px-7 py-3 text-xs font-semibold text-[#0A0A0A] bg-[#D2F865] rounded-full hover:bg-[#c2e855] transition-all duration-200 hover:scale-[1.02] shadow-[0_0_25px_rgba(210,248,101,0.25)] cursor-pointer"
          >
            <span>Start Phase 01: Free Level Test</span>
          </button>
        </div>
      </div>
    </section>
  );
}
