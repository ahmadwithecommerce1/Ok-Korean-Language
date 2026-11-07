/**
 * ElevenLabs Text-to-Speech (TTS) Audio Manager for Hangul Phoneme Lab
 * 
 * Uses ElevenLabs API:
 * Endpoint: https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}
 * Method: POST
 * Model: eleven_multilingual_v2 (Full Korean support)
 * Auth: xi-api-key header from VITE_ELEVENLABS_API_KEY
 */

// In-memory cache for audio Blob URLs to enable instant re-playback and save API credits
const audioUrlCache = new Map<string, string>();
let currentActiveAudio: HTMLAudioElement | null = null;

// Sarah Voice ID: 21m00Tcm4TlvDq8ikWAM
export const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

export function getVoiceId(): string {
  const envVoice = import.meta.env.VITE_ELEVENLABS_VOICE_ID;
  if (envVoice && envVoice.trim() && envVoice !== 'YOUR_VOICE_ID' && envVoice !== 'YAHAN_APNI_VOICE_ID_DAALEIN') {
    return envVoice.trim();
  }
  return DEFAULT_VOICE_ID;
}

export function getApiKey(): string {
  const key = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (key && key.trim() && key !== 'YOUR_ELEVENLABS_API_KEY') {
    return key.trim();
  }
  return 'sk_aac20910654a4ba45e7908a1711902342260eac6dca0c567';
}

export function isElevenLabsConfigured(): boolean {
  return Boolean(getApiKey());
}

/**
 * Phoneme pronunciation map to ensure single Hangul letters are pronounced naturally
 */
export const HANGUL_SPEECH_MAP: Record<string, string> = {
  // 14 Basic Consonants
  'ㄱ': '기역',
  'ㄴ': '니은',
  'ㄷ': '디귿',
  'ㄹ': '리을',
  'ㅁ': '미음',
  'ㅂ': '비읍',
  'ㅅ': '시옷',
  'ㅇ': '이응',
  'ㅈ': '지읒',
  'ㅊ': '치읓',
  'ㅋ': '키읔',
  'ㅌ': '티읕',
  'ㅍ': '피읖',
  'ㅎ': '히읗',

  // 5 Double Consonants
  'ㄲ': '쌍기역',
  'ㄸ': '쌍디귿',
  'ㅃ': '쌍비읍',
  'ㅆ': '쌍시옷',
  'ㅉ': '쌍지읒',

  // 10 Basic Vowels
  'ㅏ': '아',
  'ㅑ': '야',
  'ㅓ': '어',
  'ㅕ': '여',
  'ㅗ': '오',
  'ㅛ': '요',
  'ㅜ': '우',
  'ㅠ': '유',
  'ㅡ': '으',
  'ㅣ': '이',

  // 11 Compound Vowels
  'ㅐ': '애',
  'ㅒ': '얘',
  'ㅔ': '에',
  'ㅖ': '예',
  'ㅘ': '와',
  'ㅙ': '왜',
  'ㅚ': '외',
  'ㅝ': '워',
  'ㅞ': '웨',
  'ㅟ': '위',
  'ㅢ': '의',
};

/**
 * Stops any active audio currently playing
 */
