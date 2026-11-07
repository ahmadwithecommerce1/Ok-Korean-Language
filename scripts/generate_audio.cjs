const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.join(__dirname, '..', 'public', 'audio', 'hangul');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function writeWav(filename, samples, sampleRate = 44100) {
  const numSamples = samples.length;
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // SubChunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(1, 22);  // NumChannels (1 mono)
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
  buffer.writeUInt16LE(2, 32);  // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample (16 bits)

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  // Write 16-bit PCM samples with gentle saturation
  for (let i = 0; i < numSamples; i++) {
    let s = samples[i];
    s = Math.max(-1, Math.min(1, s));
    const intVal = Math.floor(s < 0 ? s * 32768 : s * 32767);
    buffer.writeInt16LE(intVal, 44 + i * 2);
  }

  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

const sampleRate = 44100;

function createBiquad(type, freq, q, sr = 44100) {
  const w0 = (2 * Math.PI * freq) / sr;
  const alpha = Math.sin(w0) / (2 * q);
  const cosw0 = Math.cos(w0);

  let b0 = 0, b1 = 0, b2 = 0, a0 = 1, a1 = 0, a2 = 0;

  if (type === 'bandpass') {
    b0 = alpha;
    b1 = 0;
    b2 = -alpha;
    a0 = 1 + alpha;
    a1 = -2 * cosw0;
    a2 = 1 - alpha;
  } else if (type === 'lowpass') {
    b0 = (1 - cosw0) / 2;
    b1 = 1 - cosw0;
    b2 = (1 - cosw0) / 2;
    a0 = 1 + alpha;
    a1 = -2 * cosw0;
    a2 = 1 - alpha;
  }

  // Normalize coefficients
  b0 /= a0;
  b1 /= a0;
  b2 /= a0;
  a1 /= a0;
  a2 /= a0;

  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;

  return function filter(x) {
    const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
    return y;
  };
}

function synthesizeVowel(f1, f2, f3 = 2800, duration = 0.45, isGlide = false, f2Start = 2200, f1Start = null) {
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);

  const filter1Static = createBiquad('bandpass', f1, 6, sampleRate);
  const filter2Static = createBiquad('bandpass', f2, 8, sampleRate);
  const filter3Static = createBiquad('bandpass', f3, 10, sampleRate);

  let phase = 0;
  const basePitch = 160;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const currentPitch = basePitch - 15 * (t / duration); // gentle natural pitch declination
    phase += (2 * Math.PI * currentPitch) / sampleRate;

    // Rich vocal cord harmonic structure
    let glottal = 0;
    for (let h = 1; h <= 14; h++) {
      glottal += (Math.sin(phase * h) / Math.pow(h, 1.15));
    }
    glottal *= 0.16;

    // Amplitude envelope
    const attack = Math.min(1, t / 0.04);
    const decay = Math.max(0, 1 - Math.pow(t / duration, 1.8));
    const env = attack * decay;

    let f2Active = f2;
    let f1Active = f1;
    if (isGlide && t < 0.16) {
      const glideProgress = t / 0.16;
      f2Active = f2Start + (f2 - f2Start) * glideProgress;
      if (f1Start !== null) {
        f1Active = f1Start + (f1 - f1Start) * glideProgress;
      }
    }

    const currentF1 = (isGlide && f1Start !== null) ? createBiquad('bandpass', f1Active, 6, sampleRate) : filter1Static;
    const currentF2 = isGlide ? createBiquad('bandpass', f2Active, 8, sampleRate) : filter2Static;

    const out1 = (isGlide && f1Start !== null ? currentF1(glottal) : filter1Static(glottal)) * 1.8;
    const out2 = currentF2(glottal) * 1.4;
    const out3 = filter3Static(glottal) * 0.6;

    samples[i] = (out1 + out2 + out3) * env * 2.2;
  }
  return samples;
}

