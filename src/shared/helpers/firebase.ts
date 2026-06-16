import admin from "firebase-admin";
import { LoggerService } from "../logger";

let isFirebaseAdminInitialized = false;
let firebaseAdminApp: any = null;

export function initializeFirebaseAdmin(): any {
  if (isFirebaseAdminInitialized) return firebaseAdminApp;
  
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (projectId && privateKey && clientEmail) {
    try {
      firebaseAdminApp = admin.initializeApp({
        credential: (admin as any).credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      isFirebaseAdminInitialized = true;
      LoggerService.info("Firebase Admin SDK lazy-initialized for server operations.");
    } catch (e: any) {
      LoggerService.warn("Firebase Admin SDK initialization warning: " + e?.message);
    }
  } else {
    LoggerService.info("No Firebase server-side credentials detected. API operating under default auth validation mode.");
  }
  return firebaseAdminApp;
}
