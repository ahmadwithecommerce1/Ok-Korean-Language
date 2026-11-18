import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '../types';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'I am a complete beginner with zero Korean knowledge. Can I join?',
    koreanHint: '완전 초보자 환영',
    answer:
      'Absolutely. More than 45% of our learners begin with our Hangul Master & Survival Spoken program. Within the first two weeks, you will read any Korean billboard, menu, or song title effortlessly, without needing clumsy Romanized phonetics.',
  },
  {
    question: 'Are all teachers truly certified native Korean speakers?',
    koreanHint: '100% 서울 표준어 강사진',
    answer:
      'Yes, 100%. All HanGuel educators hold degrees in Korean Language and Literature, Applied Linguistics, or Education from premier universities (including Seoul National University and Yonsei University) and possess official Level 2 or Level 1 Korean Language Teacher certificates issued by the Korean Ministry of Culture, Sports and Tourism.',
  },
  {
    question: 'What happens during the Free Trial Class?',
    koreanHint: '무료 레벨 진단 안내',
    answer:
      'The 15-minute trial is a relaxed 1-on-1 session conducted via Zoom with a certified instructor. We evaluate your current pronunciation mechanics, reading speed, and conversational instincts, followed by a personalized learning roadmap recommendation. There is zero pressure and no credit card required.',
  },
  {
    question: 'How does HanGuel prepare students for official TOPIK exams?',
    koreanHint: 'TOPIK 시험 대비 및 합격 보장',
    answer:
      'Our curriculum directly tracks official National Institute for International Education (NIIED) standards. We provide actual past paper mock tests under timed conditions, rigorous line-by-line grading of the notorious TOPIK II descriptive essays (Questions 51-54), and targeted listening strategies resulting in our 98.4% pass rate.',
  },
  {
    question: 'What if I miss a scheduled live group class?',
    koreanHint: '수업 보강 및 녹화본 제공',
    answer:
      'Every synchronous session is recorded in HD and uploaded to your student portal within 3 hours alongside teacher blackboard notes and vocabulary decks. You can also reschedule into a parallel cohort within the same week using your student dashboard at no extra cost.',
  },
  {
    question: 'What is your refund policy if the format does not suit me?',
    koreanHint: '14일 100% 환불 보장',
    answer:
      'We stand behind our educational quality with an unconditional 14-day 100% money-back guarantee. If you attend your initial sessions and feel HanGuel is not the perfect fit, simply let our team know and we will issue a full refund immediately.',
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8E8E93] font-medium mb-3">
            <span>Inquiries</span>
            <span className="text-[#3A3A3A]">·</span>
            <span className="text-[#D2F865]">Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-white text-balance mb-4">
            Frequently Asked Questions.
          </h2>
          <p className="text-sm sm:text-base text-[#8E8E93] max-w-md mx-auto leading-relaxed">
            Everything you need to know about our teaching philosophy, cohort scheduling, and
            certification pathways.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#1F1F1F] bg-[#111111]/90 overflow-hidden transition-colors hover:border-[#2C2C2C]"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div>
                    <div className="text-[11px] font-medium text-[#7A7A7A] mb-1">
                      {item.koreanHint}
                    </div>
                    <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {item.question}
                    </span>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#D2F865] text-[#0A0A0A]' : 'text-[#8E8E93]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 text-xs sm:text-sm text-[#9E9E9E] leading-relaxed border-t border-[#1C1C1C] pt-4 animate-in fade-in duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0F0F0F] border border-[#1E1E1E] text-center">
          <p className="text-xs text-[#8E8E93]">
            Have a specialized question about university admissions or corporate team training?{' '}
            <a
              href="#contact"
              className="text-[#D2F865] hover:underline font-semibold ml-1 cursor-pointer"
            >
              Contact our academic admissions office
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
