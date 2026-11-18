import { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue, type Database } from 'firebase/database';
import { Clock } from 'lucide-react';

// Exact Firebase Config provided for real-time synchronization
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

// Safe singleton Firebase app & database initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db: Database = getDatabase(app, firebaseConfig.databaseURL);

export type OecStatus = 'Active' | 'Pending' | 'Inactive';

export interface OecBoardEntry {
  id: string;
  oecNumber: string;    // Col 1: Data Info (e.g. "OEC 8046", "WY 343")
  countryInfo: string;  // Col 2: Board Info (e.g. "SEOUL INCHEON", "BUSAN PORT")
  progress: string;     // Col 3: Progress (e.g. "12:15", "STAGE 4")
  status: OecStatus;    // Col 4: Status (Active, Pending, Inactive)
}

// Character counts optimized for mobile screens so all columns (including Status) fit perfectly
const COLS_CONFIG = {
  oec: 7,          // Col 1: Data Info (e.g. "OEC 804")
  countryInfo: 10, // Col 2: Board Info (e.g. "SEOUL INCH", "BUSAN PORT")
  progress: 5,     // Col 3: Progress (e.g. "12:15")
  status: 8,       // Col 4: Status (e.g. "ACTIVE  ", "PENDING ", "INACTIVE")
};

// Theme configurations dynamically triggered via /oec_board_settings
interface ThemePalette {
  accentColor: string;
  activeColor: string;
  activeDimColor: string;
  glowColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  tileTextColor: string;
  outerGlow: string;
}

const THEME_MAP: Record<string, ThemePalette> = {
  'classic green': {
    accentColor: '#22c55e',
    activeColor: '#22c55e',
    activeDimColor: '#15803d',
    glowColor: 'rgba(34, 197, 94, 0.85)',
    borderColor: '#22c55e30',
    badgeBg: 'rgba(34, 197, 94, 0.15)',
    badgeText: '#4ade80',
    tileTextColor: '#f3f4f6',
    outerGlow: 'rgba(34, 197, 94, 0.12)',
  },
  'purple neon': {
    accentColor: '#c084fc',
    activeColor: '#c084fc',
    activeDimColor: '#7e22ce',
    glowColor: 'rgba(192, 132, 252, 0.85)',
    borderColor: '#c084fc30',
    badgeBg: 'rgba(168, 85, 247, 0.18)',
    badgeText: '#e9d5ff',
    tileTextColor: '#faf5ff',
    outerGlow: 'rgba(168, 85, 247, 0.16)',
  },
  'amber gold': {
    accentColor: '#fbbf24',
    activeColor: '#fbbf24',
    activeDimColor: '#b45309',
    glowColor: 'rgba(251, 191, 36, 0.85)',
    borderColor: '#fbbf2430',
    badgeBg: 'rgba(245, 158, 11, 0.18)',
    badgeText: '#fef3c7',
    tileTextColor: '#fffbeb',
    outerGlow: 'rgba(245, 158, 11, 0.16)',
  },
  'cyber blue': {
    accentColor: '#22d3ee',
    activeColor: '#22d3ee',
    activeDimColor: '#0e7490',
    glowColor: 'rgba(34, 211, 238, 0.85)',
    borderColor: '#22d3ee30',
    badgeBg: 'rgba(6, 182, 212, 0.18)',
    badgeText: '#cffafe',
    tileTextColor: '#f0fdfa',
    outerGlow: 'rgba(6, 182, 212, 0.16)',
  },
  'crimson red': {
    accentColor: '#fb7185',
    activeColor: '#fb7185',
    activeDimColor: '#be123c',
    glowColor: 'rgba(251, 113, 133, 0.85)',
    borderColor: '#fb718530',
    badgeBg: 'rgba(244, 63, 94, 0.18)',
    badgeText: '#ffe4e6',
    tileTextColor: '#fff1f2',
    outerGlow: 'rgba(244, 63, 94, 0.16)',
  },
};

