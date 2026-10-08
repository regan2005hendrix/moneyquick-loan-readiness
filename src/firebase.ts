import type { User, Auth, UserCredential } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

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

let firebaseAppPromise: Promise<any> | null = null;

async function getFirebaseApp() {
  if (!isFirebaseConfigured) return null;
  if (!firebaseAppPromise) {
    firebaseAppPromise = (async () => {
      const { getApp, getApps, initializeApp } = await import('firebase/app');
      return getApps().length ? getApp() : initializeApp(firebaseConfig);
    })();
  }
  return firebaseAppPromise;
}

let firebaseAuthPromise: Promise<Auth | null> | null = null;

export async function getFirebaseAuth(): Promise<Auth | null> {
  const app = await getFirebaseApp();
  if (!app) return null;
  if (!firebaseAuthPromise) {
    firebaseAuthPromise = (async () => {
      const { getAuth } = await import('firebase/auth');
      return getAuth(app);
    })();
  }
  return firebaseAuthPromise;
}

let firebaseDbPromise: Promise<Firestore | null> | null = null;

export async function getFirebaseDb(): Promise<Firestore | null> {
  const app = await getFirebaseApp();
  if (!app) return null;
  if (!firebaseDbPromise) {
    firebaseDbPromise = (async () => {
      const { getFirestore } = await import('firebase/firestore');
      return getFirestore(app);
    })();
  }
  return firebaseDbPromise;
}

/**
 * Listen for auth state changes on-demand without blocking initial paint
 */
export async function onAuthChange(callback: (user: User | null) => void): Promise<() => void> {
  const auth = await getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  const { onAuthStateChanged } = await import('firebase/auth');
  return onAuthStateChanged(auth, callback);
}

/**
 * Sign in with email and password
 */
export async function signInEmail(email: string, pass: string): Promise<UserCredential> {
  const auth = await getFirebaseAuth();
  if (!auth) throw new Error('Firebase Authentication is not configured.');
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  return signInWithEmailAndPassword(auth, email, pass);
}

/**
 * Create new account with email and password
 */
export async function signUpEmail(email: string, pass: string): Promise<UserCredential> {
  const auth = await getFirebaseAuth();
  if (!auth) throw new Error('Firebase Authentication is not configured.');
  const { createUserWithEmailAndPassword } = await import('firebase/auth');
  return createUserWithEmailAndPassword(auth, email, pass);
}

/**
 * Sign in with Google Popup
 */
export async function signInGoogle(): Promise<UserCredential> {
  const auth = await getFirebaseAuth();
  if (!auth) throw new Error('Firebase Authentication is not configured.');
  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, provider);
}

/**
 * Trigger password reset email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  const auth = await getFirebaseAuth();
  if (!auth) throw new Error('Firebase Authentication is not configured.');
  const { sendPasswordResetEmail } = await import('firebase/auth');
  return sendPasswordResetEmail(auth, email, { url: window.location.origin });
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  const auth = await getFirebaseAuth();
  if (!auth) return;
  const { signOut } = await import('firebase/auth');
  return signOut(auth);
}

/**
 * Update user profile
 */
export async function updateUserProfile(user: User, profile: { displayName?: string }): Promise<void> {
  const { updateProfile } = await import('firebase/auth');
  return updateProfile(user, profile);
}

/**
 * Persist submitted loan application to Firestore for loan specialists / agents
 */
export async function saveLoanApplication(data: Record<string, unknown>): Promise<string | null> {
  // 1. Always persist locally in localStorage as a guaranteed immediate backup (with deduplication)
  try {
    const existing = JSON.parse(localStorage.getItem('moneyquick_saved_applications') || '[]');
    const filtered = existing.filter((item: any) => item.applicationId !== data.applicationId);
    filtered.unshift({
      ...data,
      status: data.status || 'verification',
      currentStage: data.currentStage || 2,
      savedLocallyAt: new Date().toISOString(),
    });
    localStorage.setItem('moneyquick_saved_applications', JSON.stringify(filtered.slice(0, 50)));
  } catch (storageErr) {
    console.warn('Local storage write warning:', storageErr);
  }

  const db = await getFirebaseDb();
  if (!db) {
    console.info('Firestore is not configured. Submission saved locally.');
    return null;
  }

  // 2. Wrap addDoc in a strict timeout (2.5s) because Firebase JS SDK addDoc
  // hangs indefinitely when Firestore is not enabled or network streams disconnect
  try {
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error('Firestore operation timed out')), 2500);
    });

    const addDocPromise = addDoc(collection(db, 'loan_applications'), {
      ...data,
      status: data.status || 'verification',
      currentStage: data.currentStage || 2,
      createdAt: serverTimestamp(),
    }).then((docRef) => docRef.id);

    const docId = await Promise.race([addDocPromise, timeoutPromise]);
    return docId;
  } catch (error) {
    console.warn('Unable to persist application to Firestore (continuing safely):', error);
    return null;
  }
}

/**
 * Retrieve recently saved applications from localStorage
 */
export function getRecentSavedApplications(): Record<string, any>[] {
  try {
    const list = JSON.parse(localStorage.getItem('moneyquick_saved_applications') || '[]');
    if (Array.isArray(list)) return list;
  } catch (e) {
    console.warn('Error reading saved applications:', e);
  }
  return [];
}

/**
 * Look up a saved application by Application ID (e.g. MQ-APP-XXXXXX) or phone number
 */
export async function fetchSavedApplication(searchQuery: string): Promise<Record<string, any> | null> {
  const cleanQuery = searchQuery.trim().toLowerCase();
  if (!cleanQuery) return null;

  // 1. Check local storage first (instantaneous)
  const localList = getRecentSavedApplications();
  const matchedLocal = localList.find((app) => {
    const appId = String(app.applicationId || '').toLowerCase();
    const phone = String(app.phone || '').replace(/\D/g, '');
    const cleanDigits = cleanQuery.replace(/\D/g, '');
    return appId.includes(cleanQuery) || (cleanDigits.length >= 6 && phone.includes(cleanDigits));
  });

  if (matchedLocal) {
    return matchedLocal;
  }

  // 2. Fall back to Firestore if configured
  const db = await getFirebaseDb();
  if (!db) return null;

  try {
    const { collection, query, where, getDocs, limit } = await import('firebase/firestore');
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error('Firestore search timed out')), 2500);
    });

    const searchFirestore = async (): Promise<Record<string, any> | null> => {
      const col = collection(db, 'loan_applications');
      // Search by applicationId
      const q = query(col, where('applicationId', '==', searchQuery.trim().toUpperCase()), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data();
      }
      return null;
    };

    const doc = await Promise.race([searchFirestore(), timeoutPromise]);
    return doc;
  } catch (err) {
    console.warn('Firestore lookup error:', err);
    return null;
  }
}
