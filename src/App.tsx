import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HangulLab } from './components/HangulLab';
import { OecLedBoard } from './components/OecLedBoard';
import { Courses } from './components/Courses';
import { CtaBand } from './components/CtaBand';
import { About } from './components/About';
import { Pricing } from './components/Pricing';
import { Process } from './components/Process';
import { Comparison } from './components/Comparison';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { TrialModal } from './components/TrialModal';
import { SyllabusModal } from './components/SyllabusModal';
import { MethodModal } from './components/MethodModal';
import { AdminOecPanel } from './components/AdminOecPanel';
import { LoadingScreen } from './components/LoadingScreen';
import { WelcomeAnnouncementModal } from './components/WelcomeAnnouncementModal';
import { attachGlobalAudioUnlockListeners } from './utils/audioManager';
import type { Course, PricingPlan } from './types';

export default function App() {
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [methodModalOpen, setMethodModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollTargetCourse, setEnrollTargetCourse] = useState<string | undefined>(undefined);

  const handleLoadingFinished = () => {
    if (typeof window === 'undefined') return;
    try {
      const hasSeen = sessionStorage.getItem('ok_korean_welcome_seen');
      if (!hasSeen) {
        // Appears 1 second after loading screen disappears
        setTimeout(() => {
          setWelcomeModalOpen(true);
          sessionStorage.setItem('ok_korean_welcome_seen', 'true');
        }, 1000);
      }
    } catch (e) {
      console.warn('SessionStorage not available:', e);
    }
  };

  // Direct URL route detection for /admin or #admin
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path === '/admin' || path.startsWith('/admin') || hash === '#admin';
  });

  useEffect(() => {
    attachGlobalAudioUnlockListeners();
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      setIsAdminRoute(path === '/admin' || path.startsWith('/admin') || hash === '#admin');
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const handleOpenTrial = (courseName?: string) => {
    setEnrollTargetCourse(courseName);
    setTrialModalOpen(true);
  };

  const handleSelectPlan = (plan: PricingPlan, _billingCycle: 'monthly' | 'quarterly') => {
    setEnrollTargetCourse(`${plan.name} (${plan.koreanName})`);
    setTrialModalOpen(true);
  };

  // Password-protected admin access (Password: 356948127)
  const handleAdminPrompt = () => {
    const entered = window.prompt('Enter Admin Password:');
    if (entered === null) return;
    if (entered.trim() === '356948127') {
      setAdminModalOpen(true);
    } else {
      window.alert('Incorrect password. Access denied.');
    }
  };

  // Dedicated /admin or #admin Route (Separate, Direct URL Access)
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#F5F5F5] bg-grain py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Top Return Navigation */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#222]">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white text-base sm:text-lg">OK Korean Language Center</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#181818] border border-[#2e2e2e] text-[#8E8E93]">
                Admin Dispatch Route (/admin)
              </span>
            </div>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222] border border-[#333] text-white transition-colors cursor-pointer"
            >
              ← Back to Main Dashboard
            </button>
          </div>

          {/* Standalone Admin Panel */}
          <AdminOecPanel />
        </div>
      </div>
    );
  }

  // Public Main Website (Admin Console is completely hidden from UI)
  return (
    <div className="relative min-h-screen bg-[#080808] text-[#F5F5F5] bg-grain selection:bg-[#D2F865] selection:text-[#0A0A0A]">
      {/* Premium Initial Geometric Loading Screen */}
      <LoadingScreen onLoaded={handleLoadingFinished} />

      {/* Top Navigation (Admin Console removed from header) */}
      <Navbar onBookTrial={() => handleOpenTrial()} />

      {/* Main Content Layout */}
      <main>
        {/* 1. Hero Section */}
        <Hero
          onStartLearning={() => handleOpenTrial()}
          onWatchMethod={() => setMethodModalOpen(true)}
        />

        {/* 2. Features Bento Grid */}
        <Features onExploreMethod={() => setMethodModalOpen(true)} />

        {/* 3. Interactive Hangul Phoneme Soundboard Lab */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HangulLab />
        </section>

        {/* 4. Airport LED Departure Board Replica (South Korea & OEC Info) */}
        <OecLedBoard />

        {/* 5. Courses for Every Level */}
        <Courses
          onSelectCourse={(course) => setSelectedCourse(course)}
          onEnroll={(courseName) => handleOpenTrial(courseName)}
        />

        {/* 6. CTA Band */}
        <CtaBand onBookTrial={() => handleOpenTrial()} />

        {/* 7. About Section */}
        <About onLearnMore={() => setMethodModalOpen(true)} />

        {/* 8. Pricing Section */}
        <Pricing onSelectPlan={handleSelectPlan} />

        {/* 9. Process Timeline */}
        <Process onStartProcess={() => handleOpenTrial('Level 1 Diagnostic')} />

        {/* 10. Comparison Table */}
        <Comparison />

        {/* 11. FAQ Accordion */}
        <Faq />
      </main>

      {/* 12. Footer with subtle password-protected Admin Console */}
      <Footer onOpenAdmin={handleAdminPrompt} />

      {/* Interactive Modals */}
      <TrialModal
        isOpen={trialModalOpen}
        onClose={() => setTrialModalOpen(false)}
        preselectedCourse={enrollTargetCourse}
      />

      <SyllabusModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnrollCourse={(courseName) => handleOpenTrial(courseName)}
      />

      <MethodModal
        isOpen={methodModalOpen}
        onClose={() => setMethodModalOpen(false)}
        onBookTrial={() => handleOpenTrial('Spoken Fluency Cohort')}
      />

      {/* Welcome Announcement Modal (Appears 1s after loader, once per session) */}
      <WelcomeAnnouncementModal
        isOpen={welcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
        onBookTrial={() => handleOpenTrial()}
      />

      {/* Admin Console Modal */}
      {adminModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setAdminModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto my-auto shadow-2xl rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AdminOecPanel onClose={() => setAdminModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
