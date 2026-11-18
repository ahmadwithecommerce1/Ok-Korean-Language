import { useState } from 'react';
import { ArrowUpRight, Clock, Calendar, Check, BookOpen } from 'lucide-react';
import type { Course } from '../types';

interface CoursesProps {
  onSelectCourse: (course: Course) => void;
  onEnroll: (courseName: string) => void;
}

const COURSES_DATA: Course[] = [
  {
    id: 'hangul-foundation',
    level: 'Beginner',
    koreanTitle: '한글 완성과 생존 회화',
    title: 'Hangul Master & Survival Spoken Korean',
    topikLevel: 'Pre-TOPIK to TOPIK 1',
    duration: '6 Weeks',
    hoursPerWeek: '4 hrs/wk live + AI lab',
    description:
      'Zero to reading and pronouncing any Korean sentence naturally without awkward Romanization. Master daily café, taxi, food, and basic introductions.',
    outcomes: [
      'Master all 40 Hangul vowels, consonants, and complex batchim rules',
      'Handle ordering food, asking directions, and greeting with polite honorifics',
      'Build core vocabulary of 600 essential daily life words',
    ],
    syllabus: [
      { week: 'Week 1', topic: 'Hangul Vowels & Basic Consonants', grammar: '입니다 / 입니까 (Formal Declarative)' },
      { week: 'Week 2', topic: 'Aspirated & Tense Sounds + Batchim Rules', grammar: '은/는, 이/가 (Subject & Topic Particles)' },
      { week: 'Week 3', topic: 'Polite Spoken Form (-아요/어요)', grammar: '에/에서 (Location & Movement)' },
      { week: 'Week 4', topic: 'Sino-Korean & Native Korean Numbers', grammar: '개, 명, 병 (Korean Counting Units)' },
      { week: 'Week 5', topic: 'Time, Dates & Daily Routine Conjugation', grammar: '-고 싶다 (Desires & Intentions)' },
      { week: 'Week 6', topic: 'Survival Travel & Live Seoul Simulation', grammar: '-을 수 있다/없다 (Ability & Potential)' },
    ],
    tag: 'beginner',
    featured: true,
  },
  {
    id: 'topik-2-conversational',
    level: 'Elementary',
    koreanTitle: '일상 대화 및 TOPIK I (2급)',
    title: 'Conversational Fluency & TOPIK I',
    topikLevel: 'TOPIK Level 2',
    duration: '8 Weeks',
    hoursPerWeek: '5 hrs/wk live cohort',
    description:
      'Transition from isolated sentences into continuous spoken paragraphs. Express past memories, future plans, reasonings, and personal opinions comfortably.',
    outcomes: [
      'Narrate personal stories, weekend plans, and emotional reactions',
      'Master connective particles (-아서/어서, -(으)니까, -지만)',
      'Score Level 2 on official TOPIK I examination',
    ],
    syllabus: [
      { week: 'Week 1-2', topic: 'Past Tense Narration & Connecting Causes', grammar: '-았/었-, -아서/어서' },
      { week: 'Week 3-4', topic: 'Future Plans & Making Invitations', grammar: '-(으)ㄹ 거예요, -(으)ㄹ까요' },
      { week: 'Week 5-6', topic: 'Giving Advice, Obligations & Permissions', grammar: '-아/어야 하다, -아/어도 되다' },
      { week: 'Week 7-8', topic: 'TOPIK I Listening & Reading Mock Drills', grammar: 'Official Speed Strategy' },
    ],
    tag: 'beginner',
  },
  {
    id: 'topik-3-4-intermediate',
    level: 'Intermediate',
    koreanTitle: '중급 실전 회화 및 TOPIK II',
    title: 'Intermediate Spoken & TOPIK II Foundation',
    topikLevel: 'TOPIK Level 3–4',
    duration: '10 Weeks',
    hoursPerWeek: '6 hrs/wk live + essay clinic',
    description:
      'Participate actively in group debates, workplace communication, and cultural analysis. Understand news summaries and write coherent short essays.',
    outcomes: [
      'Express nuanced indirect speech (-다고 하다, -냐고 하다)',
      'Conquer TOPIK II Essay Question 51-53 writing templates',
      'Understand natural K-Drama banter and native speaking pace',
    ],
    syllabus: [
      { week: 'Week 1-2', topic: 'Indirect Speech Quotes in Daily Dialogue', grammar: '간접 화법 (-다고/라고 하다)' },
      { week: 'Week 3-4', topic: 'Passive & Causative Verb Systems', grammar: '피동사 / 사동사 (-이/히/리/기-)' },
      { week: 'Week 5-6', topic: 'Comparing Trends & Hypothesis Formulation', grammar: '-(으)ㄴ/는 반면에, -(으)ㄹ 텐데' },
      { week: 'Week 7-8', topic: 'TOPIK II Essay Clinic (Questions 51-53)', grammar: 'Formal Written Style (-는다/ㄴ다)' },
      { week: 'Week 9-10', topic: 'Korean Society, Employment & Media', grammar: '-기 마련이다, -아/어 봤자' },
    ],
    tag: 'intermediate',
    featured: true,
  },
  {
    id: 'business-corporate',
    level: 'Professional',
    koreanTitle: '비즈니스 실무 한국어',
    title: 'Business Korean & Professional Etiquette',
    topikLevel: 'TOPIK 4–6 / Corporate',
    duration: '8 Weeks',
    hoursPerWeek: '4 hrs/wk executive batch',
    description:
      'Corporate email drafting, negotiation vocabulary, executive meeting presentations, and high-level honorifics (시/서/드리다) for multinational careers.',
    outcomes: [
      'Write polished professional business emails and report summaries',
      'Lead workplace negotiations and cross-cultural client meetings',
      'Master high-level honorific register (격식체 및 높임말)',
    ],
    syllabus: [
      { week: 'Week 1-2', topic: 'Corporate Greeting & Telephone Protocol', grammar: '압존법 및 사내 호칭 체계' },
      { week: 'Week 3-4', topic: 'Business Email & Formal Documentation', grammar: '-기 바라며, -에 관하여' },
      { week: 'Week 5-6', topic: 'Proposal Pitching & Professional Discussion', grammar: '-도록 하겠습니다, -는 바입니다' },
      { week: 'Week 7-8', topic: 'Job Interviewing & Contract Terminologies', grammar: '역량 소개 및 질의응답 실전' },
    ],
    tag: 'specialized',
  },
  {
    id: 'kdrama-slang-culture',
    level: 'All Levels (from TOPIK 2)',
    koreanTitle: 'K-드라마 실전 대화 및 신조어',
    title: 'K-Drama Conversation & Modern Slang',
    topikLevel: 'Conversational Fluency',
    duration: '6 Weeks',
    hoursPerWeek: '3 hrs/wk cultural lab',
    description:
      'Ditch dry academic speech. Learn authentic youthful Seoul slang, trendy abbreviations, intonation subtleties, and watch dramas without relying on subtitles.',
    outcomes: [
      'Understand real colloquial contractions (줄임말) and modern slang',
      'Mimic natural Seoul street cadence, sighs, and emotional cues',
      'Break down actual scripts from viral 2024-2025 K-Dramas',
    ],
    syllabus: [
      { week: 'Week 1', topic: 'Colloquial Contractions in Fast Speech', grammar: '그거 -> 그건, 뭐 해 -> 머해' },
      { week: 'Week 2', topic: 'Emotional Exclamations & Sentence Enders', grammar: '-잖아, -거든, -다며, -대박' },
      { week: 'Week 3', topic: 'Romance & Friendship Banter in Dramas', grammar: '반말 친밀도 조절법' },
      { week: 'Week 4', topic: 'Internet Memes & KakaoTalk Texting Codes', grammar: 'ㅋㅋㅋ, ㅇㅇ, 갓생, 폼 미쳤다' },
      { week: 'Week 5', topic: 'Food Culture & Drinking Etiquette Vocabulary', grammar: '회식 문화 및 식사 표현' },
      { week: 'Week 6', topic: 'Live Unscripted Roleplay Drama Workshop', grammar: '즉흥 대본 연기 및 발음 코칭' },
    ],
    tag: 'specialized',
  },
  {
    id: 'topik-5-6-advanced',
    level: 'Advanced',
    koreanTitle: '고급 한국어 및 TOPIK II (5-6급)',
    title: 'Advanced Fluency & TOPIK II Masterclass',
    topikLevel: 'TOPIK Level 5–6',
    duration: '12 Weeks',
    hoursPerWeek: '6 hrs/wk advanced clinic',
    description:
      'For university admissions, government scholarships (GKS), and specialized careers in Korea. Rigorous 800-word argumentative essay writing and academic debates.',
    outcomes: [
      'Attain TOPIK Level 5 or Level 6 accreditation',
      'Produce academic essays analyzing sociological and economic phenomena',
      'Read editorials and policy briefs without bilingual dictionaries',
    ],
    syllabus: [
      { week: 'Week 1-3', topic: 'Academic Essay Logic (Question 54 Strategy)', grammar: '서론-본론-결론 논증 전개식' },
      { week: 'Week 4-6', topic: 'Four-Character Idioms (고사성어) in Context', grammar: '일석이조, 설상가상 등 빈출 사자성어' },
      { week: 'Week 7-9', topic: 'Contemporary Economics, AI & Social Issues', grammar: '고급 추상 명사화 구문' },
      { week: 'Week 10-12', topic: 'Speed Mock Testing & Individual Examiner Review', grammar: '실전 시간 배분 및 오답 심층 분석' },
    ],
    tag: 'advanced',
  },
];

