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

export const firebaseConfig = {
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
export const rtdb: Database = getDatabase(app, firebaseConfig.databaseURL);

export type OecStatus = 'Active' | 'Pending' | 'Inactive';

export interface OecBoardEntry {
  id: string;
  oecNumber: string;    // Col 1: OEC / Flight (e.g. "OEC-8046", "KOR-343")
  countryInfo: string;  // Col 2: Country Info / Origin (e.g. "SOUTH KOREA", "SEOUL INCHEON")
  progress: string;     // Col 3: Progress / Time (e.g. "STAGE 4 - 95%", "13:05", "VISA ISSUED")
  status: OecStatus;    // Col 4: Status (Active, Pending, Inactive)
  updatedAt?: number;
}

// Initial realistic replica data matching the authentic airport board photo
export const SAMPLE_OEC_ENTRIES: Omit<OecBoardEntry, 'id'>[] = [
  { oecNumber: 'OEC 8046', countryInfo: 'SEOUL INCHEON', progress: '12:15', status: 'Active' },
  { oecNumber: 'WY 343', countryInfo: 'BUSAN PORT', progress: '13:05', status: 'Active' },
  { oecNumber: 'PA 402', countryInfo: 'GWANGJU EPS', progress: '13:50', status: 'Pending' },
  { oecNumber: 'KOR 712', countryInfo: 'DAEGU CENTRAL', progress: '14:30', status: 'Active' },
  { oecNumber: 'ER 522', countryInfo: 'INCHEON CARGO', progress: '14:45', status: 'Inactive' },
  { oecNumber: 'OEC 542', countryInfo: 'JEJU FISHERIES', progress: '14:45', status: 'Active' },
  { oecNumber: 'PF 143', countryInfo: 'ULSAN SHIPYARD', progress: '15:15', status: 'Pending' },
  { oecNumber: 'PF 125', countryInfo: 'SUWON TECH', progress: '15:15', status: 'Active' },
  { oecNumber: 'PA 417', countryInfo: 'CHANGWON MFG', progress: '16:45', status: 'Active' },
  { oecNumber: 'PA 411', countryInfo: 'SEOUL GIMPO', progress: '16:45', status: 'Pending' },
];

/**
 * Listens for real-time updates from Firebase Realtime Database
 */
export function subscribeToOecBoard(callback: (entries: OecBoardEntry[]) => void): () => void {
  const oecRef = ref(rtdb, 'oec_board');

  const unsubscribe = onValue(
    oecRef,
    (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }

      // Convert RTDB object map into array
      const entries: OecBoardEntry[] = Object.entries(data).map(([key, val]: [string, any]) => ({
        id: key,
        oecNumber: String(val.oecNumber || '').toUpperCase(),
        countryInfo: String(val.countryInfo || '').toUpperCase(),
        progress: String(val.progress || '').toUpperCase(),
        status: (val.status === 'Pending' || val.status === 'Inactive' ? val.status : 'Active') as OecStatus,
        updatedAt: val.updatedAt || Date.now(),
      }));

      // Sort by updated time or default
      entries.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      callback(entries);
    },
    (error) => {
      console.error('Firebase RTDB listener error:', error);
      callback([]);
    }
  );

  return () => {
    unsubscribe();
  };
}

/**
 * Add a new OEC Board record to Firebase Realtime Database
 */
export async function addOecEntry(entry: Omit<OecBoardEntry, 'id'>): Promise<string | null> {
  try {
    const oecRef = ref(rtdb, 'oec_board');
    const newRef = push(oecRef);
    await set(newRef, {
      ...entry,
      oecNumber: entry.oecNumber.trim().toUpperCase(),
      countryInfo: entry.countryInfo.trim().toUpperCase(),
      progress: entry.progress.trim().toUpperCase(),
      status: entry.status,
      updatedAt: Date.now(),
    });
    return newRef.key;
  } catch (error) {
    console.error('Failed to add OEC entry:', error);
    throw error;
  }
}

