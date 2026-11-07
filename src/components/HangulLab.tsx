import { useState, useRef, useEffect } from 'react';
import { Volume2, Sparkles, Check, Play, Loader2, Zap } from 'lucide-react';
import type { HangulChar } from '../types';
import {
  playHangulAudio,
  stopAudio,
  isElevenLabsConfigured,
  getVoiceId,
} from '../utils/audioManager';

export type HangulCategory = 'consonants' | 'double_consonants' | 'vowels' | 'compound_vowels' | 'batchim';

// 1. Basic Consonants (14)
export const BASIC_CONSONANTS: HangulChar[] = [
  { char: 'ㄱ', name: 'Giyeok', romaja: 'g/k', meaning: 'Gun / Hook', type: 'consonant', ipa: '[k/g]', speechText: '기역' },
  { char: 'ㄴ', name: 'Nieun', romaja: 'n', meaning: 'Nose / Corner', type: 'consonant', ipa: '[n]', speechText: '니은' },
  { char: 'ㄷ', name: 'Digeut', romaja: 'd/t', meaning: 'Door / Step', type: 'consonant', ipa: '[t/d]', speechText: '디귿' },
  { char: 'ㄹ', name: 'Rieul', romaja: 'r/l', meaning: 'Rope / River', type: 'consonant', ipa: '[ɾ/l]', speechText: '리을' },
  { char: 'ㅁ', name: 'Mieum', romaja: 'm', meaning: 'Mouth / Square', type: 'consonant', ipa: '[m]', speechText: '미음' },
  { char: 'ㅂ', name: 'Bieup', romaja: 'b/p', meaning: 'Bucket / Space', type: 'consonant', ipa: '[p/b]', speechText: '비읍' },
  { char: 'ㅅ', name: 'Siot', romaja: 's', meaning: 'Stand / Person', type: 'consonant', ipa: '[s]', speechText: '시옷' },
  { char: 'ㅇ', name: 'Ieung', romaja: 'silent / ng', meaning: 'Circle / Origin', type: 'consonant', ipa: '[ŋ]', speechText: '이응' },
  { char: 'ㅈ', name: 'Jieut', romaja: 'j', meaning: 'Crown / Joint', type: 'consonant', ipa: '[tɕ]', speechText: '지읒' },
  { char: 'ㅊ', name: 'Chieut', romaja: 'ch', meaning: 'Sky / Chimney', type: 'consonant', ipa: '[tɕʰ]', speechText: '치읓' },
  { char: 'ㅋ', name: 'Kieuk', romaja: "k'", meaning: 'Key / Sharp', type: 'consonant', ipa: '[kʰ]', speechText: '키읔' },
  { char: 'ㅌ', name: 'Tieut', romaja: "t'", meaning: 'Table / Spark', type: 'consonant', ipa: '[tʰ]', speechText: '티읕' },
  { char: 'ㅍ', name: 'Pieup', romaja: "p'", meaning: 'Part / Peak', type: 'consonant', ipa: '[pʰ]', speechText: '피읖' },
  { char: 'ㅎ', name: 'Hieut', romaja: 'h', meaning: 'Heart / Hat', type: 'consonant', ipa: '[h]', speechText: '히읗' },
];

// 2. Double Consonants (5)
export const DOUBLE_CONSONANTS: HangulChar[] = [
  { char: 'ㄲ', name: 'Ssanggiyeok', romaja: 'kk', meaning: 'Tense K (Twin Hook)', type: 'double_consonant', ipa: '[k͈]', speechText: '쌍기역' },
  { char: 'ㄸ', name: 'Ssangdigeut', romaja: 'tt', meaning: 'Tense T (Twin Door)', type: 'double_consonant', ipa: '[t͈]', speechText: '쌍디귿' },
  { char: 'ㅃ', name: 'Ssangbieup', romaja: 'pp', meaning: 'Tense P (Twin Bucket)', type: 'double_consonant', ipa: '[p͈]', speechText: '쌍비읍' },
  { char: 'ㅆ', name: 'Ssangsiot', romaja: 'ss', meaning: 'Tense S (Twin Peak)', type: 'double_consonant', ipa: '[s͈]', speechText: '쌍시옷' },
  { char: 'ㅉ', name: 'Ssangjieut', romaja: 'jj', meaning: 'Tense J (Twin Crown)', type: 'double_consonant', ipa: '[tɕ͈]', speechText: '쌍지읒' },
];

