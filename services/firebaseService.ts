/**
 * Firebase Integration for Cloud Sync
 * 
 * To use Firebase:
 * 1. npm install firebase
 * 2. Create a Firebase project at https://console.firebase.google.com
 * 3. Replace the config object below with your Firebase credentials
 * 4. Uncomment the imports in recipeService.ts and use this service
 */

// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, set, get, onValue } from 'firebase/database';
// import { Recipe } from '../types';

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
// };

// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// const DEVICE_ID = localStorage.getItem('grimoire_device_id') || 
//                   'device_' + Math.random().toString(36).substr(2, 9);

// export const firebaseService = {
//   async syncRecipesToCloud(recipes: Recipe[]): Promise<boolean> {
//     try {
//       const recipesRef = ref(database, `devices/${DEVICE_ID}/recipes`);
//       await set(recipesRef, recipes);
//       return true;
//     } catch (error) {
//       console.error('Failed to sync recipes to Firebase:', error);
//       return false;
//     }
//   },

//   async getRecipesFromCloud(): Promise<Recipe[]> {
//     try {
//       const recipesRef = ref(database, `recipes`); // Shared recipes
//       const snapshot = await get(recipesRef);
//       if (snapshot.exists()) {
//         return Object.values(snapshot.val() as Record<string, Recipe>);
//       }
//       return [];
//     } catch (error) {
//       console.error('Failed to fetch recipes from Firebase:', error);
//       return [];
//     }
//   },

//   setupRealtimeSync(onUpdate: (recipes: Recipe[]) => void): () => void {
//     const recipesRef = ref(database, 'recipes');
//     
//     const unsubscribe = onValue(recipesRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const recipes = Object.values(snapshot.val() as Record<string, Recipe>);
//         onUpdate(recipes);
//       }
//     });

//     return unsubscribe;
//   }
// };

/**
 * FIREBASE REALTIME DATABASE RULES:
 * 
 * {
 *   "rules": {
 *     "recipes": {
 *       ".read": true,
 *       ".write": true
 *     },
 *     "devices": {
 *       ".read": "auth.uid == $uid",
 *       ".write": "auth.uid == $uid"
 *     }
 *   }
 * }
 */

export const firebaseService = {
  setupCloudSync: () => {
    console.log('Firebase service is available but not initialized.');
    console.log('To enable cloud sync with Firebase:');
    console.log('1. Install firebase: npm install firebase');
    console.log('2. Set environment variables for Firebase config');
    console.log('3. Uncomment the code above');
    console.log('4. Update recipeService to use firebaseService');
  }
};
