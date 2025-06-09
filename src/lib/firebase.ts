import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signInWithRedirect,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  User,
  getRedirectResult
} from 'firebase/auth';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  Firestore
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDWBHaJPAD6NL9NwT-EUFPCppgk5E_wTmw",
  authDomain: "senikimstalkliyor.firebaseapp.com",
  projectId: "senikimstalkliyor",
  storageBucket: "senikimstalkliyor.firebasestorage.app",
  messagingSenderId: "859242529776",
  appId: "1:859242529776:web:806e1a5c2ad27a5a4ad335",
  measurementId: "G-5PX3HCHB98"
};

let app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
let db: Firestore;

// Client-side Firebase initialization
if (typeof window !== 'undefined') {
  try {
    // Configure Auth
    const auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => console.error('Auth persistence error:', error));

    // Configure Analytics in production
    if (process.env.NODE_ENV === 'production') {
      const analytics = getAnalytics(app);
      logEvent(analytics, 'app_initialized');
    }

    // Initialize Firestore
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  // Server-side initialization
  db = getFirestore(app);
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface SocialMediaData {
  instagram?: string;
  updatedAt?: string;
}

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    console.log('Starting Google sign in...');
    
    if (process.env.NODE_ENV === 'development') {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign in successful (popup):', result.user.email);
      return result.user;
    } else {
      // Check if we have a redirect result first
      const result = await getRedirectResult(auth);
      if (result) {
        console.log('Google sign in successful (redirect):', result.user.email);
        return result.user;
      }
      // If no redirect result, start the redirect flow
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
  } catch (error: unknown) {
    console.error('Google sign in error:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/unauthorized-domain') {
      throw new Error('Bu domain üzerinden giriş yapılamıyor. Lütfen yetkili bir domain kullanın.');
    }
    throw error;
  }
};

export const signInAnonymous = async () => {
  try {
    console.log('Starting anonymous sign in...');
    const result = await signInAnonymously(auth);
    
    await setDoc(doc(db, 'users', result.user.uid), {
      isAnonymous: true,
      lastLogin: new Date().toISOString(),
      provider: 'anonymous'
    }, { merge: true });

    if (process.env.NODE_ENV === 'production') {
      const analytics = getAnalytics(app);
      logEvent(analytics, 'login', {
        method: 'anonymous',
        userId: result.user.uid
      });
    }

    return result.user;
  } catch (error) {
    console.error('Anonymous sign in error:', error);
    throw error;
  }
};

export const saveSocialMediaInfo = async (userId: string, data: SocialMediaData): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving social media info:', error);
    return false;
  }
};

export const getSocialMediaInfo = async (userId: string): Promise<SocialMediaData | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as SocialMediaData;
    }
    return null;
  } catch (error) {
    console.error('Error getting social media info:', error);
    return null;
  }
};

export const trackUserActivity = {
  pageView: (pathname: string) => {
    try {
      if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
        const analytics = getAnalytics(app);
        logEvent(analytics, 'page_view', {
          page_path: pathname,
          page_title: document.title,
        });
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  },
  
  event: (eventName: string, params?: Record<string, any>) => {
    try {
      if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
        const analytics = getAnalytics(app);
        logEvent(analytics, eventName, params);
      }
    } catch (error) {
      console.error('Analytics event tracking error:', error);
    }
  }
};

export { auth, db }; 