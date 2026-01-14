/**
 * Cloud Sync Configuration and Backend Integration
 * 
 * This file provides the configuration for syncing recipes across devices.
 * You can implement this with:
 * 1. Firebase Realtime Database (recommended for real-time sync)
 * 2. Supabase (PostgreSQL + Real-time)
 * 3. Custom Node.js/Express backend
 * 4. AWS AppSync
 */

export interface SyncConfig {
  // Backend API endpoint for syncing
  apiUrl: string;
  
  // Enable real-time sync (requires WebSocket support)
  enableRealTimeSync: boolean;
  
  // Sync interval in milliseconds (5000 = 5 seconds)
  syncIntervalMs: number;
  
  // Enable offline mode (sync when back online)
  enableOfflineMode: boolean;
}

// Default configuration - update with your backend
export const defaultSyncConfig: SyncConfig = {
  apiUrl: process.env.REACT_APP_SYNC_API_URL || 'http://localhost:3001/api',
  enableRealTimeSync: true,
  syncIntervalMs: 5000,
  enableOfflineMode: true
};

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Firebase Setup (Recommended):
 *    - Install: npm install firebase
 *    - Create firebase.ts in services/
 *    - Initialize Firebase with your credentials
 *    - Use Realtime Database or Firestore
 * 
 * 2. Custom Backend Setup:
 *    - Create Node.js/Express server
 *    - Endpoints needed:
 *      - GET  /api/recipes - Get all recipes for device
 *      - POST /api/recipes/sync - Sync recipes
 *      - GET  /api/recipes/changes?since=timestamp - Get changes
 *      - DELETE /api/recipes/:id - Delete recipe
 * 
 * 3. Environment Variables:
 *    - REACT_APP_SYNC_API_URL: Your backend URL
 *    - REACT_APP_ENABLE_CLOUD_SYNC: true/false
 */

export const setupCloudSync = () => {
  // Placeholder for cloud sync initialization
  // This will be called when the app starts
  
  console.log('Cloud Sync Configuration:');
  console.log('API URL:', defaultSyncConfig.apiUrl);
  console.log('Real-time Sync:', defaultSyncConfig.enableRealTimeSync);
  console.log('Offline Mode:', defaultSyncConfig.enableOfflineMode);
};
