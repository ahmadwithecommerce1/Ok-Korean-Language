import { ArrowLeft, FileCheck2, BookOpen, CreditCard, ShieldAlert, Scale, Mail, Phone, MapPin } from 'lucide-react';
import logoImage from '../assets/logo.png';

interface TermsConditionsPageProps {
  onBackHome: () => void;
  onNavigatePrivacy: () => void;
}

export function TermsConditionsPage({ onBackHome, onNavigatePrivacy }: TermsConditionsPageProps) {
  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] bg-grain py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#1E1E1E]">
          <button
            type="button"
            onClick={onBackHome}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <img
              src="/logo.png"
              alt="OK Korean Language Center Logo"
              className="w-10 h-10 rounded-full object-contain bg-white/5 border border-[#262626]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = logoImage;
              }}
            />
            <span className="font-bold text-white text-base sm:text-lg tracking-[-0.02em] group-hover:text-[#D2F865] transition-colors">
              OK Korean Language Center
            </span>
          </button>

          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D2F865] hover:bg-[#c2e855] text-[#0A0A0A] text-xs sm:text-sm font-bold transition-all shadow-[0_0_20px_rgba(210,248,101,0.2)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Main Card */}
        <article className="rounded-3xl bg-[#0F0F0F] border border-[#222222] p-6 sm:p-10 shadow-2xl space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D2F865]/10 border border-[#D2F865]/30 text-xs font-semibold text-[#D2F865] uppercase tracking-wider mb-4">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Enrollment Agreement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs sm:text-sm text-[#8E8E93]">
              Last Updated: <span className="text-[#CCCCCC] font-medium">November 18, 2026</span>
            </p>
          </div>

          <section className="pt-6 border-t border-[#1A1A1A] space-y-2.5">
            <h2 className="text-lg font-bold text-[#D2F865]">1. Acceptance of Terms</h2>
            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              By accessing <span className="text-white">https://www.ok-korean.online/</span>, submitting an admission request, or
              enrolling in any program offered by OK Korean Language Center, you acknowledge that you have read, understood, and
              agreed to be bound by these Terms &amp; Conditions.
            </p>
          </section>

          <section className="pt-6 border-t border-[#1A1A1A] space-y-2.5">
            <h2 className="text-lg font-bold text-[#D2F865] flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>2. Services</span>
            </h2>
            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              OK Korean Language Center provides structured Korean language instruction and certification preparation, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#CCCCCC]">
              <li>Hangul Foundation &amp; Scientific Pronunciation Courses (Level 1)</li>
              <li>Conversational Spoken Korean &amp; Grammar Fluency Batches (Levels 2–4)</li>
              <li>TOPIK I &amp; TOPIK II Examination Preparation (Levels 5–6)</li>
              <li>EPS-TOPIK Test Readiness, Career Guidance, and OEC Dispatch Support</li>
            </ul>
          </section>

          <section className="pt-6 border-t border-[#1A1A1A] space-y-3">
            <h2 className="text-lg font-bold text-[#D2F865] flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span>3. Fees &amp; Payment</span>
            </h2>
            <div className="rounded-2xl bg-[#141414] border border-[#D2F865]/25 p-4 sm:p-5 text-sm text-[#D8D8D8] leading-relaxed">
              Course fees must be submitted according to the selected monthly or full 3-month package schedule prior to class
              commencement. Please note that all tuition fees are{' '}
              <strong className="text-[#D2F865]">
                non-refundable after the 14-day guarantee period
              </strong>{' '}
              from the student&apos;s enrollment start date, as stated on our official website.
            </div>
          </section>

          <section className="pt-6 border-t border-[#1A1A1A] space-y-2.5">
            <h2 className="text-lg font-bold text-[#D2F865] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              <span>4. Code of Conduct</span>
            </h2>
            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              Every student enrolled at OK Korean Language Center agrees to observe the following rules:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#CCCCCC]">
              <li>Attend classes punctually in the assigned Morning or Evening batch and maintain respectful classroom etiquette.</li>
              <li>Show courtesy toward native Korean instructors, administrative staff, and fellow classmates.</li>
              <li>Do not redistribute proprietary curriculum materials, mock tests, or LMS portal access without authorization.</li>
              <li>Follow all examination integrity rules during assessments and mock EPS-TOPIK evaluations.</li>
            </ul>
          </section>

          <section className="pt-6 border-t border-[#1A1A1A] space-y-2.5">
            <h2 className="text-lg font-bold text-[#D2F865] flex items-center gap-2">
              <Scale className="w-5 h-5" />
              <span>5. Limitation of Liability</span>
            </h2>
            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              OK Korean Language Center strives to deliver top-tier Korean instruction and exam preparation; however, final
              official test scores, visa issuance, and overseas employment selections are governed by third-party authorities
              such as NIIED, OEC, and Korean immigration bodies. To the maximum extent permitted by applicable law, OK Korean
              Language Center shall not be liable for any indirect, incidental, or consequential damages resulting from the use of
              our website or educational services.
            </p>
          </section>

          <section className="pt-6 border-t border-[#1A1A1A] space-y-3">
            <h2 className="text-lg font-bold text-[#D2F865]">6. Contact Information</h2>
            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              If you have any questions regarding these Terms &amp; Conditions, please contact our administration:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <a
                href="mailto:info@ok-korean.online"
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#141414] border border-[#242424] hover:border-[#D2F865]/50 text-[#E5E5E5] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#D2F865] shrink-0" />
                <span className="truncate">info@ok-korean.online</span>
              </a>
              <a
                href="tel:+923224525389"
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#141414] border border-[#242424] hover:border-[#D2F865]/50 text-[#E5E5E5] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D2F865] shrink-0" />
                <span>0322 4525389</span>
              </a>
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#141414] border border-[#242424] text-[#CCCCCC]">
                <MapPin className="w-4 h-4 text-[#D2F865] shrink-0 mt-0.5" />
                <span>G8FF+6RF, Lahore – Kasur Rd, Ichhra, Lahore</span>
              </div>
            </div>
          </section>
        </article>

        {/* Bottom Links */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <span>© 2026 OK Korean Language Center. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <button type="button" onClick={onBackHome} className="hover:text-[#D2F865] transition-colors cursor-pointer">
              Back to Home
            </button>
            <button type="button" onClick={onNavigatePrivacy} className="hover:text-[#D2F865] transition-colors cursor-pointer">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