export function stopAudio(): void {
  if (currentActiveAudio) {
    try {
      currentActiveAudio.pause();
      currentActiveAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentActiveAudio = null;
  }
}

/**
 * Plays audio using Web SpeechSynthesis as a reliable backup
 * if ElevenLabs API key is not yet set or during network offline
 */
function playSpeechSynthesisFallback(
  textToSpeak: string,
  onEnded?: () => void,
  onError?: (err: unknown) => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.(new Error('SpeechSynthesis not supported'));
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.85; // Slightly slower for clear phonetic learning
    utterance.pitch = 1.0;

    // Pick Korean voice if available
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find((v) => v.lang.startsWith('ko') || v.lang.includes('KR'));
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    utterance.onend = () => {
      onEnded?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      onError?.(e);
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Fallback speech failed:', err);
    onError?.(err);
  }
}

/**
 * Plays Hangul pronunciation using ElevenLabs Text-to-Speech API
 * 
 * 1. Checks memory cache for instant playback (0ms, 0 credits used)
 * 2. Fetches audio blob from https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}
 * 3. Creates Audio element with playsInline for seamless mobile playback
 * 4. Falls back gracefully to native Korean speech synthesis if API key is not yet configured
 * 
 * @param text The Hangul character or speech text
 * @param onEnded Callback when playback finishes
 * @param onError Callback when error occurs
 */
export async function playHangulAudio(
  text: string,
  onEnded?: () => void,
  onError?: (err: unknown) => void
): Promise<HTMLAudioElement | null> {
  const cleanText = text.trim();
  const textToSpeak = HANGUL_SPEECH_MAP[cleanText] || cleanText;

  // Stop any active audio
  stopAudio();

  // 1. Instant playback if already cached in memory
  const cachedUrl = audioUrlCache.get(textToSpeak);
  if (cachedUrl) {
    try {
      const audio = new Audio(cachedUrl);
      audio.setAttribute('playsinline', 'true');
      (audio as unknown as { playsInline?: boolean }).playsInline = true;
      currentActiveAudio = audio;

      audio.onended = () => {
        if (currentActiveAudio === audio) {
          currentActiveAudio = null;
        }
        onEnded?.();
      };

      audio.onerror = (e) => {
        console.error('Playback error for cached ElevenLabs audio:', e);
        if (currentActiveAudio === audio) {
          currentActiveAudio = null;
        }
        onError?.(e);
      };

      await audio.play();
      return audio;
    } catch (cachedErr) {
      console.warn('Cached audio playback failed, clearing and re-fetching:', cachedErr);
      audioUrlCache.delete(textToSpeak);
    }
  }

  // 2. Check for configured ElevenLabs API key
  const apiKey = getApiKey();
  const voiceId = getVoiceId();

  if (!apiKey) {
    console.info(
      'ElevenLabs API key not configured in .env (VITE_ELEVENLABS_API_KEY). Using high-quality Korean speech fallback.'
    );
    playSpeechSynthesisFallback(textToSpeak, onEnded, onError);
    return null;
  }

  // 3. Fetch from ElevenLabs API
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: textToSpeak,
        model_id: 'eleven_multilingual_v2',
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`ElevenLabs API HTTP ${response.status}: ${errorBody}`);
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);

    // Cache URL for subsequent instant clicks
    audioUrlCache.set(textToSpeak, audioUrl);

    // 4. Play the audio with mobile playsInline attribute
    const audio = new Audio(audioUrl);
    audio.setAttribute('playsinline', 'true');
    (audio as unknown as { playsInline?: boolean }).playsInline = true;
    currentActiveAudio = audio;

    audio.onended = () => {
      if (currentActiveAudio === audio) {
        currentActiveAudio = null;
      }
      onEnded?.();
    };

    audio.onerror = (e) => {
      console.error('ElevenLabs audio playback error:', e);
      if (currentActiveAudio === audio) {
        currentActiveAudio = null;
      }
      onError?.(e);
    };

    await audio.play();
    return audio;
  } catch (error) {
    console.error('ElevenLabs TTS request failed:', error);
    // Graceful fallback to speech synthesis so user still gets audio
    playSpeechSynthesisFallback(textToSpeak, onEnded, onError);
    return null;
  }
}

// Alias for backwards compatibility
export const playHangulSound = playHangulAudio;

/**
 * Global unlock listener for iOS / Safari audio restrictions
 */
export function attachGlobalAudioUnlockListeners(): void {
  if (typeof window === 'undefined') return;

  const unlockAudio = () => {
    // Warm up speech synthesis voices if available
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.getVoices();
      } catch {
        // ignore
      }
    }
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('touchend', unlockAudio);
    window.removeEventListener('click', unlockAudio);
  };

  window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
  window.addEventListener('touchend', unlockAudio, { passive: true, once: true });
  window.addEventListener('click', unlockAudio, { passive: true, once: true });
}
