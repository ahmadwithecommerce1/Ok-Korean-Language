import { ArrowUpRight } from 'lucide-react';
import aboutImage from '../assets/images/about_seoul_academy_1793466116007.jpg';

interface AboutProps {
  onLearnMore: () => void;
}

const STATS = [
  { value: '5,000+', label: 'Global Students Taught', sub: 'Across 48 Countries' },
  { value: '40+', label: 'Certified Native Teachers', sub: 'Seoul & Yonsei Alumni' },
  { value: '98.4%', label: 'TOPIK Exam Pass Rate', sub: 'Levels 1 through 6' },
  { value: '12 Yrs', label: 'Academic Excellence', sub: 'Founded in Seoul' },
];

export function About({ onLearnMore }: AboutProps) {
  return (
    <section id="about" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading and Editorial Prose */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8E8E93] font-medium mb-4">
              <span>About HanGuel</span>
              <span className="text-[#3A3A3A]">·</span>
              <span className="text-[#D2F865]">Seoul Heritage</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-white leading-[1.08] mb-6 text-balance">
              Language Meets Culture, Fluency Into Confidence.
            </h2>

            <p className="text-base text-[#9E9E9E] leading-relaxed mb-6">
              Founded in the cultural heart of Seoul, HanGuel was established to solve the greatest
              flaw in global language education: students spending years memorizing grammar charts
              who freeze the moment a native Korean speaks to them.
            </p>

            <p className="text-base text-[#9E9E9E] leading-relaxed mb-8">
              We synthesize King Sejong’s scientific phonetics with high-intensity live speaking cohorts.
              By pairing small student batches with Seoul-certified educators and round-the-clock
              phoneme AI feedback, we create an immersive linguistic ecosystem that feels like
              living in Korea.
            </p>

            <button
              onClick={onLearnMore}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#D2F865] hover:text-white transition-colors cursor-pointer group"
            >
              <span>Explore our academic history & pedagogical team</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Right Column: High-Impact Photography */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border border-[#222222] bg-[#111111] shadow-2xl relative group">
              <img
                src={aboutImage}
                alt="HanGuel Korean cultural immersion studio in Seoul with calligraphy and native masterclass"
                className="w-full h-[380px] sm:h-[440px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/images/about_seoul_academy_1793466116007.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* In-photo caption */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0D0D0D]/85 backdrop-blur-md border border-[#262626]">
                <div className="text-xs font-semibold text-white">
                  Seoul Studio & Global Digital Academy
                </div>
                <div className="text-[11px] text-[#8E8E93] mt-0.5">
                  Synchronous immersion sessions broadcasting daily across global timezones
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-16 pt-12 border-t border-[#1C1C1C] grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight tabular-nums mb-1">
                {stat.value}
              </span>
              <span className="text-sm font-semibold text-[#E5E5E5] mb-0.5">{stat.label}</span>
              <span className="text-xs text-[#737373]">{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
