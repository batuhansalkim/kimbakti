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
  Firestore,
  enableIndexedDbPersistence
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

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Analytics'i sadece client-side ve production'da başlat
export const analytics = typeof window !== 'undefined' && process.env.NODE_ENV === 'production' 
  ? getAnalytics(app) 
  : null;

export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Firebase Auth with persistence
const initializeAuth = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log('Firebase Auth persistence set to LOCAL');
  } catch (error) {
    console.error('Error setting Auth persistence:', error);
  }
};

// Initialize Firestore with persistence
const initializeFirestore = async () => {
  if (typeof window !== 'undefined') {
    try {
      await enableIndexedDbPersistence(db);
      console.log('Firestore persistence enabled');
    } catch (err: any) {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence failed - multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence not available in this browser');
      }
    }
  }
};

// Initialize both Auth and Firestore
Promise.all([initializeAuth(), initializeFirestore()])
  .then(() => {
    console.log('Firebase services initialized successfully');
    
    // Analytics event'ini sadece production'da ve analytics varsa gönder
    if (process.env.NODE_ENV === 'production' && analytics) {
      logEvent(analytics, 'app_initialized');
    }
  })
  .catch((error) => {
    console.error('Error initializing Firebase services:', error);
  });

const googleProvider = new GoogleAuthProvider();

// Firestore bağlantı durumunu kontrol et
const checkFirestoreConnection = async () => {
  try {
    // Test dokümanı oluştur
    const testDoc = doc(db, '_connection_test', 'test');
    await setDoc(testDoc, { timestamp: new Date().toISOString() });
    console.log('Firestore connection successful');
    return true;
  } catch (error) {
    console.error('Firestore connection error:', error);
    return false;
  }
};

interface SocialMediaData {
  instagram?: string;
  updatedAt?: string;
}

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    // Önce Firestore bağlantısını kontrol et
    await checkFirestoreConnection();
    
    console.log('Starting Google sign in...');
    console.log('Current environment:', process.env.NODE_ENV);
    
    // Her zaman popup kullan
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google sign in successful:', result.user.email);
    return result.user;

  } catch (error: unknown) {
    console.error('Google sign in error:', error);
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Error code:', error.code);
      if (error.code === 'auth/popup-blocked') {
        console.log('Popup blocked, trying redirect...');
        await signInWithRedirect(auth, googleProvider);
        return null;
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('Bu domain üzerinden giriş yapılamıyor. Lütfen yetkili bir domain kullanın.');
      }
    }
    throw error;
  }
};

// Redirect sonucunu kontrol eden yeni fonksiyon
export const checkRedirectResult = async (): Promise<User | null> => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('Redirect result successful:', result.user.email);
      return result.user;
    }
    return null;
  } catch (error) {
    console.error('Error checking redirect result:', error);
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

if (process.env.NODE_ENV === 'production') {
  console.log('Firebase initialized in production mode');
} else {
  console.log('Firebase initialized in development mode');
} 