const FILTER_TABS = [
  { id: 'all', label: 'All Courses' },
  { id: 'beginner', label: 'Beginner (TOPIK 1–2)' },
  { id: 'intermediate', label: 'Intermediate (TOPIK 3–4)' },
  { id: 'advanced', label: 'Advanced (TOPIK 5–6)' },
  { id: 'specialized', label: 'Specialized (Business & K-Drama)' },
];

export function Courses({ onSelectCourse, onEnroll }: CoursesProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredCourses =
    activeFilter === 'all'
      ? COURSES_DATA
      : COURSES_DATA.filter((course) => course.tag === activeFilter);

  return (
    <section id="courses" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8E8E93] font-medium mb-3">
              <span>Curriculum</span>
              <span className="text-[#3A3A3A]">·</span>
              <span className="text-[#D2F865]">Structured Excellence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-white text-balance">
              Courses for Every Ambition.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#8E8E93] max-w-md leading-relaxed">
            From your very first Hangul syllable to professional fluency in Seoul corporate
            boardrooms, each curriculum is crafted with rigorous pedagogical precision.
          </p>
        </div>

        {/* Filter Chip Bar (Nubien interactive pill style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#D2F865] text-[#0A0A0A] shadow-[0_0_15px_rgba(210,248,101,0.2)]'
                    : 'bg-[#141414] text-[#A0A0A0] hover:text-white border border-[#222222] hover:border-[#383838]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`group p-8 rounded-3xl bg-[#111111]/90 border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                course.featured
                  ? 'border-[#2E2E2E] hover:border-[#D2F865]/50'
                  : 'border-[#1C1C1C] hover:border-[#333333]'
              }`}
            >
              <div>
                {/* Level + TOPIK Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono text-[#D2F865] bg-[#D2F865]/10 px-2.5 py-1 rounded-full border border-[#D2F865]/20">
                    {course.topikLevel}
                  </span>
                  <span className="text-[11px] text-[#7A7A7A]">{course.koreanTitle}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold tracking-tight text-white mb-3 group-hover:text-[#D2F865] transition-colors">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* Metadata Row */}
                <div className="flex items-center gap-4 text-xs text-[#9E9E9E] mb-6 pt-4 border-t border-[#1C1C1C]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D2F865]" />
                    <span>{course.duration}</span>
                  </div>
                  <span className="text-[#333333]">·</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D2F865]" />
                    <span>{course.hoursPerWeek}</span>
                  </div>
                </div>

                {/* Key Outcomes */}
                <div className="space-y-2 mb-6">
                  {course.outcomes.slice(0, 2).map((outcome, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#9E9E9E]">
                      <Check className="w-3.5 h-3.5 text-[#D2F865] shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 border-t border-[#1C1C1C] flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectCourse(course)}
                  className="text-xs font-medium text-[#A0A0A0] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Syllabus</span>
                </button>

                <button
                  onClick={() => onEnroll(course.title)}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#181818] hover:bg-[#D2F865] text-xs font-semibold text-white hover:text-[#0A0A0A] border border-[#2B2B2B] hover:border-[#D2F865] transition-all cursor-pointer"
                >
                  <span>Enroll</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
