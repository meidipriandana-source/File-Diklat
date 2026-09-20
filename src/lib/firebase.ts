import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Required Workspace Scopes
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.setCustomParameters({
  prompt: 'select_account',
});

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // In session restoration, if no token cached in memory yet, prompt or keep user
        if (onAuthSuccess && cachedAccessToken) {
          onAuthSuccess(user, cachedAccessToken);
        } else if (onAuthFailure) {
          onAuthFailure();
        }
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export interface SignInResult {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
  };
  accessToken: string;
  isGsi?: boolean;
}

// Attempt Google Identity Services (GSI) Token Client
export const signInWithGsi = (): Promise<SignInResult> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window not available'));
    }

    const google = (window as any).google;
    if (!google?.accounts?.oauth2?.initTokenClient) {
      return reject(new Error('Google Identity Services belum dimuat'));
    }

    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: firebaseConfig.oAuthClientId,
        scope:
          'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        callback: async (response: any) => {
          if (response.error) {
            return reject(new Error(response.error_description || response.error));
          }
          const token = response.access_token;
          cachedAccessToken = token;

          try {
            const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${token}` },
            });
            const userData = await userRes.json();
            resolve({
              user: {
                uid: userData.sub || 'google-user-' + Date.now(),
                email: userData.email || null,
                displayName: userData.name || userData.email || 'Petugas Diklat RSUD',
                photoURL: userData.picture || null,
              },
              accessToken: token,
              isGsi: true,
            });
          } catch (e) {
            resolve({
              user: {
                uid: 'google-user-' + Date.now(),
                email: 'diklat@rsudjusufsk.id',
                displayName: 'Petugas Diklat RSUD dr. H. Jusuf SK',
              },
              accessToken: token,
              isGsi: true,
            });
          }
        },
      });

      client.requestAccessToken();
    } catch (err) {
      reject(err);
    }
  });
};

export const googleSignIn = async (): Promise<SignInResult | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan token akses dari Google Sign-In');
    }

    cachedAccessToken = credential.accessToken;
    return {
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      },
      accessToken: cachedAccessToken,
    };
  } catch (error: any) {
    const errorMsg = String(error?.message || error?.code || error || '');
    console.warn('Firebase Sign-in error, attempting GSI fallback:', errorMsg);

    // If Firebase Auth blocked by domain, try Google Identity Services client
    if (
      error?.code === 'auth/unauthorized-domain' ||
      errorMsg.includes('unauthorized-domain') ||
      errorMsg.includes('auth/unauthorized-domain')
    ) {
      try {
        const gsiResult = await signInWithGsi();
        return gsiResult;
      } catch (gsiErr) {
        console.warn('GSI fallback also failed/not available:', gsiErr);
        // Throw categorized error for App.tsx to activate Petugas Diklat RSUD mode seamlessly
        const domainErr: any = new Error('auth/unauthorized-domain');
        domainErr.code = 'auth/unauthorized-domain';
        throw domainErr;
      }
    }

    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};
