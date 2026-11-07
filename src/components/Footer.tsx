import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Send, Sliders } from 'lucide-react';
import logoImage from '../assets/logo.png';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export function Footer({ onOpenAdmin }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    try {
      const formData = new FormData(e.currentTarget);
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      console.error('Newsletter submit error:', err);
    }
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2500);
  };

  return (
    <footer className="pt-20 pb-12 border-t border-[#1A1A1A] bg-[#070707] text-[#8E8E93] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#161616]">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <a href="#" className="flex items-center gap-3 text-base font-bold text-white mb-4">
              <img
                src="/logo.png"
                alt="OK Korean Language Center Logo"
                className="w-10 h-10 rounded-full object-contain bg-white/5 border border-[#262626]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = logoImage;
                }}
              />
              <span className="tracking-[-0.03em] font-semibold text-white">OK Korean Language Center</span>
            </a>
            <p className="text-xs leading-relaxed text-[#7A7A7A] max-w-sm mb-6">
              OK Korean Language Center is dedicated to mastering spoken Korean fluency,
              cultural literacy, and TOPIK certification with comprehensive job and visa preparation.
            </p>

            <div className="space-y-1 text-[11px] text-[#666666]">
              <p>Address: G8FF+6RF, Lahore – Kasur Rd, Ichhra Shershah Colony, Lahore, 54000</p>
              <p>Ph: 0322-4525389 | 0322-8082676 | 0308-4040422</p>
            </div>

            <div className="mt-4 flex items-center gap-3 text-[11px] text-[#8E8E93]">
              <a
                href="https://www.youtube.com/@okkoreanlanguagecenter"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D2F865] transition-colors"
              >
                YouTube
              </a>
              <span>·</span>
              <a
                href="https://www.facebook.com/OKKoreanLanguageCenter/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D2F865] transition-colors"
              >
                Facebook
              </a>
              <span>·</span>
              <a
                href="https://tiktok.com/@okkoreanlanguagecenter?_t=8lCv0nJ2JHe&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D2F865] transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>

          {/* Links Column 1: Programs */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Programs
            </div>
            <ul className="space-y-2.5">
              <li>
                <a href="#courses" className="hover:text-white transition-colors">
                  Hangul Foundation (Level 1)
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-white transition-colors">
                  Conversational Spoken (Level 2)
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-white transition-colors">
                  Intermediate Debate (Level 3-4)
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-white transition-colors">
                  Academic TOPIK II (Level 5-6)
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-white transition-colors">
                  Corporate Business Korean
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Methodology */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Methodology
            </div>
            <ul className="space-y-2.5">
              <li>
                <a href="#method" className="hover:text-white transition-colors">
                  Hangul-First Pedagogy
                </a>
              </li>
              <li>
                <a href="#method" className="hover:text-white transition-colors">
                  Small-Batch Immersion (Max 5)
                </a>
              </li>
              <li>
                <a href="#method" className="hover:text-white transition-colors">
                  24/7 AI Voice Practice
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Seoul Native Faculty
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Tuition Guarantee
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter Signup */}
          <div className="md:col-span-4">
            <div className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
              Seoul Dispatch Newsletter
            </div>
            <p className="text-xs text-[#7A7A7A] mb-4">
              Weekly curated Korean idioms, K-Drama breakdown sheets, and admissions announcements.
            </p>

            <form
              action="https://api.web3forms.com/submit"
              method="POST"
              onSubmit={handleSubscribe}
              className="space-y-2"
            >
              <input type="hidden" name="access_key" value="ed03fc13-272f-4ea1-b292-b56df97fc40e" />
              <input type="hidden" name="subject" value="New Newsletter Subscription" />
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2.5 rounded-full bg-[#121212] border border-[#242424] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#D2F865] transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-full bg-[#D2F865] text-[#0A0A0A] font-semibold hover:bg-[#c2e855] transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                  aria-label="Subscribe to newsletter"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>

              {error && <p className="text-[11px] text-red-400 pl-2">{error}</p>}
              {subscribed && (
                <p className="text-[11px] text-[#D2F865] pl-2 font-medium">
                  감사합니다! You are subscribed to the Seoul Dispatch.
                </p>
              )}
            </form>

            <div className="mt-6 flex items-center gap-4 text-[#8E8E93]">
              <a
                href="https://www.youtube.com/@okkoreanlanguagecenter"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D2F865] transition-colors"
              >
                YouTube
              </a>
              <span>·</span>
              <a
                href="https://www.facebook.com/OKKoreanLanguageCenter/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D2F865] transition-colors"
              >
                Facebook
              </a>
              <span>·</span>
              <a
                href="https://tiktok.com/@okkoreanlanguagecenter?_t=8lCv0nJ2JHe&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D2F865] transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#555555]">
          <div>
            © {new Date().getFullYear()} OK Korean Language Center Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <a href="#" className="hover:text-[#8E8E93] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#8E8E93] transition-colors">
              Terms of Enrollment
            </a>
            <a href="#" className="hover:text-[#8E8E93] transition-colors">
              NIIED Exam Guidelines
            </a>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="hover:text-[#8E8E93] text-[#444444] transition-colors flex items-center gap-1.5 cursor-pointer ml-1"
                title="Admin Console"
              >
                <Sliders className="w-3 h-3 text-[#555555]" />
                <span>Admin Console</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