// 3. Basic Vowels (10)
export const BASIC_VOWELS: HangulChar[] = [
  { char: 'ㅏ', name: 'A', romaja: 'a', meaning: 'Father [아]', type: 'vowel', ipa: '[a]', speechText: '아' },
  { char: 'ㅑ', name: 'Ya', romaja: 'ya', meaning: 'Yard [야]', type: 'vowel', ipa: '[ja]', speechText: '야' },
  { char: 'ㅓ', name: 'Eo', romaja: 'eo', meaning: 'Cup / Sun [어]', type: 'vowel', ipa: '[ʌ]', speechText: '어' },
  { char: 'ㅕ', name: 'Yeo', romaja: 'yeo', meaning: 'Young [여]', type: 'vowel', ipa: '[jʌ]', speechText: '여' },
  { char: 'ㅗ', name: 'O', romaja: 'o', meaning: 'Low / Glow [오]', type: 'vowel', ipa: '[o]', speechText: '오' },
  { char: 'ㅛ', name: 'Yo', romaja: 'yo', meaning: 'Yacht [요]', type: 'vowel', ipa: '[jo]', speechText: '요' },
  { char: 'ㅜ', name: 'U', romaja: 'u', meaning: 'Moon / Boot [우]', type: 'vowel', ipa: '[u]', speechText: '우' },
  { char: 'ㅠ', name: 'Yu', romaja: 'yu', meaning: 'Youth / You [유]', type: 'vowel', ipa: '[ju]', speechText: '유' },
  { char: 'ㅡ', name: 'Eu', romaja: 'eu', meaning: 'Brook [으]', type: 'vowel', ipa: '[ɯ]', speechText: '으' },
  { char: 'ㅣ', name: 'I', romaja: 'i', meaning: 'Meet / Tree [이]', type: 'vowel', ipa: '[i]', speechText: '이' },
];

// 4. Compound Vowels (11)
export const COMPOUND_VOWELS: HangulChar[] = [
  { char: 'ㅐ', name: 'Ae', romaja: 'ae', meaning: 'Apple [애]', type: 'compound_vowel', ipa: '[ɛ]', speechText: '애' },
  { char: 'ㅒ', name: 'Yae', romaja: 'yae', meaning: 'Yay [얘]', type: 'compound_vowel', ipa: '[jɛ]', speechText: '얘' },
  { char: 'ㅔ', name: 'E', romaja: 'e', meaning: 'Bed [에]', type: 'compound_vowel', ipa: '[e]', speechText: '에' },
  { char: 'ㅖ', name: 'Ye', romaja: 'ye', meaning: 'Yes [예]', type: 'compound_vowel', ipa: '[je]', speechText: '예' },
  { char: 'ㅘ', name: 'Wa', romaja: 'wa', meaning: 'Water [와]', type: 'compound_vowel', ipa: '[wa]', speechText: '와' },
  { char: 'ㅙ', name: 'Wae', romaja: 'wae', meaning: 'Wait / Why [왜]', type: 'compound_vowel', ipa: '[wɛ]', speechText: '왜' },
  { char: 'ㅚ', name: 'Oe', romaja: 'oe', meaning: 'Wave [외]', type: 'compound_vowel', ipa: '[we]', speechText: '외' },
  { char: 'ㅝ', name: 'Wo', romaja: 'wo', meaning: 'Wonder [워]', type: 'compound_vowel', ipa: '[wʌ]', speechText: '워' },
  { char: 'ㅞ', name: 'We', romaja: 'we', meaning: 'Wedding [웨]', type: 'compound_vowel', ipa: '[we]', speechText: '웨' },
  { char: 'ㅟ', name: 'Wi', romaja: 'wi', meaning: 'We / Wind [위]', type: 'compound_vowel', ipa: '[wi]', speechText: '위' },
  { char: 'ㅢ', name: 'Ui', romaja: 'ui', meaning: 'Wisdom [의]', type: 'compound_vowel', ipa: '[ɰi]', speechText: '의' },
];

