import { useState } from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import type { PricingPlan } from '../types';

interface PricingProps {
  onSelectPlan: (plan: PricingPlan, billingCycle: 'monthly' | 'quarterly') => void;
}

const PLANS: PricingPlan[] = [
  {
    id: 'starter-plan',
    name: 'Starter Plan',
    koreanName: '기본 시작 플랜',
    description:
      'For self-paced learners who want structured high-def video modules, Hangul drills, and unlimited AI voice practice.',
    monthlyPrice: 12000,
    quarterlyPrice: 12000,
    displayPrice: '12,000',
    billingPeriod: '/ month',
    features: [
      'Complete TOPIK 1 to 4 video masterclasses (120+ hrs)',
      'Interactive Hangul phonetics and batchim kit',
      '24/7 AI Speaking Simulator with phoneme scoring',
      'Downloadable grammar worksheets & Anki decks',
      'Discord community & weekly tutor Q&A board',
    ],
    ctaText: 'Start Plan',
  },
  {
    id: 'group-class',
    name: 'Group Immersion',
    koreanName: '소수 정예 실시간 몰입',
    description:
      'Our most popular program. Live interactive small cohorts with Seoul-certified teachers for genuine spoken fluency.',
    monthlyPrice: 36000,
    quarterlyPrice: 36000,
    displayPrice: '36,000',
    billingPeriod: '/ 3 months',
    popular: true,
    features: [
      'Everything in Self-Study included',
      '2x Weekly live interactive classes (75 mins each)',
      'Strictly capped at 5 students per cohort',
      'Certified native teacher from Seoul / Yonsei',
      'Individual weekly audio homework critique & correction',
      'Live cultural workshops (K-Drama & honorifics)',
      'Official TOPIK mock tests & examiner feedback',
    ],
    ctaText: 'Join Group Cohort',
  },
  {
    id: 'private-tutoring',
    name: '1-on-1 Elite',
    koreanName: '1:1 전담 맞춤형 코칭',
    description:
      'Tailored private mentorship with a dedicated native educator for rapid fluency, executive business, or TOPIK 5-6.',
    monthlyPrice: 1450000,
    quarterlyPrice: 1450000,
    displayPrice: '1,450,000',
    billingPeriod: '/ year',
    features: [
      'Everything in Group Immersion included',
      '2x Weekly private 60-min 1-on-1 sessions',
      'Dedicated personal native educator matched to your goal',
      'Bespoke syllabus (Business, GKS Scholarship, Medical, Drama)',
      'Flexible 24-hour rescheduling privileges',
      'Direct KakaoTalk voice messaging support with tutor',
      'Comprehensive university & corporate recommendation letters',
    ],
    ctaText: 'Apply for 1-on-1',
  },
];

export function Pricing({ onSelectPlan }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');

  return (
    <section id="pricing" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8E8E93] font-medium mb-3">
            <span>Tuition</span>
            <span className="text-[#3A3A3A]">·</span>
            <span className="text-[#D2F865]">Transparent Investment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-white text-balance mb-4">
            Flexible Plans for Every Need.
          </h2>
          <p className="text-sm sm:text-base text-[#8E8E93] leading-relaxed">
            Invest in authentic fluency. Transparent tuition, zero hidden platform fees, and a
            14-day money-back satisfaction guarantee.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center p-1 rounded-full bg-[#141414] border border-[#242424]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#222222] text-white shadow-sm'
                  : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'quarterly'
                  ? 'bg-[#D2F865] text-[#0A0A0A] shadow-sm font-bold'
                  : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              <span>Quarterly</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-black/15">
                Save 15%
              </span>
            </button>
          </div>
        </div>

        {/* 3-Tier Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.quarterlyPrice;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-[#121212] border-2 border-[#D2F865] shadow-[0_0_40px_rgba(210,248,101,0.15)] lg:-translate-y-2'
                    : 'bg-[#101010] border border-[#1F1F1F] hover:border-[#333333]'
                }`}
              >
                {/* Popular Pill Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D2F865] text-[#0A0A0A] text-[11px] font-black uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Plan Names */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                    <span className="text-xs text-[#7A7A7A]">{plan.koreanName}</span>
                  </div>

                  <p className="text-xs text-[#8E8E93] leading-relaxed mb-6 min-h-[36px]">
                    {plan.description}
                  </p>

                  {/* Price Block */}
                  <div className="flex items-baseline gap-1.5 pb-6 border-b border-[#1E1E1E] mb-6">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight tabular-nums">
                      {plan.displayPrice}
                    </span>
                    <span className="text-xs text-[#8E8E93]">
                      PKR {plan.billingPeriod}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3.5 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#CCCCCC]">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isPopular ? 'text-[#D2F865]' : 'text-[#8E8E93]'
                          }`}
                        />
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan CTA */}
                <div>
                  <button
                    onClick={() => onSelectPlan(plan, billingCycle)}
                    className={`w-full py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                      isPopular
                        ? 'bg-[#D2F865] text-[#0A0A0A] hover:bg-[#c2e855] shadow-[0_0_20px_rgba(210,248,101,0.25)] hover:scale-[1.02]'
                        : 'bg-[#181818] text-white hover:bg-[#222222] border border-[#2B2B2B] hover:border-[#444444]'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-[#666666] text-center mt-3">
                    14-day full satisfaction refund guarantee
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