function synthesizeConsonant(char, romaja) {
  const duration = 0.42;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);

  const isSibilant = char === 'ㅅ' || char === 'ㅈ' || char === 'ㅊ';
  const isAspirated = char === 'ㅊ' || char === 'ㅋ' || char === 'ㅌ' || char === 'ㅍ' || char === 'ㅎ';
  const isNasal = char === 'ㄴ' || char === 'ㅁ' || char === 'ㅇ';
  const isLiquid = char === 'ㄹ';

  const noiseFilter = createBiquad(
    'bandpass',
    char === 'ㅅ' ? 5500 : char === 'ㅎ' ? 2000 : char === 'ㅊ' ? 4200 : 3200,
    3.5,
    sampleRate
  );

  const voiceFilter = createBiquad(
    'bandpass',
    isNasal ? 1100 : isLiquid ? 1400 : 1200,
    4.0,
    sampleRate
  );

  let phase = 0;
  const pitch = isNasal ? 210 : isLiquid ? 240 : 190;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    phase += (2 * Math.PI * pitch) / sampleRate;

    let noise = (Math.random() * 2 - 1);
    let voice = Math.sin(phase) * 0.7 + Math.sin(phase * 2) * 0.3;

    let signal = 0;
    if (isSibilant || char === 'ㅎ') {
      const noiseEnv = Math.exp(-12 * t) * (t < 0.2 ? 1 : 0);
      const voiceEnv = t > 0.08 ? Math.max(0, 1 - (t - 0.08) / 0.3) : 0;
      signal = noiseFilter(noise) * noiseEnv * 1.8 + voiceFilter(voice) * voiceEnv * 0.8;
    } else if (isAspirated) {
      const burstEnv = t < 0.08 ? Math.exp(-35 * t) : 0;
      const voiceEnv = t > 0.05 ? Math.max(0, 1 - (t - 0.05) / 0.35) : 0;
      signal = noiseFilter(noise) * burstEnv * 2.2 + voiceFilter(voice) * voiceEnv * 0.9;
    } else {
      const burst = t < 0.03 ? (Math.random() * 2 - 1) * Math.exp(-50 * t) : 0;
      const env = Math.min(1, t / 0.03) * Math.max(0, 1 - Math.pow(t / duration, 1.5));
      signal = burst * 0.8 + voiceFilter(voice) * env * 1.5;
    }

    samples[i] = Math.max(-1, Math.min(1, signal));
  }
  return samples;
}

// Double Consonants (tense/fortis): sharp unvoiced burst, high tension, higher pitch (240-270Hz)
function synthesizeDoubleConsonant(char, romaja) {
  const duration = 0.38;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);

  let burstFreq = 2800;
  if (char === 'ㄲ') burstFreq = 3400; // tense velar
  if (char === 'ㄸ') burstFreq = 4200; // tense alveolar
  if (char === 'ㅃ') burstFreq = 1600; // tense bilabial
  if (char === 'ㅆ') burstFreq = 6800; // tense sibilant
  if (char === 'ㅉ') burstFreq = 4800; // tense affricate

  const burstFilter = createBiquad('bandpass', burstFreq, 4.5, sampleRate);
  const vocalFilter = createBiquad('bandpass', 1200, 3.5, sampleRate);

  let phase = 0;
  const tensePitch = 250; // Distinctly higher fundamental frequency for fortis consonants

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    phase += (2 * Math.PI * (tensePitch - 20 * (t / duration))) / sampleRate;

    const noise = (Math.random() * 2 - 1);
    const voice = Math.sin(phase) * 0.8 + Math.sin(phase * 2) * 0.4 + Math.sin(phase * 3) * 0.2;

    let signal = 0;
    if (char === 'ㅆ') {
      // Tense sibilant: intense sharp hiss with abrupt onset
      const hissEnv = t < 0.02 ? (t / 0.02) : Math.exp(-14 * (t - 0.02));
      const voiceEnv = t > 0.06 ? Math.max(0, 1 - (t - 0.06) / 0.3) : 0;
      signal = burstFilter(noise) * hissEnv * 2.5 + vocalFilter(voice) * voiceEnv * 0.7;
    } else if (char === 'ㅉ') {
      // Tense affricate: sharp click followed by intense short frication
      const clickEnv = t < 0.02 ? Math.exp(-80 * t) : 0;
      const fricEnv = (t >= 0.015 && t < 0.12) ? Math.exp(-25 * (t - 0.015)) : 0;
      const voiceEnv = t > 0.04 ? Math.max(0, 1 - (t - 0.04) / 0.32) : 0;
      signal = burstFilter(noise) * (clickEnv * 2.8 + fricEnv * 1.8) + vocalFilter(voice) * voiceEnv * 0.85;
    } else {
      // ㄲ, ㄸ, ㅃ : Extremely crisp closure release with zero VOT (tense stop)
      const closurePop = t < 0.018 ? Math.exp(-100 * t) * (Math.random() * 2 - 1) : 0;
      const voiceEnv = t > 0.015 ? Math.max(0, 1 - Math.pow((t - 0.015) / (duration - 0.015), 1.6)) : 0;
      signal = burstFilter(closurePop) * 3.2 + vocalFilter(voice) * voiceEnv * 1.4;
    }

    samples[i] = Math.max(-1, Math.min(1, signal));
  }
  return samples;
}

