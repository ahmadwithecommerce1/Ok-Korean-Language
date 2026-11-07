import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import logoImage from '../assets/logo.png';

interface NavbarProps {
  onBookTrial: () => void;
}

export function Navbar({ onBookTrial }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Primary Navigation Row */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#080808]/92 backdrop-blur-md border-b border-[#1A1A1A] py-3.5 shadow-2xl'
            : 'bg-[#080808]/80 backdrop-blur-sm py-4 border-b border-[#1A1A1A]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 text-base sm:text-lg font-bold tracking-tight text-[#F5F5F5] group shrink-0 whitespace-nowrap cursor-pointer"
          >
            <img
              src="/logo.png"
              alt="OK Korean Language Center Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-contain bg-white/5 border border-[#262626] group-hover:border-[#D2F865]/60 transition-colors shadow-md"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = logoImage;
              }}
            />
            <span className="tracking-[-0.03em] font-semibold text-white">OK Korean Language Center</span>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8E8E93]">
            <a
              href="#oec-departure-board"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
              <span>OEC Board</span>
            </a>
            <a
              href="#courses"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Courses
            </a>
            <a
              href="#method"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Method
            </a>
            <a
              href="#pricing"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              About
            </a>
            <a
              href="#faq"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              FAQ
            </a>
          </nav>

          {/* Zone 3: Actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href="https://ok-korean-lms.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-[#D0D0D0] hover:text-white bg-transparent border border-[#2A2A2A] hover:border-[#D2F865]/60 hover:bg-[#141414] rounded-full transition-all duration-200 hover:scale-[1.02] whitespace-nowrap shrink-0"
            >
              <span>Private Portal</span>
            </a>

            <button
              onClick={onBookTrial}
              className="group relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold text-[#0A0A0A] bg-[#D2F865] rounded-full hover:bg-[#c2e855] transition-all duration-200 hover:scale-[1.03] shadow-[0_0_20px_rgba(210,248,101,0.25)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Book a Free Trial</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-lg bg-[#141414] border border-[#222222] text-[#F5F5F5] hover:text-[#D2F865] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (if open) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A]/98 backdrop-blur-xl border-b border-[#1F1F1F] px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xl">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#A0A0A0]">
            <a
              href="#oec-departure-board"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors flex items-center gap-2 text-[#D2F865]"
            >
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
              <span>OEC Departure Board (Live)</span>
            </a>
            <a
              href="#courses"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              Courses
            </a>
            <a
              href="#method"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              Method
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="https://ok-korean-lms.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-xs font-semibold text-[#D0D0D0] hover:text-white bg-transparent border border-[#2A2A2A] hover:border-[#D2F865]/60 rounded-full transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Private Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#A0A0A0]" />
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onBookTrial();
              }}
              className="w-full py-3 text-xs font-semibold text-[#0A0A0A] bg-[#D2F865] rounded-full hover:bg-[#c2e855] transition-all text-center flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(210,248,101,0.25)]"
            >
              <span>Book a Free Trial</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
