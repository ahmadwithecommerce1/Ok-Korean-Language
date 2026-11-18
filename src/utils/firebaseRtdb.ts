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

// =========================================================================
// WEBSITE GALLERY (Synced via Firebase RTDB node /website_gallery)
// =========================================================================

export type GalleryCategory = 'Photos' | 'Videos' | 'Results';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: GalleryCategory;
  mediaUrl: string;
  thumbnailUrl?: string;
  fileType?: 'image' | 'video' | 'pdf';
  date?: string;
  createdAt?: number;
}

export const SAMPLE_GALLERY_ITEMS: Omit<GalleryItem, 'id'>[] = [
  {
    title: '2026 EPS-TOPIK Round 1 Official Pass List',
    description: 'Official result gazette verifying our students selected for South Korea E-9 manufacturing work permits.',
    category: 'Results',
    mediaUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    fileType: 'pdf',
    date: 'March 2026',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    title: 'Seoul Native Faculty Spoken Immersion Session',
    description: 'Interactive classroom workshop on natural Korean speech, honorifics, and workplace dialogues.',
    category: 'Photos',
    mediaUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    fileType: 'image',
    date: 'February 2026',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    title: 'EPS-TOPIK Question Bank & Mock Listening Drill',
    description: 'Real-time auditory training imitating official CBT computer-based exam environments.',
    category: 'Videos',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    fileType: 'video',
    date: 'January 2026',
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    title: 'South Korea Visa Issuance & Passport Handover Ceremony',
    description: 'Annual celebratory ceremony for candidates departing for Incheon International Airport.',
    category: 'Photos',
    mediaUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    fileType: 'image',
    date: 'January 2026',
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    title: 'TOPIK II Academic Distinction Award Certificate',
    description: 'High-score merit awards achieving Level 5 & Level 6 certification for university admissions in Seoul.',
    category: 'Results',
    mediaUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=800&q=80',
    fileType: 'pdf',
    date: 'December 2025',
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    title: 'Student Journey: From Lahore Classroom to Busan Shipyard',
    description: 'Inspiring documentary following our student through language tests, medical clearance, and arrival in Korea.',
    category: 'Videos',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
    fileType: 'video',
    date: 'November 2025',
    createdAt: Date.now() - 86400000 * 40,
  },
];

/**
 * Listens for real-time updates from Firebase Realtime Database on /website_gallery
 */
export function subscribeToGallery(callback: (items: GalleryItem[]) => void): () => void {
  const galleryRef = ref(rtdb, 'website_gallery');

  const unsubscribe = onValue(
    galleryRef,
    (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }

      const items: GalleryItem[] = Object.entries(data).map(([key, val]: [string, any]) => {
        let category: GalleryCategory = 'Photos';
        const rawCat = (val.category || '').toLowerCase();
        if (rawCat.includes('result') || rawCat.includes('pdf')) category = 'Results';
        else if (rawCat.includes('video')) category = 'Videos';
        else category = 'Photos';

        let fileType: 'image' | 'video' | 'pdf' = val.fileType;
        if (!fileType) {
          const url = (val.mediaUrl || '').toLowerCase();
          if (url.includes('.pdf') || category === 'Results') fileType = 'pdf';
          else if (url.includes('.mp4') || url.includes('.webm') || url.includes('youtube') || url.includes('youtu.be') || category === 'Videos') fileType = 'video';
          else fileType = 'image';
        }

        return {
          id: key,
          title: val.title || 'Untitled Media',
          description: val.description || '',
          category,
          mediaUrl: val.mediaUrl || '',
          thumbnailUrl: val.thumbnailUrl || (fileType === 'image' ? val.mediaUrl : ''),
          fileType,
          date: val.date || 'Recent',
          createdAt: val.createdAt || Date.now(),
        };
      });

      // Sort newest first
      items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(items);
    },
    (error) => {
      console.error('Firebase Gallery listener error:', error);
      callback([]);
    }
  );

  return () => {
    unsubscribe();
  };
}

/**
 * Adds a new item to /website_gallery
 */
export async function addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<string | null> {
  try {
    const galleryRef = ref(rtdb, 'website_gallery');
    const newRef = push(galleryRef);
    await set(newRef, {
      ...item,
      createdAt: item.createdAt || Date.now(),
    });
    return newRef.key;
  } catch (err) {
    console.error('Failed to add gallery item:', err);
    throw err;
  }
}

/**
 * Deletes an item from /website_gallery
 */
export async function deleteGalleryItem(id: string): Promise<void> {
  try {
    const itemRef = ref(rtdb, `website_gallery/${id}`);
    await remove(itemRef);
  } catch (err) {
    console.error('Failed to delete gallery item:', err);
    throw err;
  }
}

/**
 * Seeds sample gallery items to Firebase if empty
 */
export async function seedSampleGalleryItems(): Promise<void> {
  try {
    const galleryRef = ref(rtdb, 'website_gallery');
    for (const sample of SAMPLE_GALLERY_ITEMS) {
      const newRef = push(galleryRef);
      await set(newRef, sample);
    }
  } catch (err) {
    console.error('Failed to seed gallery items:', err);
    throw err;
  }
}