const SAMPLE_ROWS: OecBoardEntry[] = [
  { id: '1', oecNumber: 'OEC 8046', countryInfo: 'SEOUL INCH', progress: '12:15', status: 'Active' },
  { id: '2', oecNumber: 'WY 343', countryInfo: 'BUSAN PORT', progress: '13:05', status: 'Active' },
  { id: '3', oecNumber: 'PA 402', countryInfo: 'GWANGJU EP', progress: '13:50', status: 'Pending' },
  { id: '4', oecNumber: 'KOR 712', countryInfo: 'DAEGU CNTR', progress: '14:30', status: 'Active' },
  { id: '5', oecNumber: 'ER 522', countryInfo: 'INCHEON CG', progress: '14:45', status: 'Inactive' },
  { id: '6', oecNumber: 'OEC 542', countryInfo: 'JEJU FISH ', progress: '14:45', status: 'Active' },
  { id: '7', oecNumber: 'PF 143', countryInfo: 'ULSAN SHIP', progress: '15:15', status: 'Pending' },
  { id: '8', oecNumber: 'PF 125', countryInfo: 'SUWON TECH', progress: '15:15', status: 'Active' },
  { id: '9', oecNumber: 'PA 417', countryInfo: 'CHANGWON M', progress: '16:45', status: 'Active' },
  { id: '10', oecNumber: 'PA 411', countryInfo: 'SEOUL GIMP', progress: '16:45', status: 'Pending' },
];

/**
 * SplitFlapTile:
 * - Perfectly square box (`aspect-square`) with flex centering
 * - Proportional responsive sizing on mobile to guarantee zero overflow
 * - Dead-centered characters with zero horizontal or vertical clipping
 * - Subtle 3D gradient, top specular highlight rim, and bottom shadow
 * - Very thin darker horizontal line in the middle
 */
