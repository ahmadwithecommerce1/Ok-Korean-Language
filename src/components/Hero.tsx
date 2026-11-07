import { ArrowUpRight, Play, CheckCircle2, ChevronDown } from 'lucide-react';
import heroImage from '../assets/images/hero_korean_learning_1793466115338.jpg';
import logoImage from '../assets/logo.png';

interface HeroProps {
  onStartLearning: () => void;
  onWatchMethod: () => void;
}

const TRUST_PARTNERS = [
  { name: 'Seoul National University', label: 'SNU LEI Certified' },
  { name: 'Yonsei University', label: 'Yonsei KLI Pedagogy' },
  { name: 'Korea University', label: 'KU Language Center' },
  { name: 'King Sejong Institute', label: 'Sejong Hakdang Standards' },
  { name: 'NIIED TOPIK Korea', label: 'Official Examination Partner' },
  { name: 'Ministry of Culture (MCST)', label: 'Accredited Curriculum' },
];

export function Hero({ onStartLearning, onWatchMethod }: HeroProps) {
  return (
    <section className="relative pt-32 sm:pt-36 lg:pt-40 pb-16 lg:pb-24 overflow-hidden">
      {/* Background radial gradient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] sm:w-[900px] sm:h-[500px] bg-[#D2F865]/[0.035] blur-[140px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Year & Eyebrow Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#242424] text-xs text-[#E5E5E5] mb-8 shadow-sm">
              <img
                src="/logo.png"
                alt="OK Korean Language Center Logo"
                className="w-5 h-5 rounded-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = logoImage;
                }}
              />
              <span className="tracking-[0.16em] uppercase text-[11px] font-medium text-[#A0A0A0]">
                OK Korean Language Center
              </span>
            </div>

            {/* Massive Display Heading */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-[-0.04em] leading-[0.98] text-white text-balance mb-6">
              Your Gateway To Korea.
            </h1>

            {/* Sub-paragraph (2 lines max, elegant measure) */}
            <p className="text-base sm:text-lg text-[#9E9E9E] max-w-xl leading-relaxed mb-9">
              Master authentic conversational Korean with certified Seoul native educators
              through live small-batch cohorts and personalized TOPIK immersion.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onStartLearning}
                className="group inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-[#0A0A0A] bg-[#D2F865] rounded-full hover:bg-[#c2e855] transition-all duration-200 hover:scale-[1.03] shadow-[0_0_30px_rgba(210,248,101,0.3)] cursor-pointer whitespace-nowrap"
              >
                <span>Start Learning</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={onWatchMethod}
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium text-[#E0E0E0] bg-[#111111] hover:bg-[#181818] border border-[#242424] hover:border-[#383838] rounded-full transition-all duration-200 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 mr-2 text-[#D2F865] fill-[#D2F865]" />
                <span>Watch Method</span>
              </button>
            </div>

            {/* Micro Credential Line */}
            <div className="mt-10 flex items-center gap-6 text-xs text-[#737373]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D2F865]" />
                <span>Seoul Certified Tutors</span>
              </div>
              <span className="text-[#262626]">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D2F865]" />
                <span>Max 5 Students / Cohort</span>
              </div>
              <span className="text-[#262626]">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D2F865]" />
                <span>98.4% TOPIK Pass</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Contrast Editorial Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer frame styling matching Nubien */}
              <div className="relative rounded-3xl overflow-hidden border border-[#1F1F1F] bg-[#111111] shadow-2xl group">
                <img
                  src={heroImage}
                  alt="Student mastering Hangul calligraphy and spoken Korean in Seoul studio"
                  className="w-full h-[420px] sm:h-[480px] lg:h-[520px] object-cover object-center grayscale-[15%] group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/images/hero_korean_learning_1793466115338.jpg';
                  }}
                />

                {/* Subtle dark gradient scrim at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-black/20 pointer-events-none" />

                {/* Overlay Card: KR Jobs in Korea */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#0D0D0D]/90 backdrop-blur-md border border-[#262626]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D2F865]" />
                        <span className="text-xs font-semibold text-white tracking-wide">
                          KR Jobs in Korea
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8E8E93] mt-0.5">
                        4.5 Lakh Package
                      </p>
                      <div className="text-[11px] text-[#8E8E93] mt-1 space-y-0.5">
                        <p>Course Fee: 12,000 Rupees / Month</p>
                        <p>3 Months Course: 36,000 Rupees</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#181818] border border-[#2E2E2E] text-[#D2F865]">
                      Live
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative accent glow backdrop */}
              <div
                className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#D2F865]/10 rounded-full blur-3xl -z-10 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 lg:mt-24 flex justify-center">
          <a
            href="#features"
            className="flex flex-col items-center gap-1.5 text-xs text-[#666666] hover:text-[#D2F865] transition-colors"
          >
            <span className="uppercase tracking-[0.2em] text-[10px]">Explore System</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>

        {/* Marquee Trust Logos Strip (Mirroring Nubien) */}
        <div className="mt-12 pt-8 border-t border-[#161616] overflow-hidden relative">
          <div className="text-center mb-6">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#666666] font-medium">
              Curriculum & Certification Benchmarks Recognized By
            </span>
          </div>

          {/* Marquee Wrapper with fade gradients on sides */}
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
            <div className="animate-marquee flex items-center gap-12 sm:gap-16 py-2 whitespace-nowrap">
              {TRUST_PARTNERS.concat(TRUST_PARTNERS).map((partner, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-default"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D2F865]" />
                  <span className="text-sm font-semibold tracking-tight text-[#E5E5E5]">
                    {partner.name}
                  </span>
                  <span className="text-xs text-[#666666]">({partner.label})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
