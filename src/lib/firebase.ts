import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  inMemoryPersistence,
  signInWithPopup
} from 'firebase/auth';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  enableIndexedDbPersistence,
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

// Initialize Firebase
let app;
let db: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const googleProvider = new GoogleAuthProvider();

// Firestore'u başlat ve offline persistence'ı etkinleştir
if (typeof window !== 'undefined') {
  db = getFirestore(app);
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    } else {
      console.error('Firestore persistence error:', err);
    }
  });
} else {
  db = getFirestore(app);
}

// Auth persistence'ı ayarla
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Auth persistence set to local');
    })
    .catch((error) => {
      console.error('Auth persistence error:', error);
    });
}

export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google sign in...');
    
    // Development ortamında popup, production'da redirect kullan
    if (process.env.NODE_ENV === 'development') {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign in successful (popup):', result.user.email);
      return result.user;
    } else {
      await signInWithRedirect(auth, googleProvider);
    }
  } catch (error: any) {
    console.error('Google sign in error:', error);
    // Daha açıklayıcı hata mesajları
    if (error.code === 'auth/unauthorized-domain') {
      throw new Error('Bu domain üzerinden giriş yapılamıyor. Lütfen yetkili bir domain kullanın.');
    }
    throw error;
  }
};

export const signInAnonymous = async () => {
  try {
    console.log('Starting anonymous sign in...');
    const result = await signInAnonymously(auth);
    
    // Kullanıcı bilgilerini Firestore'a kaydet
    await setDoc(doc(db, 'users', result.user.uid), {
      isAnonymous: true,
      lastLogin: new Date().toISOString(),
      provider: 'anonymous'
    }, { merge: true });

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

// Redirect sonucunu kontrol et
export const handleRedirectResult = async () => {
  try {
    console.log('Checking redirect result...');
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('Redirect result success:', result.user.email);
      
      // Kullanıcı bilgilerini Firestore'a kaydet
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        lastLogin: new Date().toISOString(),
        provider: 'google'
      }, { merge: true });

      if (analytics) {
        logEvent(analytics, 'login', {
          method: 'google',
          userId: result.user.uid,
          userEmail: result.user.email
        });
      }

      return result.user;
    }
    console.log('No redirect result');
    return null;
  } catch (error) {
    console.error('Redirect result error:', error);
    throw error;
  }
};

// Sosyal medya bilgilerini kaydetme
export const saveSocialMediaInfo = async (userId: string, data: { instagram?: string; tiktok?: string }) => {
  try {
    console.log('Saving social media info for user:', userId);
    const userRef = doc(db, 'users', userId);
    
    // Önce mevcut veriyi kontrol et
    const docSnap = await getDoc(userRef);
    const existingData = docSnap.exists() ? docSnap.data() : {};

    // Yeni veriyi kaydet
    await setDoc(userRef, {
      ...existingData,
      socialMedia: {
        instagram: data.instagram || '',
        tiktok: data.tiktok || '',
        updatedAt: new Date().toISOString()
      }
    }, { 
      merge: true 
    });

    console.log('Social media info saved successfully');
    
    if (analytics) {
      logEvent(analytics, 'social_media_update', {
        userId,
        hasInstagram: !!data.instagram,
        hasTiktok: !!data.tiktok
      });
    }

    return true;
  } catch (error: any) {
    console.error('Error saving social media info:', error);
    
    // Daha spesifik hata mesajları
    if (error.code === 'unavailable' || error.code === 'failed-precondition') {
      throw new Error('İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
    } else if (error.code === 'permission-denied') {
      throw new Error('Bu işlem için yetkiniz bulunmuyor.');
    } else if (error.code === 'not-found') {
      throw new Error('Kullanıcı bilgileri bulunamadı.');
    }
    
    throw new Error('Sosyal medya bilgileri kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
  }
};

// Sosyal medya bilgilerini getirme
export const getSocialMediaInfo = async (userId: string) => {
  try {
    console.log('Getting social media info for user:', userId);
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.socialMedia || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting social media info:', error);
    throw new Error('Sosyal medya bilgileri alınırken bir hata oluştu. Lütfen tekrar deneyin.');
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