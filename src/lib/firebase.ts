import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInAnonymously, signInWithPopup } from 'firebase/auth';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDWBHaJPAD6NL9NwT-EUFPCppgk5E_wTmw",
  authDomain: "senikimstalkliyor.firebaseapp.com",
  projectId: "senikimstalkliyor",
  storageBucket: "senikimstalkliyor.firebasestorage.app",
  messagingSenderId: "859242529776",
  appId: "1:859242529776:web:806e1a5c2ad27a5a4ad335",
  measurementId: "G-5PX3HCHB98"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (analytics) {
      logEvent(analytics, 'login', {
        method: 'google',
        userId: result.user.uid,
        userEmail: result.user.email
      });
    }
    return result.user;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

export const signInAnonymous = async () => {
  try {
    const result = await signInAnonymously(auth);
    if (analytics) {
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

// Sosyal medya bilgilerini kaydetme
export const saveSocialMediaInfo = async (userId: string, data: { instagram?: string; tiktok?: string }) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      socialMedia: data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    if (analytics) {
      logEvent(analytics, 'social_media_update', {
        userId,
        hasInstagram: !!data.instagram,
        hasTiktok: !!data.tiktok
      });
    }
  } catch (error) {
    console.error('Error saving social media info:', error);
    throw error;
  }
};

// Sosyal medya bilgilerini getirme
export const getSocialMediaInfo = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().socialMedia : null;
  } catch (error) {
    console.error('Error getting social media info:', error);
    throw error;
  }
};

// Kullanıcı aktivitelerini izleme
export const trackUserActivity = {
  pageView: (pageName: string) => {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_name: pageName,
        user_id: auth.currentUser?.uid
      });
    }
  },
  
  generateReport: (userId: string) => {
    if (analytics) {
      logEvent(analytics, 'report_generated', {
        userId,
        timestamp: new Date().toISOString()
      });
    }
  },
  
  premiumView: (userId: string) => {
    if (analytics) {
      logEvent(analytics, 'premium_page_view', {
        userId,
        timestamp: new Date().toISOString()
      });
    }
  }
};

export { auth, app, db }; 