// 5. Batchim (7 Representative Final Sounds)
export const BATCHIM: HangulChar[] = [
  { char: 'ㄱ', name: 'Final K', romaja: 'k', meaning: 'Book [책] - Final K', type: 'batchim', ipa: '[k̚]', speechText: '책' },
  { char: 'ㄴ', name: 'Final N', romaja: 'n', meaning: 'Eye [눈] - Final N', type: 'batchim', ipa: '[n]', speechText: '눈' },
  { char: 'ㄷ', name: 'Final T', romaja: 't', meaning: 'Clothes [옷] - Final T', type: 'batchim', ipa: '[t̚]', speechText: '옷' },
  { char: 'ㄹ', name: 'Final L', romaja: 'l', meaning: 'Moon [달] - Final L', type: 'batchim', ipa: '[l]', speechText: '달' },
  { char: 'ㅁ', name: 'Final M', romaja: 'm', meaning: 'Night [밤] - Final M', type: 'batchim', ipa: '[m]', speechText: '밤' },
  { char: 'ㅂ', name: 'Final P', romaja: 'p', meaning: 'Rice [밥] - Final P', type: 'batchim', ipa: '[p̚]', speechText: '밥' },
  { char: 'ㅇ', name: 'Final NG', romaja: 'ng', meaning: 'River [강] - Final NG', type: 'batchim', ipa: '[ŋ]', speechText: '강' },
];

export const ALL_CATEGORIES_DATA: Record<HangulCategory, HangulChar[]> = {
  consonants: BASIC_CONSONANTS,
  double_consonants: DOUBLE_CONSONANTS,
  vowels: BASIC_VOWELS,
  compound_vowels: COMPOUND_VOWELS,
  batchim: BATCHIM,
};

const TABS: { id: HangulCategory; label: string; korean: string; count: number }[] = [
  { id: 'consonants', label: 'Basic Consonants', korean: '기본 자음', count: 14 },
  { id: 'double_consonants', label: 'Double Consonants', korean: '쌍자음', count: 5 },
  { id: 'vowels', label: 'Basic Vowels', korean: '기본 모음', count: 10 },
  { id: 'compound_vowels', label: 'Compound Vowels', korean: '이중 모음', count: 11 },
  { id: 'batchim', label: 'Batchim', korean: '대표 받침', count: 7 },
];

