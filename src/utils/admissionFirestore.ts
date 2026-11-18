import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';

// Exact Firebase config for Official Website Admission Form (OK LMS Web App)
const firebaseConfig = {
  apiKey: "AIzaSyB7bfHpaV2njsvG95KSqnj1IH6AZCkzE9A",
  authDomain: "ok-lms-web-app.firebaseapp.com",
  projectId: "ok-lms-web-app",
  storageBucket: "ok-lms-web-app.firebasestorage.app",
  messagingSenderId: "443194825966",
  appId: "1:443194825966:web:e25e74040c4f489a7c67ff",
  measurementId: "G-FHF03PCMYJ"
};

const ADMISSION_APP_NAME = 'ok-lms-admission-app';

// Initialize as a named Firebase app so it coexists cleanly with the RTDB app
const admissionApp =
  getApps().find((app) => app.name === ADMISSION_APP_NAME) ||
  initializeApp(firebaseConfig, ADMISSION_APP_NAME);

export const admissionFirestore: Firestore = getFirestore(admissionApp);

export interface AdmissionRequestPayload {
  fullName: string;
  koreanName?: string;
  fatherName: string;
  email?: string;
  contactNumber: string;
  parentWhatsApp: string;
  batch: string;
  enrollmentDate: string;
  notes?: string;
  whatsappOptIn: boolean;
}

/**
 * Saves an admission request to the `admission_requests` Firestore collection
 * using field names aligned with the OK Korean Centre LMS schema.
 */
export async function submitAdmissionRequest(data: AdmissionRequestPayload): Promise<string> {
  const requestsCollection = collection(admissionFirestore, 'admission_requests');
  const trimmedEmail = data.email?.trim() || '';

  const docRef = await addDoc(requestsCollection, {
    fullName: data.fullName.trim(),
    koreanName: data.koreanName?.trim() || '',
    fatherName: data.fatherName.trim(),
    email: trimmedEmail,
    contactNumber: data.contactNumber.trim(),
    parentWhatsApp: data.parentWhatsApp.trim(),
    batch: data.batch,
    enrollmentDate: data.enrollmentDate,
    notes: data.notes?.trim() || '',
    whatsappOptIn: Boolean(data.whatsappOptIn),
    status: 'pending',
    createdAt: serverTimestamp(),
    submittedAt: Date.now(),
  });

  return docRef.id;
}