function SplitFlapTile({
  char,
  isFlipping,
  delayIndex = 0,
  textColor,
  flipDuration,
  isStatus = false,
}: {
  char: string;
  isFlipping: boolean;
  delayIndex?: number;
  textColor?: string;
  flipDuration?: string;
  isStatus?: boolean;
}) {
  const displayChar = char || ' ';
  const isEmpty = displayChar === ' ';

  const delayStyle: React.CSSProperties = {
    animationDelay: `${(delayIndex % 16) * 35}ms`,
    ...(flipDuration ? { animationDuration: flipDuration } : {}),
  };

  const fontClass = isStatus
    ? 'text-[6px] min-[360px]:text-[6.8px] min-[390px]:text-[7.5px] sm:text-[10px] md:text-[12px] lg:text-[14px]'
    : 'text-[6.5px] min-[360px]:text-[7.5px] min-[390px]:text-[8px] sm:text-[11px] md:text-[13px] lg:text-[15px]';

  return (
    <div className="perspective-tile relative aspect-square w-[8px] min-[360px]:w-[9px] min-[390px]:w-[10px] sm:w-[15px] md:w-[19px] lg:w-[23px] rounded-[1px] sm:rounded-[2px] select-none shadow-[0_1px_2px_rgba(0,0,0,0.85)] overflow-hidden shrink-0 bg-[#090a0d] border border-[#1e2129] flex items-center justify-center">
      {/* Centered Base Card Character Layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          style={!isEmpty && textColor ? { color: textColor } : undefined}
          className={`font-mono font-bold ${fontClass} leading-none tracking-tight text-center select-none ${
            isEmpty ? 'text-transparent' : textColor ? '' : 'text-[#f1f3f5]'
          }`}
        >
          {displayChar}
        </span>
      </div>

      {/* 1. TOP HALF FLAP (Folds down around the center crease: rotateX) */}
      <div
        style={isFlipping ? delayStyle : undefined}
        className={`absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-gradient-to-b from-[#1b1e25] via-[#14161c] to-[#0c0d11] border-b border-black rounded-t-[1px] sm:rounded-t-[2px] ${
          isFlipping ? 'animate-flap-top' : ''
        }`}
      >
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none select-none overflow-hidden pb-[0.2px]">
          <span
            style={!isEmpty && textColor ? { color: textColor } : undefined}
            className={`font-mono font-bold ${fontClass} leading-none tracking-tight text-center select-none translate-y-[50%] ${
              isEmpty ? 'text-transparent' : textColor ? '' : 'text-[#f1f3f5]'
            }`}
          >
            {displayChar}
          </span>
        </div>
      </div>

      {/* 2. CENTER SEAM (Very thin horizontal line in the middle of each box) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[0.5px] sm:h-[1px] bg-black z-30 pointer-events-none shadow-[0_0.5px_0_rgba(255,255,255,0.06)]" />

      {/* 3. BOTTOM HALF FLAP (Unfolds around the center crease: rotateX) */}
      <div
        style={isFlipping ? delayStyle : undefined}
        className={`absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-gradient-to-b from-[#111317] via-[#0d0e12] to-[#07080a] border-t border-black/80 rounded-b-[1px] sm:rounded-b-[2px] ${
          isFlipping ? 'animate-flap-bottom' : ''
        }`}
      >
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none select-none overflow-hidden pt-[0.2px]">
          <span
            style={!isEmpty && textColor ? { color: textColor } : undefined}
            className={`font-mono font-bold ${fontClass} leading-none tracking-tight text-center select-none -translate-y-[50%] ${
              isEmpty ? 'text-transparent' : textColor ? '' : 'text-[#f1f3f5]'
            }`}
          >
            {displayChar}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * SplitFlapWord: Encloses square tiles in a continuous, tight tray with small, consistent letter spacing
 */
function SplitFlapWord({
  text,
  length,
  isFlipping,
  baseDelay = 0,
  textColor,
  flipDuration,
  isStatus = false,
}: {
  text: string;
  length: number;
  isFlipping: boolean;
  baseDelay?: number;
  textColor?: string;
  flipDuration?: string;
  isStatus?: boolean;
}) {
  const padded = text.toUpperCase().padEnd(length, ' ').slice(0, length);
  const chars = padded.split('');

  return (
    <div className="inline-flex items-center p-[0.5px] sm:p-[1px] rounded-[2px] bg-[#050608] border border-[#191b22] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] gap-[0.5px] sm:gap-[1.5px] shrink-0">
      {chars.map((ch, idx) => (
        <SplitFlapTile
          key={idx}
          char={ch}
          isFlipping={isFlipping}
          delayIndex={baseDelay + idx}
          textColor={textColor}
          flipDuration={flipDuration}
          isStatus={isStatus}
        />
      ))}
    </div>
  );
}

/**
 * PhysicalLedDot: Physical convex LED diode with dark socket rim, bright inner glow, and strong outer glow.
 */
function PhysicalLedDot({
  status,
  isSecondary = false,
  blinkDuration,
  pendingDuration,
  palette,
}: {
  status: OecStatus;
  isSecondary?: boolean;
  blinkDuration: string;
  pendingDuration: string;
  palette: ThemePalette;
}) {
  const norm = (status || '').toLowerCase();
  const isPending = norm === 'pending';
  const isInactive = norm === 'inactive';
  const isActive = norm === 'active';

  let animClass = 'animate-led-dynamic-active';
  let inlineDuration = blinkDuration;
  let inlineBg = palette.activeColor;
  let inlineGlow = `inset 0 0 3px rgba(255,255,255,0.7), inset 0 1px 1px rgba(255,255,255,0.9), 0 0 6px ${palette.glowColor}, 0 0 12px ${palette.glowColor}`;

  if (isPending) {
    animClass = isSecondary ? 'animate-led-dynamic-pending-right' : 'animate-led-dynamic-pending-left';
    inlineDuration = pendingDuration;
    inlineBg = isSecondary ? palette.activeColor : '#ef4444';
    inlineGlow = `inset 0 0 3px rgba(255,255,255,0.7), inset 0 1px 1px rgba(255,255,255,0.9), 0 0 6px ${
      isSecondary ? palette.glowColor : 'rgba(239,68,68,0.9)'
    }, 0 0 12px ${isSecondary ? palette.glowColor : 'rgba(239,68,68,0.5)'}`;
  } else if (isInactive) {
    animClass = 'animate-led-inactive-slow';
    inlineDuration = blinkDuration;
    inlineBg = '#ef4444';
    inlineGlow = 'inset 0 0 3px rgba(255,255,255,0.7), inset 0 1px 1px rgba(255,255,255,0.9), 0 0 6px rgba(239,68,68,0.9), 0 0 12px rgba(239,68,68,0.5)';
  }

  return (
    <div
      className="relative flex items-center justify-center w-2 h-2 min-[360px]:w-2.5 min-[360px]:h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#07080a] border border-[#222631] shadow-[inset_0_1px_1.5px_rgba(0,0,0,0.9)] shrink-0"
      title={`${status} Indicator`}
    >
      <span
        className={`relative w-1 h-1 min-[360px]:w-1.5 min-[360px]:h-1.5 sm:w-2 sm:h-2 rounded-full ${animClass} shrink-0 transition-colors`}
        style={{
          animationDuration: inlineDuration,
          ...(isSecondary && isActive ? { animationDelay: '0.4s' } : {}),
          backgroundColor: inlineBg,
          boxShadow: inlineGlow,
        }}
      >
        <span className="absolute top-[18%] left-[20%] w-[35%] h-[35%] rounded-full bg-white/70 pointer-events-none blur-[0.2px]" />
      </span>
    </div>
  );
}

/**
 * DualLedIndicator: Pair of embedded physical LED dots
 */
function DualLedIndicator({
  status,
  blinkDuration,
  pendingDuration,
  palette,
}: {
  status: OecStatus;
  blinkDuration: string;
  pendingDuration: string;
  palette: ThemePalette;
}) {
  return (
    <div className="flex items-center gap-0.5 min-[360px]:gap-1 sm:gap-1.5 shrink-0">
      <PhysicalLedDot
        status={status}
        isSecondary={false}
        blinkDuration={blinkDuration}
        pendingDuration={pendingDuration}
        palette={palette}
      />
      <PhysicalLedDot
        status={status}
        isSecondary={true}
        blinkDuration={blinkDuration}
        pendingDuration={pendingDuration}
        palette={palette}
      />
    </div>
  );
}

/**
 * MainLedBoard: Strictly Display-Only real-time airport departure board.
 * Real-time listeners for /oec_board_settings and /oec_board.
 * Perfectly square flap boxes, consistent small letter spacing, full Status visibility, and zero mobile overflow.
 */
export function MainLedBoard() {
  const [entries, setEntries] = useState<OecBoardEntry[]>([]);
  const [theme, setTheme] = useState('Classic Green');
  const [speed, setSpeed] = useState('7s'); // '7s' | '5s' | '3.5s'
  const [isFlipping, setIsFlipping] = useState(false);
  const [kstTime, setKstTime] = useState('');

  // 1. Real-time listener for Settings via `onValue(ref(db, 'oec_board_settings'))`
  useEffect(() => {
    const settingsRef = ref(db, 'oec_board_settings');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.theme) setTheme(data.theme);
        if (data.speed) {
          const rawSpeed = data.speed.toString();
          setSpeed(rawSpeed.endsWith('s') ? rawSpeed : `${rawSpeed}s`);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time listener for Flight Records via `onValue(ref(db, 'oec_board'))`
  useEffect(() => {
    const boardRef = ref(db, 'oec_board');
    const unsubscribe = onValue(boardRef, (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        setEntries([]);
        return;
      }

      const parsed: OecBoardEntry[] = Object.entries(val).map(([id, item]: [string, any]) => ({
        id,
        oecNumber: item.oecNumber || '',
        countryInfo: item.countryInfo || '',
        progress: item.progress || '',
        status: item.status || 'Active',
      }));

      setEntries(parsed);
    });

    return () => unsubscribe();
  }, []);

  // Theme Palette derived dynamically
  const activePalette = useMemo(() => {
    const normalized = theme.toLowerCase().trim();
    if (normalized.includes('purple')) return THEME_MAP['purple neon'];
    if (normalized.includes('amber') || normalized.includes('gold')) return THEME_MAP['amber gold'];
    if (normalized.includes('blue') || normalized.includes('cyber')) return THEME_MAP['cyber blue'];
    if (normalized.includes('red') || normalized.includes('crimson')) return THEME_MAP['crimson red'];
    return THEME_MAP['classic green'];
  }, [theme]);

  // Derived CSS animation durations and flip intervals from speed
  const speedTimings = useMemo(() => {
    const numeric = parseFloat(speed.replace('s', '')) || 7;

    if (numeric <= 4) {
      return {
        blinkDuration: '0.85s',
        pendingDuration: '1.2s',
        flipDuration: '0.38s',
        flipIntervalMs: 3500,
      };
    }
    if (numeric <= 5.5) {
      return {
        blinkDuration: '1.6s',
        pendingDuration: '2.1s',
        flipDuration: '0.52s',
        flipIntervalMs: 5000,
      };
    }
    return {
      blinkDuration: '2.6s',
      pendingDuration: '3.2s',
      flipDuration: '0.65s',
      flipIntervalMs: 7000,
    };
  }, [speed]);

  // Live Seoul / KST clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setKstTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Seoul',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mechanical Flip Trigger (interval dynamically updates with speed setting)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setIsFlipping(false);
      }, parseFloat(speedTimings.flipDuration) * 1000 + 100);
    }, speedTimings.flipIntervalMs);

    return () => clearInterval(interval);
  }, [speedTimings]);

  // Rows to display (live data with realistic fallback if empty)
  const displayRows = useMemo(() => {
    if (entries.length > 0) return entries;
    return SAMPLE_ROWS;
  }, [entries]);

  // Format status consistently to 8 full characters so ACTIVE, PENDING, INACTIVE are 100% visible
  const formatStatus = (s: OecStatus) => {
    const norm = (s || '').toLowerCase();
    if (norm === 'active') return 'ACTIVE  ';
    if (norm === 'pending') return 'PENDING ';
    return 'INACTIVE';
  };

  // Dynamic CSS variables applied directly to the container
  const boardDynamicStyle = {
    '--led-active-color': activePalette.activeColor,
    '--led-active-dim': activePalette.activeDimColor,
    '--led-glow-color': activePalette.glowColor,
    '--blink-duration': speedTimings.blinkDuration,
    '--pending-duration': speedTimings.pendingDuration,
    '--flip-duration': speedTimings.flipDuration,
  } as React.CSSProperties;

  return (
    <div
      id="oec-departure-board"
      style={boardDynamicStyle}
      className="py-8 sm:py-16 lg:py-24 relative w-full transition-colors duration-500 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3 sm:mb-8 gap-2 sm:gap-4 px-1">
          <div>
            <div
              style={{
                backgroundColor: activePalette.badgeBg,
                borderColor: `${activePalette.activeColor}50`,
                color: activePalette.badgeText,
              }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 rounded-full border text-[10px] sm:text-xs font-medium tracking-wide mb-1 sm:mb-3 transition-colors"
            >
              <span
                style={{
                  backgroundColor: activePalette.activeColor,
                  boxShadow: `0 0 8px ${activePalette.glowColor}`,
                }}
                className="w-1.5 h-1.5 rounded-full animate-pulse"
              />
              <span>Real-Time Departure Telemetry ({theme})</span>
            </div>
            <h2 className="text-lg sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-sans">
              South Korea & OEC Info
            </h2>
            <p className="mt-0.5 sm:mt-2 text-[11px] sm:text-sm text-[#8E8E93] max-w-2xl font-sans">
              Official departure and allocation monitor displaying live EPS visa processing, travel stages, and flight groups.
            </p>
          </div>
        </div>

        {/* Airport LED Board Chassis with Industrial Bezel */}
        <div
          style={{
            borderColor: activePalette.borderColor,
            boxShadow: `0 25px 80px rgba(0,0,0,0.98), 0 0 50px ${activePalette.outerGlow}`,
          }}
          className="led-chassis-finish relative rounded-xl sm:rounded-2xl p-1 sm:p-4 md:p-6 border transition-all duration-500 w-full overflow-hidden"
        >
          {/* Corner Industrial Hex Rivets */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#1e2028] border border-[#323644] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center pointer-events-none">
            <div className="w-1 h-[0.5px] bg-[#090a0d]" />
          </div>
          <div className="absolute top-2 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#1e2028] border border-[#323644] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center pointer-events-none">
            <div className="w-1 h-[0.5px] bg-[#090a0d]" />
          </div>
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#1e2028] border border-[#323644] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center pointer-events-none">
            <div className="w-1 h-[0.5px] bg-[#090a0d]" />
          </div>
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#1e2028] border border-[#323644] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center pointer-events-none">
            <div className="w-1 h-[0.5px] bg-[#090a0d]" />
          </div>

          {/* Textured Micro-Perforated Dark Metal Grille Panel */}
          <div className="led-panel-mesh relative rounded-lg sm:rounded-xl px-1 py-2 sm:px-4 sm:py-6 md:px-7 md:py-8 border border-[#161820] w-full overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.95)]">
            {/* Top Display Header Bar */}
            <div className="flex items-center justify-between pb-2 sm:pb-4 border-b border-[#1c1e28] mb-2 sm:mb-5 gap-1">
              <div className="font-sans font-extrabold text-white text-[10px] min-[360px]:text-xs sm:text-lg md:text-xl lg:text-2xl tracking-[0.08em] sm:tracking-[0.25em] md:tracking-[0.35em] uppercase truncate flex items-center gap-1.5">
                <span className="w-1 h-3 sm:w-1.5 sm:h-3.5 bg-gradient-to-b from-[#22c55e] to-transparent rounded-xs opacity-75 shrink-0 hidden min-[360px]:inline-block" />
                <span>SOUTH KOREA & OEC INFO</span>
              </div>

              {/* Status Indicator & Live KST Clock */}
              <div className="flex items-center gap-1.5 sm:gap-4 text-[8.5px] sm:text-xs font-sans text-[#888888] shrink-0">
                <div className="flex items-center gap-1 sm:gap-1.5 bg-[#090a0e] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-[#1d202a] shadow-inner">
                  <span
                    style={{
                      backgroundColor: activePalette.activeColor,
                      boxShadow: `inset 0 0 3px rgba(255,255,255,0.8), 0 0 8px ${activePalette.glowColor}`,
                    }}
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
                  />
                  <span style={{ color: activePalette.activeColor }} className="font-semibold text-[8px] sm:text-xs">
                    ONLINE
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[#090a0e] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-[#1d202a] text-[#d4d4d8] shadow-inner font-mono text-[8.5px] sm:text-xs">
                  <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#a1a1aa]" />
                  <span>KST {kstTime || '12:00:00'}</span>
                </div>
              </div>
            </div>

            {/* BOARD TABLE CONTAINER (Wrapped in overflow-x-auto for guaranteed 100% visibility of all columns on any screen) */}
            <div className="w-full overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <div className="min-w-full w-max sm:w-full space-y-1 sm:space-y-1.5 select-none">
                {/* Column Headers (LED Signals, Data Info, Board Info, Progress, Status) */}
                <div className="flex items-center justify-between text-[7px] min-[360px]:text-[7.5px] sm:text-xs font-sans text-[#9ca3af] font-medium pb-1 border-b border-[#181a24] w-full gap-1 min-[360px]:gap-2 sm:gap-3">
                  {/* Col 1: LED Signals + Data Info */}
                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <span
                      style={{ color: activePalette.accentColor }}
                      className="font-mono text-[6px] min-[360px]:text-[7px] sm:text-[9.5px] uppercase tracking-tighter truncate font-bold"
                    >
                      LED Signals
                    </span>
                    <span className="truncate">Data Info</span>
                  </div>

                  {/* Col 2: Board Info */}
                  <div className="flex items-center justify-start shrink-0">
                    <span className="truncate">Board Info</span>
                  </div>

                  {/* Col 3: Progress */}
                  <div className="flex items-center justify-center shrink-0">
                    <span className="truncate">Progress</span>
                  </div>

                  {/* Col 4: Status */}
                  <div className="flex items-center justify-end shrink-0">
                    <span className="truncate">Status</span>
                  </div>
                </div>

                {/* Split-Flap Board Rows */}
                {displayRows.map((row, rowIdx) => {
                  const baseDelay = rowIdx * 3;
                  const isRowActive = (row.status || '').toLowerCase() === 'active';
                  const isRowPending = (row.status || '').toLowerCase() === 'pending';

                  return (
                    <div
                      key={row.id || rowIdx}
                      className="flex items-center justify-between hover:bg-white/[0.02] py-0.5 sm:py-1 rounded transition-colors w-full border-b border-[#11131a]/60 gap-1 min-[360px]:gap-2 sm:gap-3"
                    >
                      {/* Col 1: Dual LED Indicators + Data Info */}
                      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                        <DualLedIndicator
                          status={row.status}
                          blinkDuration={speedTimings.blinkDuration}
                          pendingDuration={speedTimings.pendingDuration}
                          palette={activePalette}
                        />
                        <SplitFlapWord
                          text={row.oecNumber}
                          length={COLS_CONFIG.oec}
                          isFlipping={isFlipping}
                          baseDelay={baseDelay}
                          textColor={activePalette.tileTextColor}
                          flipDuration={speedTimings.flipDuration}
                        />
                      </div>

                      {/* Col 2: Board Info */}
                      <div className="flex items-center justify-start shrink-0">
                        <SplitFlapWord
                          text={row.countryInfo}
                          length={COLS_CONFIG.countryInfo}
                          isFlipping={isFlipping}
                          baseDelay={baseDelay + 2}
                          textColor={activePalette.tileTextColor}
                          flipDuration={speedTimings.flipDuration}
                        />
                      </div>

                      {/* Col 3: Progress */}
                      <div className="flex items-center justify-center shrink-0">
                        <SplitFlapWord
                          text={row.progress}
                          length={COLS_CONFIG.progress}
                          isFlipping={isFlipping}
                          baseDelay={baseDelay + 4}
                          textColor={activePalette.tileTextColor}
                          flipDuration={speedTimings.flipDuration}
                        />
                      </div>

                      {/* Col 4: Status (Full words ACTIVE, PENDING, INACTIVE visible) */}
                      <div className="flex items-center justify-end shrink-0">
                        <SplitFlapWord
                          text={formatStatus(row.status)}
                          length={COLS_CONFIG.status}
                          isFlipping={isFlipping}
                          baseDelay={baseDelay + 6}
                          flipDuration={speedTimings.flipDuration}
                          isStatus={true}
                          textColor={
                            isRowActive
                              ? activePalette.activeColor
                              : isRowPending
                              ? '#fbbf24'
                              : '#f87171'
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Board Status Legend & Real-Time Sync Indicator */}
            <div className="mt-2.5 sm:mt-5 pt-2 sm:pt-3.5 border-t border-[#181a24] flex flex-wrap items-center justify-between text-[7.5px] sm:text-xs text-[#71717a] font-sans gap-1.5">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="flex items-center gap-1">
                  <span
                    style={{
                      backgroundColor: activePalette.activeColor,
                      boxShadow: `0 0 6px ${activePalette.glowColor}`,
                    }}
                    className="w-1.5 h-1.5 rounded-full inline-block"
                  />
                  <span>Active = {theme}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                  <span>Pending = Amber</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                  <span>Inactive = Red</span>
                </span>
              </div>
              <div className="text-[#a1a1aa] font-mono text-[7.5px] sm:text-[10px] bg-[#090a0e] px-1.5 py-0.5 rounded border border-[#1d202a]">
                INTERVAL: {speed.toUpperCase()} ({speedTimings.flipIntervalMs / 1000}s)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MainLedBoard;