export function HangulLab() {
  const [activeCategory, setActiveCategory] = useState<HangulCategory>('consonants');
  const [activeChar, setActiveChar] = useState<HangulChar>(BASIC_CONSONANTS[0]);
  const [practiceSuccess, setPracticeSuccess] = useState(false);
  const [loadingChar, setLoadingChar] = useState<string | null>(null);
  const [playingChar, setPlayingChar] = useState<string | null>(null);

  // 200ms Tap Animation State for tactile physical feel
  const [tappedChar, setTappedChar] = useState<string | null>(null);
  const tapTimeoutRef = useRef<number | null>(null);

  const lastTouchTimeRef = useRef<number>(0);
  const configured = isElevenLabsConfigured();
  const voiceId = getVoiceId();

  /**
   * Triggers a 200ms shrink & glowing border animation
   */
  const triggerTapAnimation = (key: string) => {
    if (tapTimeoutRef.current) {
      window.clearTimeout(tapTimeoutRef.current);
    }
    setTappedChar(key);
    tapTimeoutRef.current = window.setTimeout(() => {
      setTappedChar(null);
    }, 200);
  };

  /**
   * Triggers ElevenLabs Text-to-Speech API playback via audioManager
   */
  const handlePlayLetter = async (item: HangulChar) => {
    setActiveChar(item);
    setPracticeSuccess(false);

    const charKey = `${item.char}-${item.type}`;
    setLoadingChar(charKey);

    const textToSpeak = item.speechText || item.char;

    try {
      await playHangulAudio(
        textToSpeak,
        () => {
          setLoadingChar(null);
          setPlayingChar(null);
          setPracticeSuccess(true);
          setTimeout(() => setPracticeSuccess(false), 1200);
        },
        (err) => {
          console.error('ElevenLabs TTS error for', item.char, err);
          setLoadingChar(null);
          setPlayingChar(null);
        }
      );

      setLoadingChar(null);
      setPlayingChar(charKey);
    } catch (err) {
      console.error('Playback error:', err);
      setLoadingChar(null);
      setPlayingChar(null);
    }
  };

  /**
   * Touch & Click debouncer to prevent mobile double-triggering
   * Immediately triggers tap animation and calls audio playback directly
   */
  const handleInteraction = (item: HangulChar, isTouch: boolean) => {
    const itemKey = `${item.char}-${item.type}`;
    triggerTapAnimation(itemKey);

    const now = Date.now();
    if (isTouch) {
      lastTouchTimeRef.current = now;
    } else if (now - lastTouchTimeRef.current < 500) {
      return; // Skip synthetic click following touchstart
    }
    handlePlayLetter(item);
  };

  const handleCategoryChange = (category: HangulCategory) => {
    stopAudio();
    setActiveCategory(category);
    const categoryItems = ALL_CATEGORIES_DATA[category];
    if (categoryItems && categoryItems.length > 0) {
      setActiveChar(categoryItems[0]);
    }
  };

  const currentItems = ALL_CATEGORIES_DATA[activeCategory] || BASIC_CONSONANTS;
  const activeCharKey = `${activeChar.char}-${activeChar.type}`;
  const isSelectedLoading = loadingChar === activeCharKey;
  const isSelectedPlaying = playingChar === activeCharKey;
  const isSelectedTapped = tappedChar === activeCharKey;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        window.clearTimeout(tapTimeoutRef.current);
      }
      stopAudio();
    };
  }, []);

  return (
    <div className="py-8 sm:py-16 w-full max-w-full overflow-hidden">
      <div className="p-5 sm:p-8 lg:p-10 rounded-3xl bg-[#0F0F0F] border border-[#222222] relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 bg-[#D2F865]/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start lg:items-center">
          {/* Left Info Spotlight */}
          <div className="lg:col-span-5 w-full">
            <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#282828] text-xs text-[#A0A0A0]">
                <Sparkles className="w-3.5 h-3.5 text-[#D2F865]" />
                <span className="font-semibold text-white">ElevenLabs TTS</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161616] border border-[#2c2c2c] text-xs text-[#8E8E93]">
                <span className={`w-2 h-2 rounded-full ${configured ? 'bg-[#D2F865]' : 'bg-emerald-400'}`} />
                <span className="text-[11px] text-[#A0A0A0]">
                  Voice: {voiceId === '21m00Tcm4TlvDq8ikWAM' ? 'Sarah' : voiceId.slice(0, 6)} • eleven_multilingual_v2
                </span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1a1a1a] border border-[#333333] text-[10px] text-[#D2F865]">
                <Zap className="w-2.5 h-2.5" />
                <span>Tactile Press</span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 sm:mb-3">
              Hear the Scientific Anatomy of Hangul.
            </h3>
            <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed mb-5">
              Engineered in 1443 by King Sejong the Great. Every letter mimics the exact oral posture
              of human speech organs. Powered by ElevenLabs Multilingual V2 Text-to-Speech.
            </p>

            {/* Selected Card Spotlight */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#262626] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <span
                  className={`text-3xl sm:text-4xl font-black text-[#D2F865] tracking-tight shrink-0 transition-transform duration-200 ${
                    isSelectedTapped ? 'scale-110 drop-shadow-[0_0_12px_rgba(210,248,101,0.8)]' : ''
                  }`}
                >
                  {activeChar.char}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-white truncate">
                      {activeChar.name}
                    </span>
                    <span className="text-xs font-mono text-[#7A7A7A] shrink-0">{activeChar.ipa}</span>
                  </div>
                  <div className="text-xs text-[#8E8E93] truncate">{activeChar.meaning}</div>
                  <div className="text-[11px] text-[#D2F865]/80 font-mono mt-0.5">
                    Romaja: {activeChar.romaja} • Pronunciation: {activeChar.speechText || activeChar.char}
                  </div>
                </div>
              </div>

              {/* Spotlight Play Button with 200ms Press Animation */}
              <button
                type="button"
                onTouchStart={() => handleInteraction(activeChar, true)}
                onClick={() => handleInteraction(activeChar, false)}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm shrink-0 active:scale-90 ${
                  isSelectedTapped
                    ? 'scale-90 bg-[#D2F865] text-[#0A0A0A] border-[#D2F865] shadow-[0_0_20px_rgba(210,248,101,0.7)]'
                    : 'bg-[#202020] hover:bg-[#D2F865] text-white hover:text-[#0A0A0A] border-[#333333] hover:border-[#D2F865]'
                } disabled:opacity-50`}
                aria-label={`Play ElevenLabs pronunciation for ${activeChar.char}`}
                title="Play Hangul pronunciation"
              >
                {practiceSuccess ? (
                  <Check className="w-5 h-5 text-[#D2F865]" />
                ) : isSelectedLoading ? (
                  <Loader2 className="w-5 h-5 text-[#D2F865] animate-spin" />
                ) : isSelectedPlaying ? (
                  <Volume2 className="w-5 h-5 animate-pulse text-[#D2F865]" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5 fill-current" />
                )}
              </button>
            </div>
          </div>

          {/* Right Selector Grid */}
          <div className="lg:col-span-7 w-full min-w-0">
            {/* Category Toggle Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto pb-1.5 no-scrollbar touch-pan-x">
              {TABS.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onTouchStart={() => handleCategoryChange(tab.id)}
                    onClick={() => handleCategoryChange(tab.id)}
                    className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 active:scale-95 ${
                      isActive
                        ? 'bg-[#D2F865] text-[#0A0A0A] shadow-[0_0_15px_rgba(210,248,101,0.2)]'
                        : 'bg-[#141414] text-[#A0A0A0] hover:text-white border border-[#222222] hover:border-[#383838]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="text-[11px] ml-1 opacity-70">({tab.korean})</span>
                  </button>
                );
              })}
            </div>

            {/* Letter Grid with Tactile 200ms Tap Animation */}
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3 max-h-[380px] overflow-y-auto pr-1">
              {currentItems.map((item, idx) => {
                const itemKey = `${item.char}-${item.type}`;
                const isSelected = activeChar.char === item.char && activeChar.name === item.name;
                const isItemLoading = loadingChar === itemKey;
                const isItemPlaying = playingChar === itemKey;
                const isTapped = tappedChar === itemKey;

                return (
                  <button
                    key={`${item.char}-${item.type}-${idx}`}
                    type="button"
                    onTouchStart={() => handleInteraction(item, true)}
                    onClick={() => handleInteraction(item, false)}
                    className={`p-3 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-24 sm:h-28 group relative active:scale-90 select-none ${
                      isTapped
                        ? 'scale-90 border-[#D2F865] ring-2 ring-[#D2F865]/70 shadow-[0_0_25px_rgba(210,248,101,0.65)] bg-[#1e1e1e]'
                        : isSelected
                        ? 'bg-[#181818] border-[#D2F865] shadow-[0_0_15px_rgba(210,248,101,0.15)]'
                        : 'bg-[#121212] border-[#202020] hover:border-[#383838] hover:bg-[#151515]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xl sm:text-2xl font-bold transition-all duration-200 ${
                          isTapped
                            ? 'text-[#D2F865] scale-110 drop-shadow-[0_0_8px_rgba(210,248,101,0.8)]'
                            : isSelected
                            ? 'text-[#D2F865]'
                            : 'text-white group-hover:text-[#E0E0E0]'
                        }`}
                      >
                        {item.char}
                      </span>
                      {isItemLoading ? (
                        <Loader2 className="w-4 h-4 text-[#D2F865] animate-spin" />
                      ) : isItemPlaying ? (
                        <Volume2 className="w-4 h-4 text-[#D2F865] animate-pulse" />
                      ) : (
                        <Volume2
                          className={`w-4 h-4 transition-colors ${
                            isTapped || isSelected ? 'text-[#D2F865]' : 'text-[#555555] group-hover:text-white'
                          }`}
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#D0D0D0] truncate">{item.romaja}</div>
                      <div className="text-[10px] sm:text-[11px] text-[#737373] truncate">
                        {item.meaning}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-[#666666]">
              <span>* ElevenLabs TTS (model: eleven_multilingual_v2)</span>
              <span>200ms Tactile Press Feedback</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
