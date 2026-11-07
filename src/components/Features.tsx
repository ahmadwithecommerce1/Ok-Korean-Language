import { Users, Award, BookOpen, Sparkles, MessageSquareCode, Compass, ArrowRight } from 'lucide-react';

interface FeaturesProps {
  onExploreMethod: () => void;
}

const FEATURES = [
  {
    icon: Users,
    koreanTag: '원어민 전문 강사진',
    title: 'Native Korean Teachers',
    description:
      'Certified language educators holding advanced degrees from Seoul National and Yonsei universities. Zero non-native or casual tutors.',
    metric: '100% Native Seoul Accent',
  },
  {
    icon: Award,
    koreanTag: 'TOPIK 공식 연계 커리큘럼',
    title: 'TOPIK-Aligned Curriculum',
    description:
      'Structured 6-tier roadmap covering TOPIK I through TOPIK VI with targeted mock evaluations, grammar formulas, and essay feedback.',
    metric: '98.4% First-Attempt Pass Rate',
  },
  {
    icon: MessageSquareCode,
    koreanTag: '소수 정예 실시간 수업',
    title: 'Live Small-Batch Classes',
    description:
      'Strictly capped at five students per cohort. Guarantees each learner at least 35+ minutes of active speaking practice every 75-minute class.',
    metric: 'Max 5 Students / Cohort',
  },
  {
    icon: BookOpen,
    koreanTag: '훈민정음 원리 기반',
    title: 'Hangul-First Methodology',
    description:
      'Master the phonetic science of Hangul vowels and consonants in 14 days. We eliminate misleading Romanization crutches from day one.',
    metric: '14-Day Reading Mastery',
  },
  {
    icon: Compass,
    koreanTag: '살아있는 한국 문화 몰입',
    title: 'Cultural Immersion Sessions',
    description:
      'Decode unscripted K-Drama dialogues, master honorific hierarchies (존댓말 vs 반말), and navigate real Korean social and business etiquette.',
    metric: 'Weekly Live Cultural Labs',
  },
  {
    icon: Sparkles,
    koreanTag: '24시간 AI 발음 트레이너',
    title: '24/7 AI Speaking Partner',
    description:
      'Interactive phoneme-level voice feedback trained on native Seoul acoustic data to refine batchim pronunciation and sentence intonation.',
    metric: 'Instant Phoneme Scoring',
  },
];

export function Features({ onExploreMethod }: FeaturesProps) {
  return (
    <section id="method" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8E8E93] font-medium mb-3">
              <span>Features</span>
              <span className="text-[#3A3A3A]">·</span>
              <span className="text-[#D2F865]">Packed with Innovation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-white text-balance">
              Engineered for Spoken Fluency.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#8E8E93] max-w-md leading-relaxed">
            Every layer of our methodology is optimized to transition your Korean from silent
            textbook recall into instantaneous, confident conversation.
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-3xl bg-[#111111]/90 border border-[#1F1F1F] hover:border-[#D2F865]/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Icon + Korean Pill Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#171717] border border-[#282828] flex items-center justify-center text-[#D2F865] group-hover:scale-110 group-hover:bg-[#D2F865]/10 transition-all duration-300">
                      <Icon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-[11px] font-medium text-[#7A7A7A] group-hover:text-[#A5A5A5] transition-colors">
                      {feat.koreanTag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold tracking-tight text-[#F5F5F5] mb-3 group-hover:text-white transition-colors">
                    {feat.title}
                  </h3>

                  {/* 2-Line Description */}
                  <p className="text-sm text-[#8E8E93] leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                {/* Bottom Metric */}
                <div className="pt-4 border-t border-[#1C1C1C] flex items-center justify-between text-xs text-[#6E6E6E] group-hover:text-[#D2F865] transition-colors">
                  <span className="font-medium tracking-wide">{feat.metric}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner trigger */}
        <div className="mt-12 text-center">
          <button
            onClick={onExploreMethod}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8E8E93] hover:text-[#D2F865] transition-colors cursor-pointer py-2 px-4 rounded-full border border-transparent hover:border-[#222222]"
          >
            <span>Learn more about the HanGuel Spoken Acquisition Framework</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
