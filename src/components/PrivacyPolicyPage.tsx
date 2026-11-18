import { ArrowLeft, ShieldCheck, Lock, MessageCircle, Database, Mail, Phone, MapPin } from 'lucide-react';
import logoImage from '../assets/logo.png';

interface PrivacyPolicyPageProps {
  onBackHome: () => void;
  onNavigateTerms: () => void;
}

export function PrivacyPolicyPage({ onBackHome, onNavigateTerms }: PrivacyPolicyPageProps) {
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
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Legal &amp; Meta Compliance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#8E8E93]">
              Last Updated: <span className="text-[#CCCCCC] font-medium">November 18, 2026</span>
            </p>
          </div>

          <section className="pt-6 border-t border-[#1A1A1A] space-y-2.5">
            <h2 className="text-lg font-bold text-[#D2F865]">1. Introduction</h2>
            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              OK Korean Language Center (<span className="text-white">https://www.ok-korean.online/</span>) respects user privacy
              and is committed to safeguarding the personal data of our students, parents/guardians, and website visitors.
              This Privacy Policy outlines how we collect, use, share, and protect your personal information when you submit an
              admission inquiry, book a trial class, or enroll in our Korean language courses.
            </p>
          </section>

          <section className="pt-6 border-t border-[#1A1A1A] space-y-2.5">
            <h2 className="text-lg font-bold text-[#D2F865]">2. Information We Collect</h2>
            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              When you register or communicate with OK Korean Language Center, we collect necessary information for enrollment
              and academic communication purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#CCCCCC]">
              <li>
                <strong className="text-white">Personal &amp; Guardian Details:</strong> Student full name (English and optional Korean name) and Father/Guardian name.
              </li>
              <li>
                <strong className="text-white">Contact Information:</strong> Student contact phone number, Parent WhatsApp number, and email address (optional).
              </li>
              <li>
                <strong className="text-white">Enrollment &amp; Payment Details:</strong> Assigned batch (Morning/Evening), enrollment date, academic notes, and tuition fee payment records.
              </li>
            </ul>
          </section>

          <section className="pt-6 border-t border-[#1A1A1A] space-y-3">
            <h2 className="text-lg font-bold text-[#D2F865] flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span>3. How We Use Information (WhatsApp Notifications)</span>
            </h2>
            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              We use the collected information exclusively to deliver educational services and official institute updates:
            </p>
            <div className="rounded-2xl bg-[#141414] border border-[#D2F865]/25 p-4 sm:p-5 space-y-2 text-sm text-[#D8D8D8]">
              <p>
                • <strong className="text-white">WhatsApp Academic Alerts:</strong> With your explicit opt-in consent on our enrollment
                and inquiry forms, we use your phone number to send daily <strong className="text-[#D2F865]">attendance alerts</strong>,{' '}
                <strong className="text-[#D2F865]">test scores</strong>, and <strong className="text-[#D2F865]">fee reminders</strong> via WhatsApp.
              </p>
              <p>
                • <strong className="text-white">Enrollment Administration:</strong> Managing student batch placements, course schedules, and LMS records.
              </p>
              <p>
                • <strong className="text-white">Student &amp; Parent Support:</strong> Addressing academic inquiries, TOPIK exam updates, and OEC departure guidance.
              </p>
            </div>
          </section>

          <section className="pt-6 border-t border-[#1A1A1A] space-y-2.5">
            <h2 className="text-lg font-bold text-[#D2F865] flex items-center gap-2">
              <Database className="w-5 h-5" />
              <span>4. Data Sharing</span>
            </h2>
            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              We do <strong className="text-white">NOT</strong> sell, rent, or trade your personal information to third parties.
              We may share limited contact details solely with <strong className="text-white">WhatsApp / Meta Platforms</strong> and our
              authorized messaging infrastructure strictly for delivering official attendance, test score, and fee reminder communications.
            </p>
          </section>

          <section className="pt-6 border-t border-[#1A1A1A] space-y-2.5">
            <h2 className="text-lg font-bold text-[#D2F865] flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span>5. Data Security</span>
            </h2>
            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              We take reasonable technical and organizational measures—including HTTPS encryption, access-restricted cloud databases,
              and authorized staff access controls—to protect your personal data from unauthorized access, loss, or misuse.
            </p>
          </section>

          <section className="pt-6 border-t border-[#1A1A1A] space-y-3">
            <h2 className="text-lg font-bold text-[#D2F865]">6. Contact Us</h2>
            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              For privacy-related queries, data correction requests, or to opt out of WhatsApp notifications, please contact us:
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
            <button type="button" onClick={onNavigateTerms} className="hover:text-[#D2F865] transition-colors cursor-pointer">
              Terms &amp; Conditions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
