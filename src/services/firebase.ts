/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser,
  onAuthStateChanged
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

const metaEnv = (import.meta as any).env || {};

// Dynamic configuration resolution with client-side environment variable fallbacks
const resolvedConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
  appId: metaEnv.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
};

const isMockConfig = 
  !resolvedConfig.apiKey || 
  resolvedConfig.apiKey.includes("placeholder") || 
  resolvedConfig.apiKey === "MY_FIREBASE_API_KEY";

let app;
let realAuth: any = null;

if (!isMockConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(resolvedConfig) : getApp();
    realAuth = getAuth(app);
    console.info("[FirebaseClient] Real Firebase Auth successfully initialized. Ready for Google/GitHub OAuth handshakes.");
  } catch (error) {
    console.error("[FirebaseClient] Initialization error:", error);
  }
} else {
  console.info("[FirebaseClient] Running under Simulation Mode: Placed in high-fidelity placeholder state. Authentication buttons will load mock profiles.");
}

// Ensure clean subscription types
export type AuthStateChangeCallback = (user: {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  idToken: string | null;
} | null) => void;

class SimulatedAuthManager {
  private listener: AuthStateChangeCallback | null = null;
  private currentUserObj: any = null;

  constructor() {
    // Attempt local storage hydration
    try {
      const savedUser = localStorage.getItem("skillcollab_sim_user");
      if (savedUser) {
        this.currentUserObj = JSON.parse(savedUser);
      }
    } catch (e) {
      console.warn("localStorage recovery blocked", e);
    }
  }

  onAuthStateChanged(callback: AuthStateChangeCallback) {
    this.listener = callback;
    // Set immediate callback with delay for async feel
    setTimeout(() => {
      callback(this.currentUserObj);
    }, 100);
    return () => {
      this.listener = null;
    };
  }

  async signInWithGoogle() {
    const mockUser = {
      uid: "google_oauth_98213",
      email: "ashishghadigaonkar85@gmail.com",
      displayName: "Ashish Ghadigaonkar",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      idToken: "simulated_google_oauth_jwt_key_abc_123"
    };
    this.currentUserObj = mockUser;
    localStorage.setItem("skillcollab_sim_user", JSON.stringify(mockUser));
    if (this.listener) this.listener(mockUser);
    return mockUser;
  }

  async signInWithGithub() {
    const mockUser = {
      uid: "github_oauth_77612",
      email: "ashish_github@college.edu",
      displayName: "Ashish GithubCoder",
      photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      idToken: "simulated_github_oauth_jwt_key_xyz_789"
    };
    this.currentUserObj = mockUser;
    localStorage.setItem("skillcollab_sim_user", JSON.stringify(mockUser));
    if (this.listener) this.listener(mockUser);
    return mockUser;
  }

  async signOut() {
    this.currentUserObj = null;
    localStorage.removeItem("skillcollab_sim_user");
    if (this.listener) this.listener(null);
  }
}

const localSimAuth = new SimulatedAuthManager();

// Abstract wrapper service exported to clients
export const FirebaseAuthService = {
  isSimulation: isMockConfig,

  onAuthStateChangedListener(callback: AuthStateChangeCallback) {
    if (!isMockConfig && realAuth) {
      return onAuthStateChanged(realAuth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();
          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "Ecosystem Student",
            photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(firebaseUser.displayName || "Ecosystem")}`,
            idToken
          });
        } else {
          callback(null);
        }
      });
    } else {
      return localSimAuth.onAuthStateChanged(callback);
    }
  },

  async signInWithGoogle() {
    if (!isMockConfig && realAuth) {
      const provider = new GoogleAuthProvider();
      // Configure secure prompt parameters
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(realAuth, provider);
      const idToken = await result.user.getIdToken();
      return {
        uid: result.user.uid,
        email: result.user.email || "",
        displayName: result.user.displayName || "Ecosystem Scholar",
        photoURL: result.user.photoURL || "",
        idToken
      };
    } else {
      return await localSimAuth.signInWithGoogle();
    }
  },

  async signInWithGithub() {
    if (!isMockConfig && realAuth) {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(realAuth, provider);
      const idToken = await result.user.getIdToken();
      return {
        uid: result.user.uid,
        email: result.user.email || "",
        displayName: result.user.displayName || "Github Coder",
        photoURL: result.user.photoURL || "",
        idToken
      };
    } else {
      return await localSimAuth.signInWithGithub();
    }
  },

  async logout() {
    if (!isMockConfig && realAuth) {
      await signOut(realAuth);
    } else {
      await localSimAuth.signOut();
    }
  }
};