function synthesizeBatchim(char, romaja) {
  const duration = 0.36;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);

  const isStop = char === 'ㄱ' || char === 'ㄷ' || char === 'ㅂ';
  const filter = createBiquad(
    'bandpass',
    char === 'ㅇ' ? 1800 : char === 'ㅁ' ? 850 : char === 'ㄴ' ? 1350 : 1100,
    4.5,
    sampleRate
  );

  let phase = 0;
  const basePitch = 220;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const pitch = isStop ? basePitch - 80 * (t / duration) : basePitch - 30 * (t / duration);
    phase += (2 * Math.PI * pitch) / sampleRate;

    const glottal = Math.sin(phase) * 0.6 + Math.sin(phase * 2) * 0.3 + Math.sin(phase * 3) * 0.15;
    const env = isStop
      ? (t < 0.18 ? Math.min(1, t / 0.02) * (1 - t / 0.22) : 0)
      : Math.min(1, t / 0.03) * Math.max(0, 1 - Math.pow(t / duration, 1.4));

    samples[i] = Math.max(-1, Math.min(1, filter(glottal) * env * 2.0));
  }
  return samples;
}

// 1. Basic Consonants (14)
const basicConsonants = [
  { char: 'ㄱ', romaja: 'giyeok' },
  { char: 'ㄴ', romaja: 'nieun' },
  { char: 'ㄷ', romaja: 'digeut' },
  { char: 'ㄹ', romaja: 'rieul' },
  { char: 'ㅁ', romaja: 'mieum' },
  { char: 'ㅂ', romaja: 'bieup' },
  { char: 'ㅅ', romaja: 'siot' },
  { char: 'ㅇ', romaja: 'ieung' },
  { char: 'ㅈ', romaja: 'jieut' },
  { char: 'ㅊ', romaja: 'chieut' },
  { char: 'ㅋ', romaja: 'kieuk' },
  { char: 'ㅌ', romaja: 'tieut' },
  { char: 'ㅍ', romaja: 'pieup' },
  { char: 'ㅎ', romaja: 'hieut' },
];

// 2. Double Consonants (5)
const doubleConsonants = [
  { char: 'ㄲ', romaja: 'ssanggiyeok' },
  { char: 'ㄸ', romaja: 'ssangdigeut' },
  { char: 'ㅃ', romaja: 'ssangbieup' },
  { char: 'ㅆ', romaja: 'ssangsiot' },
  { char: 'ㅉ', romaja: 'ssangjieut' },
];

// 3. Basic Vowels (10)
const basicVowels = [
  { char: 'ㅏ', romaja: 'a', f1: 820, f2: 1250, glide: false },
  { char: 'ㅑ', romaja: 'ya', f1: 780, f2: 1250, glide: true, f2Start: 2300 },
  { char: 'ㅓ', romaja: 'eo', f1: 600, f2: 1050, glide: false },
  { char: 'ㅕ', romaja: 'yeo', f1: 580, f2: 1050, glide: true, f2Start: 2300 },
  { char: 'ㅗ', romaja: 'o', f1: 460, f2: 840, glide: false },
  { char: 'ㅛ', romaja: 'yo', f1: 440, f2: 840, glide: true, f2Start: 2100 },
  { char: 'ㅜ', romaja: 'u', f1: 340, f2: 780, glide: false },
  { char: 'ㅠ', romaja: 'yu', f1: 330, f2: 780, glide: true, f2Start: 2100 },
  { char: 'ㅡ', romaja: 'eu', f1: 390, f2: 1480, glide: false },
  { char: 'ㅣ', romaja: 'i', f1: 280, f2: 2400, glide: false },
];