/**
 * Update an existing OEC record
 */
export async function updateOecEntry(id: string, updates: Partial<Omit<OecBoardEntry, 'id'>>): Promise<void> {
  try {
    const entryRef = ref(rtdb, `oec_board/${id}`);
    const sanitized: Record<string, any> = { ...updates, updatedAt: Date.now() };
    if (updates.oecNumber) sanitized.oecNumber = updates.oecNumber.trim().toUpperCase();
    if (updates.countryInfo) sanitized.countryInfo = updates.countryInfo.trim().toUpperCase();
    if (updates.progress) sanitized.progress = updates.progress.trim().toUpperCase();
    await update(entryRef, sanitized);
  } catch (error) {
    console.error('Failed to update OEC entry:', error);
    throw error;
  }
}

/**
 * Delete an OEC record
 */
export async function deleteOecEntry(id: string): Promise<void> {
  try {
    const entryRef = ref(rtdb, `oec_board/${id}`);
    await remove(entryRef);
  } catch (error) {
    console.error('Failed to delete OEC entry:', error);
    throw error;
  }
}

/**
 * Seeds sample OEC Departure entries into Firebase if empty
 */
export async function seedSampleOecEntries(): Promise<void> {
  try {
    const oecRef = ref(rtdb, 'oec_board');
    for (const sample of SAMPLE_OEC_ENTRIES) {
      const newRef = push(oecRef);
      await set(newRef, {
        ...sample,
        updatedAt: Date.now() - Math.floor(Math.random() * 100000),
      });
    }
  } catch (error) {
    console.error('Failed to seed sample entries:', error);
    throw error;
  }
}

// =========================================================================
// BOARD SETTINGS (Theme & Speed customization synced via /oec_board_settings)
// =========================================================================

export type BoardTheme = 'Classic Green' | 'Purple Neon' | 'Amber Gold' | 'Cyber Blue' | 'Crimson Red';
export type BoardSpeed = 'slow' | 'normal' | 'fast';

export interface BoardSettings {
  theme: BoardTheme;
  speed: BoardSpeed;
  flipIntervalSeconds?: number;
  updatedAt?: number;
}

export const DEFAULT_BOARD_SETTINGS: BoardSettings = {
  theme: 'Classic Green',
  speed: 'slow',
  flipIntervalSeconds: 7,
};

/**
 * Subscribes to real-time changes on the `oec_board_settings` node
 */
export function subscribeToBoardSettings(callback: (settings: BoardSettings) => void): () => void {
  const settingsRef = ref(rtdb, 'oec_board_settings');

  const unsubscribe = onValue(
    settingsRef,
    (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback(DEFAULT_BOARD_SETTINGS);
        return;
      }

      callback({
        theme: (data.theme as BoardTheme) || 'Classic Green',
        speed: (data.speed as BoardSpeed) || 'slow',
        flipIntervalSeconds: data.flipIntervalSeconds || (data.speed === 'fast' ? 4 : data.speed === 'normal' ? 5 : 7),
        updatedAt: data.updatedAt || Date.now(),
      });
    },
    (error) => {
      console.error('Firebase settings listener error:', error);
      callback(DEFAULT_BOARD_SETTINGS);
    }
  );

  return () => {
    unsubscribe();
  };
}

/**
 * Saves or updates theme and speed settings in Firebase RTDB (/oec_board_settings)
 */
export async function updateBoardSettings(settings: Partial<BoardSettings>): Promise<void> {
  const settingsRef = ref(rtdb, 'oec_board_settings');
  try {
    await update(settingsRef, {
      ...settings,
      updatedAt: Date.now(),
    });
  } catch (_err) {
    // If update fails because the node does not exist yet, initialize with set
    await set(settingsRef, {
      ...DEFAULT_BOARD_SETTINGS,
      ...settings,
      updatedAt: Date.now(),
    });
  }
}
