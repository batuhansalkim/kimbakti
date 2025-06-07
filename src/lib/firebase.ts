import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
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
  Firestore,
  PersistenceSettings
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

// Firebase yapılandırmasını bir kez başlat
const initializeFirebase = () => {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  } else {
    return getApps()[0];
  }
};

// Initialize Firebase
let app: FirebaseApp = initializeFirebase();
let db: Firestore;
let checkConnection: () => Promise<boolean>;

// Firestore'u yapılandır
const configureFirestore = async () => {
  if (!app) {
    app = initializeFirebase();
  }

  try {
    // Firestore'u başlat
    db = getFirestore(app);

    // Persistence'ı etkinleştirmeyi dene
    try {
      await enableIndexedDbPersistence(db);
      console.log('Firestore offline persistence enabled');
    } catch (err: any) {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
      } else if (err.message?.includes('already been started')) {
        console.warn('Persistence already enabled');
      } else {
        console.error('Firestore persistence error:', err);
      }
    }

    return db;
  } catch (error) {
    console.error('Error configuring Firestore:', error);
    throw error;
  }
};

// Bağlantı kontrolü
const createConnectionChecker = (database: Firestore) => {
  return async () => {
    if (!navigator.onLine) {
      console.log('Device is offline, skipping connection check');
      return false;
    }

    try {
      const testDoc = doc(database, '_connection_test', 'test');
      await getDoc(testDoc);
      console.log('Firestore connection successful');
      return true;
    } catch (error) {
      console.warn('Firestore connection failed:', error);
      return false;
    }
  };
};

// Firebase'i başlat
if (typeof window !== 'undefined') {
  try {
    // Firebase'i başlat
    app = initializeFirebase();
    
    // Auth'u yapılandır
    const auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log('Auth persistence set to local'))
      .catch((error) => console.error('Auth persistence error:', error));

    // Analytics'i yapılandır
    const analytics = getAnalytics(app);

    // Firestore'u yapılandır
    configureFirestore()
      .then(database => {
        db = database;
        checkConnection = createConnectionChecker(database);
        return checkConnection();
      })
      .catch(error => {
        console.error('Failed to initialize Firestore:', error);
        // Kritik bir hata olduğunda kullanıcıyı bilgilendir
        if (typeof window !== 'undefined') {
          window.alert('Veritabanı bağlantısında bir sorun oluştu. Lütfen sayfayı yenileyip tekrar deneyin.');
        }
      });
  } catch (error) {
    console.error('Critical Firebase initialization error:', error);
    if (typeof window !== 'undefined') {
      window.alert('Uygulama başlatılırken bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.');
    }
  }
} else {
  app = initializeFirebase();
  db = getFirestore(app);
  checkConnection = async () => false;
}

const auth = getAuth(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const googleProvider = new GoogleAuthProvider();

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
export const saveSocialMediaInfo = async (userId: string, data: { instagram?: string }) => {
  try {
    console.log('Saving Instagram info for user:', userId);
    
    // Kullanıcı kontrolü
    if (!auth.currentUser) {
      throw new Error('Oturum açmanız gerekiyor.');
    }

    // Bağlantı durumunu kontrol et
    if (!navigator.onLine) {
      throw new Error('İnternet bağlantınız yok. Çevrimiçi olduğunuzda tekrar deneyin.');
    }

    // Firestore bağlantısını kontrol et
    const userRef = doc(db, 'users', userId);
    
    // Veriyi kaydet
    await setDoc(userRef, {
      instagram: data.instagram || '',
      updatedAt: new Date().toISOString()
    }, { merge: true }); // merge: true sayesinde diğer verileri koruyoruz

    console.log('Instagram info saved successfully');
    return true;
  } catch (error: any) {
    console.error('Error saving Instagram info:', error);
    // Firebase hatalarını daha anlaşılır hale getir
    if (error.code === 'permission-denied') {
      throw new Error('Veri kaydetme izniniz yok. Lütfen tekrar giriş yapın.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firebase servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.');
    } else if (error.code === 'not-found') {
      throw new Error('Kullanıcı bilgileri bulunamadı.');
    }
    throw error;
  }
};

// Sosyal medya bilgilerini getirme
export const getSocialMediaInfo = async (userId: string) => {
  const maxRetries = 3;
  let lastError = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Getting social media info for user: ${userId} (attempt ${i + 1}/${maxRetries})`);
      
      if (!navigator.onLine) {
        throw new Error('İnternet bağlantınız yok. Çevrimiçi olduğunuzda tekrar deneyin.');
      }

      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Successfully retrieved social media info:', data);
        return {
          instagram: data.instagram || ''
        };
      }
      
      return { instagram: '' };
    } catch (error: any) {
      console.error(`Error getting social media info (attempt ${i + 1}):`, error);
      lastError = error;

      if (!navigator.onLine || error.code === 'permission-denied') {
        break;
      }

      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
    }
  }

  if (lastError) {
    if (!navigator.onLine) {
      throw new Error('İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
    } else if (lastError.code === 'unavailable' || lastError.message?.includes('WebChannel')) {
      throw new Error('Sunucu bağlantısında sorun oluştu. Lütfen tekrar deneyin.');
    }
  }

  throw new Error('Sosyal medya bilgileri alınırken bir hata oluştu. Lütfen tekrar deneyin.');
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

export { auth, app, db, checkConnection }; 