// 4. Compound Vowels (11)
const compoundVowels = [
  { char: 'ㅐ', romaja: 'ae', f1: 680, f2: 1950, glide: false },
  { char: 'ㅒ', romaja: 'yae', f1: 650, f2: 1950, glide: true, f2Start: 2400 },
  { char: 'ㅔ', romaja: 'e', f1: 500, f2: 2050, glide: false },
  { char: 'ㅖ', romaja: 'ye', f1: 480, f2: 2050, glide: true, f2Start: 2400 },
  { char: 'ㅘ', romaja: 'wa', f1: 820, f2: 1350, glide: true, f2Start: 750, f1Start: 450 },
  { char: 'ㅙ', romaja: 'wae', f1: 680, f2: 1950, glide: true, f2Start: 750, f1Start: 450 },
  { char: 'ㅚ', romaja: 'oe', f1: 520, f2: 1950, glide: true, f2Start: 800, f1Start: 420 },
  { char: 'ㅝ', romaja: 'wo', f1: 620, f2: 1100, glide: true, f2Start: 750, f1Start: 450 },
  { char: 'ㅞ', romaja: 'we', f1: 500, f2: 2000, glide: true, f2Start: 750, f1Start: 420 },
  { char: 'ㅟ', romaja: 'wi', f1: 300, f2: 2400, glide: true, f2Start: 800, f1Start: 380 },
  { char: 'ㅢ', romaja: 'ui', f1: 320, f2: 2400, glide: true, f2Start: 1450, f1Start: 380 },
];

// 5. Batchim (7)
const batchim = [
  { char: 'ㄱ', romaja: 'k' },
  { char: 'ㄴ', romaja: 'n' },
  { char: 'ㄷ', romaja: 't' },
  { char: 'ㄹ', romaja: 'l' },
  { char: 'ㅁ', romaja: 'm' },
  { char: 'ㅂ', romaja: 'p' },
  { char: 'ㅇ', romaja: 'ng' },
];

const generatedWavFiles = [];

// Consonants
basicConsonants.forEach(c => {
  const wav = synthesizeConsonant(c.char, c.romaja);
  generatedWavFiles.push(writeWav(`consonant_${c.romaja}.wav`, wav));
});

// Double Consonants
doubleConsonants.forEach(c => {
  const wav = synthesizeDoubleConsonant(c.char, c.romaja);
  generatedWavFiles.push(writeWav(`double_${c.romaja}.wav`, wav));
});

// Basic Vowels
basicVowels.forEach(v => {
  const wav = synthesizeVowel(v.f1, v.f2, 2800, 0.45, v.glide, v.f2Start, v.f1Start);
  generatedWavFiles.push(writeWav(`vowel_${v.romaja}.wav`, wav));
});

// Compound Vowels
compoundVowels.forEach(v => {
  const wav = synthesizeVowel(v.f1, v.f2, 2800, 0.46, v.glide, v.f2Start, v.f1Start);
  generatedWavFiles.push(writeWav(`compound_${v.romaja}.wav`, wav));
});

// Batchim
batchim.forEach(b => {
  const wav = synthesizeBatchim(b.char, b.romaja);
  generatedWavFiles.push(writeWav(`batchim_${b.romaja}.wav`, wav));
});

console.log(`Generated ${generatedWavFiles.length} WAV audio files.`);

// Convert all WAV files to MP3 using ffmpeg
generatedWavFiles.forEach(wavPath => {
  const mp3Path = wavPath.replace(/\.wav$/, '.mp3');
  try {
    execSync(`ffmpeg -y -i "${wavPath}" -vn -ar 44100 -ac 2 -b:a 128k "${mp3Path}" 2>/dev/null`);
  } catch (err) {
    console.error(`Failed to convert ${wavPath} to mp3:`, err.message);
  }
});

console.log('Successfully generated all Hangul phoneme WAV and MP3 files in public/audio/hangul/');
