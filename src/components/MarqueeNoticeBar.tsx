import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue, type Database } from 'firebase/database';

// Firebase configuration for real-time synchronization
const firebaseConfig = {
  apiKey: "AIzaSyDOflQBHU_zmXZmgayqiGM4zokzJaTsqOo",
  authDomain: "ok-web-dashboared.firebaseapp.com",
  databaseURL: "https://ok-web-dashboared-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ok-web-dashboared",
  storageBucket: "ok-web-dashboared.firebasestorage.app",
  messagingSenderId: "926104626658",
  appId: "1:926104626658:web:0b33a91fd31f06c146c5bb",
  measurementId: "G-VKPQ5CHB5G"
};

// Singleton Firebase App and RTDB initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db: Database = getDatabase(app, firebaseConfig.databaseURL);

export interface ScrollingTextSettings {
  text: string | string[];
  animationType?: string;
  speed?: string | number;
  updatedAt?: number;
}

const DEFAULT_MESSAGES = [
  'Welcome to OK Korean Language Center',
  '18+ Years of Excellence in Korean Language Education',
  'Learn from Expert Native Teachers',
  'Admission is open now',
  'TOPIK Preparation & Visa Guidance Available',
];

/**
 * Parses raw text input from Firebase into clean notice message strings
 */
export function parseMessages(rawText: unknown): string[] {
  if (!rawText) return DEFAULT_MESSAGES;

  if (Array.isArray(rawText)) {
    const list = rawText.map(String).map((s) => s.trim()).filter(Boolean);
    return list.length > 0 ? list : DEFAULT_MESSAGES;
  }

  if (typeof rawText === 'string') {
    const trimmed = rawText.trim();
    if (!trimmed) return DEFAULT_MESSAGES;

    if (trimmed.includes('★')) {
      const parts = trimmed.split('★').map((s) => s.trim()).filter(Boolean);
      return parts.length > 0 ? parts : [trimmed];
    }
    if (trimmed.includes('|')) {
      const parts = trimmed.split('|').map((s) => s.trim()).filter(Boolean);
      return parts.length > 0 ? parts : [trimmed];
    }
    if (trimmed.includes('\n')) {
      const parts = trimmed.split('\n').map((s) => s.trim()).filter(Boolean);
      return parts.length > 0 ? parts : [trimmed];
    }
    return [trimmed];
  }

  return DEFAULT_MESSAGES;
}

export function MarqueeNoticeBar() {
  const [settings, setSettings] = useState<ScrollingTextSettings | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Real-time listener for `/scrolling_text_settings` node
  useEffect(() => {
    const scrollingRef = ref(db, 'scrolling_text_settings');

    const unsubscribe = onValue(
      scrollingRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val && val.text && String(val.text).trim().length > 0) {
          setSettings({
            text: val.text,
            animationType: val.animationType,
            speed: val.speed,
            updatedAt: val.updatedAt || Date.now(),
          });
        } else {
          setSettings(null);
        }
      },
      (error) => {
        console.error('Firebase onValue error on /scrolling_text_settings:', error);
        setSettings(null);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const messages = useMemo(() => parseMessages(settings?.text), [settings?.text]);

  // When multiple messages exist, gently switch between them in-place with zero horizontal scrolling
  useEffect(() => {
    if (messages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const currentMessage = messages[currentIdx] || messages[0] || 'Welcome to OK Korean Language Center';

  return (
    <div
      className="w-full relative overflow-hidden bg-[#060709]/95 backdrop-blur-md select-none z-40 transition-colors duration-300 border-t border-[#D2F865]/20 border-b border-[#D2F865]/30 shadow-[0_0_15px_rgba(210,248,101,0.08)]"
      aria-label="Official Important Notice"
    >
      {/* Vignette Gradients */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#060709] via-[#060709]/80 to-transparent z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#060709] via-[#060709]/80 to-transparent z-10"
        aria-hidden="true"
      />

      {/* Target Element: div:nth-of-type(3) - Completely Stopped Scrolling (Static In-Place Notice) */}
      <div className="py-1.5 sm:py-2 px-4 flex items-center justify-center text-center overflow-hidden">
        <div className="flex items-center justify-center gap-2.5 max-w-4xl mx-auto truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D2F865] shrink-0 drop-shadow-[0_0_6px_rgba(210,248,101,0.9)]" />
          <span
            key={currentIdx}
            className="text-xs sm:text-[13px] tracking-wide text-[#EAEAEA] font-medium transition-opacity duration-300 truncate"
          >
            {currentMessage}
          </span>
          {messages.length > 1 && (
            <span className="text-[10px] text-[#71717a] font-mono shrink-0 hidden sm:inline-block">
              ({currentIdx + 1}/{messages.length})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
