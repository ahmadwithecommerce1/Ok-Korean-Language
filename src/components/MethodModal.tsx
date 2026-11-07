import { useState, useRef } from 'react';
import { X, Play, Pause, Volume2, Sparkles, Check, ArrowRight } from 'lucide-react';
import teacherImage from '../assets/images/native_teacher_portrait_1793466116226.jpg';

interface MethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTrial: () => void;
}

export function MethodModal({ isOpen, onClose, onBookTrial }: MethodModalProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const toggleSampleAudio = () => {
    try {
      if (isPlayingAudio) {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setIsPlayingAudio(false);
        return;
      }

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
        const text =
          '안녕하세요! 오케이 한국어 어학원입니다. 말하기 중심 수업으로 여러분의 한국어 유창성을 확실하게 만들어 드립니다.';
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.9;

        utterance.onstart = () => {
          setIsPlayingAudio(true);
        };
        utterance.onend = () => {
          setIsPlayingAudio(false);
        };
        utterance.onerror = () => {
          setIsPlayingAudio(false);
        };

        setIsPlayingAudio(true);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingAudio(false);
      }
    } catch {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0F0F0F] border border-[#262626] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[#181818] border border-[#2B2B2B] text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#2D2D2D] text-xs text-[#E5E5E5] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#D2F865]" />
          <span>The HanGuel Fluency Framework</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          How HanGuel Rebuilds Your Korean Brain
        </h3>
        <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed mb-6">
          Traditional classes teach Korean like an ancient dead language through grammar translation.
          Our methodology focuses on acoustic automaticity and immediate vocal production.
        </p>

        {/* Video Simulation Box with Teacher Headshot */}
        <div
          onClick={toggleSampleAudio}
          className="relative rounded-2xl overflow-hidden border border-[#262626] bg-[#141414] mb-6 aspect-video flex items-center justify-center group cursor-pointer"
        >
          <img
            src={teacherImage}
            alt="Director of Korean Pedagogy at OK Korean Language Center"
            className="w-full h-full object-cover object-top opacity-50 filter contrast-125 group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/images/native_teacher_portrait_1793466116226.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Central Play Trigger */}
          <div className="relative z-10 text-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSampleAudio();
              }}
              className="w-16 h-16 rounded-full bg-[#D2F865] text-[#0A0A0A] flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(210,248,101,0.4)] group-hover:scale-110 transition-transform cursor-pointer"
              aria-label={isPlayingAudio ? 'Pause masterclass preview' : 'Play masterclass preview'}
            >
              {isPlayingAudio ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 ml-1 fill-current" />
              )}
            </button>
            <span className="text-xs font-semibold text-white tracking-wide block">
              {isPlayingAudio ? 'Playing Sample Masterclass Audio...' : 'Watch: 3-Minute Pedagogy Masterclass'}
            </span>
            <span className="text-[11px] text-[#A0A0A0]">
              Presented by Master Instructor Ji-Won Song (Yonsei KLI)
            </span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-[#8E8E93]">
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-[#D2F865]" />
              <span>Korean Audio with English Subtitles</span>
            </div>
            <span>HD 1080p</span>
          </div>
        </div>

        {/* 3 Pillars Summary */}
        <div className="space-y-3 mb-8">
          <div className="p-4 rounded-xl bg-[#141414] border border-[#202020]">
            <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm mb-1">
              <Check className="w-4 h-4 text-[#D2F865]" />
              <span>Pillar 1: Zero Romanization from Day 1</span>
            </div>
            <p className="text-xs text-[#8E8E93] pl-6 leading-relaxed">
              English letters distort Korean mouth placement. We train you directly on King Sejong’s
              vocal tract biomechanics so your consonants ring crisp and native.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#141414] border border-[#202020]">
            <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm mb-1">
              <Check className="w-4 h-4 text-[#D2F865]" />
              <span>Pillar 2: 80% Active Spoken Share</span>
            </div>
            <p className="text-xs text-[#8E8E93] pl-6 leading-relaxed">
              With batches capped at 5 students, no one hides behind a muted screen. You speak Korean
              for at least 35 minutes in every 75-minute session.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#141414] border border-[#202020]">
            <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm mb-1">
              <Check className="w-4 h-4 text-[#D2F865]" />
              <span>Pillar 3: AI Speech Lab Diagnostic</span>
            </div>
            <p className="text-xs text-[#8E8E93] pl-6 leading-relaxed">
              Our 24/7 acoustic model listens to your recorded drills and pinpoints subtle intonation
              and batchim assimilation errors before bad habits solidify.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1C1C1C]">
          <div className="text-xs text-[#7A7A7A] text-center sm:text-left">
            Next cohort admissions close Sunday midnight KST
          </div>
          <button
            onClick={() => {
              onClose();
              onBookTrial();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#D2F865] hover:bg-[#c2e855] text-xs font-bold text-[#0A0A0A] flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Book 1-on-1 Diagnostic Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
