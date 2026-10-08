import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey
  && firebaseConfig.authDomain
  && firebaseConfig.projectId
  && firebaseConfig.appId,
);

const firebaseApp = isFirebaseConfigured
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firebaseDb = firebaseApp ? getFirestore(firebaseApp) : null;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Persist submitted loan application to Firestore for loan specialists / agents
 */
export async function saveLoanApplication(data: Record<string, unknown>): Promise<string | null> {
  // 1. Always persist locally in localStorage as a guaranteed immediate backup
  try {
    const existing = JSON.parse(localStorage.getItem('moneyquick_saved_applications') || '[]');
    existing.unshift({
      ...data,
      savedLocallyAt: new Date().toISOString(),
    });
    localStorage.setItem('moneyquick_saved_applications', JSON.stringify(existing.slice(0, 50)));
  } catch (storageErr) {
    console.warn('Local storage write warning:', storageErr);
  }

  if (!firebaseDb) {
    console.info('Firestore is not configured. Submission saved locally.');
    return null;
  }

  // 2. Wrap addDoc in a strict timeout (2.5s) because Firebase JS SDK addDoc
  // hangs indefinitely when Firestore is not enabled or network streams disconnect
  try {
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error('Firestore operation timed out')), 2500);
    });

    const addDocPromise = addDoc(collection(firebaseDb, 'loan_applications'), {
      ...data,
      status: 'pending_agent_call',
      createdAt: serverTimestamp(),
    }).then((docRef) => docRef.id);

    const docId = await Promise.race([addDocPromise, timeoutPromise]);
    return docId;
  } catch (error) {
    console.warn('Unable to persist application to Firestore (continuing safely):', error);
    return null;
  }
}

