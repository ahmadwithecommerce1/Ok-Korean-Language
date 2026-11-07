import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  update,
  remove,
  type Database,
} from 'firebase/database';
import {
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Sliders,
  Send,
  AlertCircle,
  Edit2,
  X,
  Gauge,
} from 'lucide-react';

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
  updatedAt?: number;
}

export interface BoardSettingsPayload {
  theme: string;
  speed: string; // e.g. '3.5s', '5s', '7s'
  updatedAt?: number;
}

const THEME_OPTIONS = [
  { id: 'Classic Green', label: 'Classic Green', color: '#22c55e' },
  { id: 'Purple Neon', label: 'Purple Neon', color: '#c084fc' },
  { id: 'Amber Gold', label: 'Amber Gold', color: '#fbbf24' },
  { id: 'Cyber Blue', label: 'Cyber Blue', color: '#22d3ee' },
  { id: 'Crimson Red', label: 'Crimson Red', color: '#fb7185' },
];

const SPEED_PRESETS = [
  { label: 'Slow (7s)', value: '7s' },
  { label: 'Normal (5s)', value: '5s' },
  { label: 'Fast (3.5s)', value: '3.5s' },
];

const SAMPLE_ENTRIES = [
  { oecNumber: 'OEC 8046', countryInfo: 'SEOUL INCHEON', progress: '12:15', status: 'Active' as OecStatus },
  { oecNumber: 'WY 343', countryInfo: 'BUSAN PORT', progress: '13:05', status: 'Active' as OecStatus },
  { oecNumber: 'PA 402', countryInfo: 'GWANGJU EPS', progress: '13:50', status: 'Pending' as OecStatus },
  { oecNumber: 'KOR 712', countryInfo: 'DAEGU CENTRAL', progress: '14:30', status: 'Active' as OecStatus },
  { oecNumber: 'ER 522', countryInfo: 'INCHEON CARGO', progress: '14:45', status: 'Inactive' as OecStatus },
  { oecNumber: 'OEC 542', countryInfo: 'JEJU FISHERIES', progress: '14:45', status: 'Active' as OecStatus },
  { oecNumber: 'PF 143', countryInfo: 'ULSAN SHIPYARD', progress: '15:15', status: 'Pending' as OecStatus },
  { oecNumber: 'PF 125', countryInfo: 'SUWON TECH', progress: '15:15', status: 'Active' as OecStatus },
  { oecNumber: 'PA 417', countryInfo: 'CHANGWON MFG', progress: '16:45', status: 'Active' as OecStatus },
  { oecNumber: 'PA 411', countryInfo: 'SEOUL GIMPO', progress: '16:45', status: 'Pending' as OecStatus },
];

interface AdminConsoleProps {
  onClose?: () => void;
}

