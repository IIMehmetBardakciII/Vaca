import admin from "firebase-admin";

export const initAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
        privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
      }),
      storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET as string,
    });
  }
};