export function AdminConsole({ onClose }: AdminConsoleProps) {
  const [entries, setEntries] = useState<OecBoardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Settings State synced with /oec_board_settings
  const [theme, setTheme] = useState('Classic Green');
  const [speed, setSpeed] = useState('7s'); // '7s' | '5s' | '3.5s'

  // Top Marquee Settings synced with /scrolling_text_settings
  const [marqueeText, setMarqueeText] = useState(
    'Welcome to OK Korean Language Center ★ 18+ Years of Excellence in Korean Language Education ★ Learn from Expert Native Teachers ★ Admission is open now ★ TOPIK Preparation & Visa Guidance Available'
  );
  const [marqueeAnimationType, setMarqueeAnimationType] = useState('marquee');
  const [marqueeSpeed, setMarqueeSpeed] = useState('28s');
  const [isSavingMarquee, setIsSavingMarquee] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [oecNumber, setOecNumber] = useState('');
  const [countryInfo, setCountryInfo] = useState('');
  const [progress, setProgress] = useState('');
  const [status, setStatus] = useState<OecStatus>('Active');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // 1. Subscribe to Live Board Entries at `/oec_board`
  useEffect(() => {
    setIsLoading(true);
    const boardRef = ref(db, 'oec_board');
    const unsubscribe = onValue(
      boardRef,
      (snapshot) => {
        const val = snapshot.val();
        if (!val) {
          setEntries([]);
          setIsLoading(false);
          return;
        }

        const parsed: OecBoardEntry[] = Object.entries(val).map(([id, item]: [string, any]) => ({
          id,
          oecNumber: item.oecNumber || '',
          countryInfo: item.countryInfo || '',
          progress: item.progress || '',
          status: item.status || 'Active',
          updatedAt: item.updatedAt,
        }));

        setEntries(parsed);
        setIsLoading(false);
      },
      (err) => {
        console.error('Firebase error loading /oec_board:', err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Settings at `/oec_board_settings`
  useEffect(() => {
    const settingsRef = ref(db, 'oec_board_settings');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.theme) setTheme(data.theme);
        if (data.speed) {
          // Normalize speed string
          setSpeed(data.speed.toString().endsWith('s') ? data.speed : `${data.speed}s`);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 3. Subscribe to Marquee Settings at `/scrolling_text_settings`
  useEffect(() => {
    const marqueeRef = ref(db, 'scrolling_text_settings');
    const unsubscribe = onValue(marqueeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.text) {
          if (Array.isArray(data.text)) {
            setMarqueeText(data.text.join(' ★ '));
          } else {
            setMarqueeText(String(data.text));
          }
        }
        if (data.animationType) setMarqueeAnimationType(data.animationType);
        if (data.speed) {
          const s = String(data.speed);
          setMarqueeSpeed(s.endsWith('s') ? s : `${s}s`);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save Settings to Firebase under /oec_board_settings
  const saveSettingsToFirebase = async (newTheme: string, newSpeed: string) => {
    try {
      const settingsRef = ref(db, 'oec_board_settings');
      await set(settingsRef, {
        theme: newTheme,
        speed: newSpeed,
        updatedAt: Date.now(),
      });
      setStatusMessage({
        text: `Settings synced to /oec_board_settings (${newTheme}, ${newSpeed})!`,
        type: 'success',
      });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setStatusMessage({ text: 'Failed to update board settings in Firebase.', type: 'error' });
    }
  };

  const handleSelectTheme = (newTheme: string) => {
    setTheme(newTheme);
    saveSettingsToFirebase(newTheme, speed);
  };

  const handleSelectSpeed = (newSpeed: string) => {
    setSpeed(newSpeed);
    saveSettingsToFirebase(theme, newSpeed);
  };

  const handleSliderSpeedChange = (numericSeconds: number) => {
    const formatted = `${numericSeconds}s`;
    setSpeed(formatted);
    saveSettingsToFirebase(theme, formatted);
  };

  // Convert current speed string to numeric seconds for slider
  const numericSpeed = parseFloat(speed.replace('s', '')) || 7;

  // Save Scrolling Marquee Settings to Firebase under /scrolling_text_settings
  const handleSaveMarqueeSettings = async (override?: { text?: string; animationType?: string; speed?: string }) => {
    try {
      setIsSavingMarquee(true);
      const marqueeRef = ref(db, 'scrolling_text_settings');
      const payload = {
        text: override?.text !== undefined ? override.text : marqueeText.trim(),
        animationType: override?.animationType || marqueeAnimationType,
        speed: override?.speed || marqueeSpeed,
        updatedAt: Date.now(),
      };
      await set(marqueeRef, payload);
      setStatusMessage({
        text: `Top Marquee settings saved to /scrolling_text_settings (${payload.animationType}, ${payload.speed})!`,
        type: 'success',
      });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error('Failed to save marquee settings:', err);
      setStatusMessage({ text: 'Failed to update /scrolling_text_settings in Firebase.', type: 'error' });
    } finally {
      setIsSavingMarquee(false);
    }
  };

  const handleEditClick = (entry: OecBoardEntry) => {
    setEditingId(entry.id);
    setOecNumber(entry.oecNumber);
    setCountryInfo(entry.countryInfo);
    setProgress(entry.progress);
    setStatus(entry.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setOecNumber('');
    setCountryInfo('');
    setProgress('');
    setStatus('Active');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oecNumber.trim() || !countryInfo.trim()) {
      setStatusMessage({ text: 'Please provide both OEC Number and Country Info.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // Update existing record at `oec_board/${editingId}`
        const entryRef = ref(db, `oec_board/${editingId}`);
        await update(entryRef, {
          oecNumber: oecNumber.trim().toUpperCase(),
          countryInfo: countryInfo.trim().toUpperCase(),
          progress: (progress.trim() || 'IN PROGRESS').toUpperCase(),
          status,
          updatedAt: Date.now(),
        });
        setStatusMessage({ text: `Updated ${oecNumber.toUpperCase()}!`, type: 'success' });
        handleCancelEdit();
      } else {
        // Push new record to `oec_board`
        const boardRef = ref(db, 'oec_board');
        const newRef = push(boardRef);
        await set(newRef, {
          oecNumber: oecNumber.trim().toUpperCase(),
          countryInfo: countryInfo.trim().toUpperCase(),
          progress: (progress.trim() || 'IN PROGRESS').toUpperCase(),
          status,
          updatedAt: Date.now(),
        });
        setStatusMessage({ text: `Published ${oecNumber.toUpperCase()} to the LED Board!`, type: 'success' });
        setOecNumber('');
        setCountryInfo('');
        setProgress('');
        setStatus('Active');
      }

      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error('Failed to submit entry:', err);
      setStatusMessage({ text: 'Firebase error saving record.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" from the live LED board?`)) return;
    try {
      const entryRef = ref(db, `oec_board/${id}`);
      await remove(entryRef);
      setStatusMessage({ text: `Removed "${name}" from Firebase.`, type: 'success' });
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (err) {
      console.error('Failed to delete entry:', err);
    }
  };

  const handleToggleStatus = async (entry: OecBoardEntry) => {
    const nextStatus: OecStatus =
      entry.status === 'Active' ? 'Pending' : entry.status === 'Pending' ? 'Inactive' : 'Active';
    try {
      const entryRef = ref(db, `oec_board/${entry.id}`);
      await update(entryRef, { status: nextStatus, updatedAt: Date.now() });
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleSeedSamples = async () => {
    setIsSubmitting(true);
    try {
      const boardRef = ref(db, 'oec_board');
      for (const sample of SAMPLE_ENTRIES) {
        const newRef = push(boardRef);
        await set(newRef, {
          ...sample,
          updatedAt: Date.now(),
        });
      }
      setStatusMessage({ text: 'Seeded sample flight records to Firebase RTDB!', type: 'success' });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error('Failed to seed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-[#111214] border border-[#26282e] p-5 sm:p-7 text-[#F5F5F5] shadow-2xl transition-all">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#22252a]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>OEC Dispatch Admin Console</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 font-semibold">
                Live Firebase RTDB
              </span>
            </h3>
            <p className="text-xs text-[#8E8E93]">
              Real-time synchronization connected to node <code className="text-[#a5b4fc]">oec_board</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {entries.length === 0 && (
            <button
              type="button"
              onClick={handleSeedSamples}
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-lg bg-[#1a1c22] hover:bg-[#252830] border border-[#333742] text-xs font-medium text-[#22c55e] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
              <span>Seed Sample Rows</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#181a1f] hover:bg-[#22252c] border border-[#2e323b] flex items-center justify-center text-[#999999] hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div
          className={`mb-5 p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-[#22c55e]/10 border-[#22c55e]/30 text-[#4ade80]'
              : 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#f87171]'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Theme & Speed Settings (Saves to /oec_board_settings) */}
      <div className="mb-6 bg-[#16181d] border border-[#22252c] rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-[#22252c]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#22c55e]" />
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Board Real-Time Theme & Speed Controls
            </h4>
          </div>
          <span className="text-[11px] text-[#71717a]">
            Synced node: <code className="text-[#a5b4fc]">/oec_board_settings</code>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* 1. Theme Selection */}
          <div className="lg:col-span-7">
            <label className="block text-[11px] font-medium text-[#a1a1aa] mb-2 uppercase tracking-wide">
              Color Palette / Theme
            </label>
            <div className="grid grid-cols-2 min-[420px]:grid-cols-3 gap-2">
              {THEME_OPTIONS.map((opt) => {
                const isSelected = theme.toLowerCase().includes(opt.id.toLowerCase()) || theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectTheme(opt.id)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#22c55e]/15 border-[#22c55e] text-white shadow-[0_0_12px_rgba(34,197,94,0.25)]'
                        : 'bg-[#111215] border-[#292c35] text-[#888] hover:text-white hover:border-[#444]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: opt.color }}
                    />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Speed Selection + Slider */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-medium text-[#a1a1aa] uppercase tracking-wide flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#22c55e]" />
                <span>Animation Speed & Flip Interval</span>
              </label>
              <span className="text-xs font-bold font-mono text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded border border-[#22c55e]/20">
                {speed}
              </span>
            </div>

            {/* Speed Presets */}
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {SPEED_PRESETS.map((preset) => {
                const isSelected = speed === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handleSelectSpeed(preset.value)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#22c55e]/15 border-[#22c55e] text-white shadow-[0_0_12px_rgba(34,197,94,0.2)]'
                        : 'bg-[#111215] border-[#292c35] text-[#888] hover:text-white hover:border-[#444]'
                    }`}
                  >
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Speed Slider */}
            <div>
              <div className="flex justify-between text-[10px] text-[#71717a] mb-1 font-mono">
                <span>Fast (3s)</span>
                <span>Normal (5s)</span>
                <span>Slow (7s)</span>
              </div>
              <input
                type="range"
                min="3"
                max="7"
                step="0.5"
                value={numericSpeed}
                onChange={(e) => handleSliderSpeedChange(parseFloat(e.target.value))}
                className="w-full accent-[#22c55e] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Scrolling Marquee Settings (Saves to /scrolling_text_settings) */}
      <div className="mb-6 bg-[#16181d] border border-[#22252c] rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-[#22252c]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D2F865]" />
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Top Scrolling Marquee Settings (Official Website Header)
            </h4>
          </div>
          <span className="text-[11px] text-[#71717a]">
            Synced node: <code className="text-[#a5b4fc]">/scrolling_text_settings</code>
          </span>
        </div>

        <div className="space-y-4">
          {/* Marquee Text Input */}
          <div>
            <label className="block text-[11px] font-medium text-[#a1a1aa] mb-1.5 uppercase tracking-wide">
              Notice Message(s) <span className="text-[#71717a] font-normal normal-case">(Separate multiple items with ★ or |)</span>
            </label>
            <textarea
              rows={2}
              value={marqueeText}
              onChange={(e) => setMarqueeText(e.target.value)}
              placeholder="e.g. Welcome to OK Korean Language Center ★ Admission is open now ★ 18+ Years of Excellence"
              className="w-full bg-[#0d0e12] border border-[#282b34] rounded-lg px-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#D2F865] transition-colors resize-y font-mono"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Animation Style Selector */}
            <div className="lg:col-span-7">
              <label className="block text-[11px] font-medium text-[#a1a1aa] mb-2 uppercase tracking-wide">
                Animation Style / Theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'Standard Scroll', label: 'Standard Scroll', color: '#D2F865' },
                  { id: 'Neon Pulse', label: 'Neon Pulse', color: '#facc15' },
                  { id: 'Bounce Wave', label: 'Bounce Wave', color: '#34d399' },
                  { id: 'Fade', label: 'Fade', color: '#38bdf8' },
                  { id: 'Reverse Scroll', label: 'Reverse Scroll', color: '#c084fc' },
                ].map((styleOpt) => {
                  const isSelected =
                    marqueeAnimationType.toLowerCase() === styleOpt.id.toLowerCase() ||
                    marqueeAnimationType.toLowerCase().includes(styleOpt.id.toLowerCase().split(' ')[0]);
                  return (
                    <button
                      key={styleOpt.id}
                      type="button"
                      onClick={() => setMarqueeAnimationType(styleOpt.id)}
                      className={`px-2.5 py-2 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D2F865]/15 border-[#D2F865] text-white shadow-[0_0_12px_rgba(210,248,101,0.25)]'
                          : 'bg-[#111215] border-[#292c35] text-[#888] hover:text-white hover:border-[#444]'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: styleOpt.color }}
                      />
                      <span className="truncate">{styleOpt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scroll Speed Selector */}
            <div className="lg:col-span-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-medium text-[#a1a1aa] uppercase tracking-wide flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-[#D2F865]" />
                  <span>Scroll Speed</span>
                </label>
                <span className="text-xs font-bold font-mono text-[#D2F865] bg-[#D2F865]/10 px-2 py-0.5 rounded border border-[#D2F865]/20">
                  {marqueeSpeed}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                {[
                  { label: 'Fast (6s)', value: '6s' },
                  { label: 'Normal (15s)', value: '15s' },
                  { label: 'Slow (28s)', value: '28s' },
                ].map((spd) => {
                  const isSelected = marqueeSpeed === spd.value;
                  return (
                    <button
                      key={spd.value}
                      type="button"
                      onClick={() => setMarqueeSpeed(spd.value)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D2F865]/15 border-[#D2F865] text-white shadow-[0_0_12px_rgba(210,248,101,0.2)]'
                          : 'bg-[#111215] border-[#292c35] text-[#888] hover:text-white hover:border-[#444]'
                      }`}
                    >
                      <span>{spd.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Speed Slider */}
              <input
                type="range"
                min="4"
                max="35"
                step="1"
                value={parseFloat(marqueeSpeed.replace('s', '')) || 15}
                onChange={(e) => setMarqueeSpeed(`${e.target.value}s`)}
                className="w-full accent-[#D2F865] cursor-pointer"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              disabled={isSavingMarquee}
              onClick={() => handleSaveMarqueeSettings()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#0A0A0A] bg-[#D2F865] hover:bg-[#c2e855] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(210,248,101,0.25)] cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSavingMarquee ? 'Saving...' : 'Save Marquee Settings to Firebase'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Entry / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-[#16181d] border border-[#22252c] rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
            {editingId ? 'Edit Departure Record' : 'Add New Departure Record'}
          </h4>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs text-[#a1a1aa] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Cancel Edit</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Input 1: OEC Number */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
              OEC Number (Flight)
            </label>
            <input
              type="text"
              value={oecNumber}
              onChange={(e) => setOecNumber(e.target.value)}
              placeholder="E.G. OEC 8046"
              maxLength={10}
              className="w-full px-3.5 py-2.5 bg-[#0e1013] border border-[#26282e] rounded-xl text-white text-xs placeholder-[#555] focus:outline-none focus:border-[#22c55e] uppercase"
            />
          </div>

          {/* Input 2: Country Info */}
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
              Country Info (Origin Airport)
            </label>
            <input
              type="text"
              value={countryInfo}
              onChange={(e) => setCountryInfo(e.target.value)}
              placeholder="E.G. SOUTH KOREA / SEOUL"
              maxLength={16}
              className="w-full px-3.5 py-2.5 bg-[#0e1013] border border-[#26282e] rounded-xl text-white text-xs placeholder-[#555] focus:outline-none focus:border-[#22c55e] uppercase"
            />
          </div>

          {/* Input 3: Progress */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
              Progress (Departure / Time)
            </label>
            <input
              type="text"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              placeholder="E.G. 12:15 OR STAGE 4"
              maxLength={10}
              className="w-full px-3.5 py-2.5 bg-[#0e1013] border border-[#26282e] rounded-xl text-white text-xs placeholder-[#555] focus:outline-none focus:border-[#22c55e] uppercase"
            />
          </div>

          {/* Input 4: Status */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OecStatus)}
              className="w-full px-3 py-2.5 bg-[#0e1013] border border-[#26282e] rounded-xl text-white text-xs focus:outline-none focus:border-[#22c55e]"
            >
              <option value="Active">Active (Green Slow)</option>
              <option value="Pending">Pending (Red-Green)</option>
              <option value="Inactive">Inactive (Red Slow)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#1ea34d] text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#22c55e]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{editingId ? 'UPDATE RECORD' : 'SUBMIT TO LED BOARD'}</span>
          </button>
        </div>
      </form>

      {/* Live Firebase Records Table */}
      <div className="border border-[#22252a] rounded-xl overflow-hidden bg-[#0c0d0f]">
        <div className="px-4 py-3 bg-[#131518] border-b border-[#22252a] flex items-center justify-between">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
            Live Firebase Records ({entries.length})
          </h4>
          <span className="text-[11px] text-[#71717a]">
            Click status badge to toggle Active / Pending / Inactive
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-[#71717a] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#22c55e]" />
            <span>Connecting to Firebase Realtime Database...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#71717a]">
            No records found in database. Click &ldquo;Seed Sample Rows&rdquo; above to load sample departures.
          </div>
        ) : (
          <div className="divide-y divide-[#1c1e23]">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-[#16181d] transition-colors text-xs"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 flex-1 items-center">
                  <div className="font-bold text-white tracking-wider uppercase">
                    {entry.oecNumber}
                  </div>
                  <div className="text-[#a1a1aa] truncate uppercase">
                    {entry.countryInfo}
                  </div>
                  <div className="text-[#888] font-mono text-[11px] uppercase">
                    {entry.progress}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(entry)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer transition-all ${
                        entry.status === 'Active'
                          ? 'bg-[#22c55e]/15 text-[#4ade80] border-[#22c55e]/30 hover:bg-[#22c55e]/25'
                          : entry.status === 'Pending'
                          ? 'bg-[#fbbf24]/15 text-[#fde047] border-[#fbbf24]/30 hover:bg-[#fbbf24]/25'
                          : 'bg-[#ef4444]/15 text-[#fca5a5] border-[#ef4444]/30 hover:bg-[#ef4444]/25'
                      }`}
                      title="Click to toggle status"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          entry.status === 'Active'
                            ? 'bg-[#22c55e]'
                            : entry.status === 'Pending'
                            ? 'bg-[#fbbf24]'
                            : 'bg-[#ef4444]'
                        }`}
                      />
                      <span>{entry.status}</span>
                    </button>
                  </div>
                </div>

                {/* Row Action Controls */}
                <div className="flex items-center gap-2 pl-3 ml-2 border-l border-[#22252a]">
                  <button
                    type="button"
                    onClick={() => handleEditClick(entry)}
                    className="p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-[#22252c] transition-colors cursor-pointer"
                    title="Edit record"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id, entry.oecNumber)}
                    className="p-1.5 rounded-lg text-[#888] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminConsole;
