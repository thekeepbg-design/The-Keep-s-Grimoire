import { Recipe } from '../types';

const CLOUD_SYNC_URL = 'https://grimoire-sync-api.vercel.app/api'; // Replace with your backend URL
const DEVICE_ID = 'device_' + Math.random().toString(36).substr(2, 9);

interface SyncResponse {
  success: boolean;
  data?: Recipe[];
  error?: string;
}

export const cloudSyncService = {
  // Initialize cloud sync - gets recipes from cloud and syncs locally
  async initializeSync(): Promise<Recipe[]> {
    try {
      const response = await fetch(`${CLOUD_SYNC_URL}/recipes?deviceId=${DEVICE_ID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data: SyncResponse = await response.json();
        if (data.success && data.data) {
          return data.data;
        }
      }
    } catch (error) {
      console.warn('Cloud sync initialization failed, using local storage:', error);
    }
    return [];
  },

  // Sync recipes to cloud
  async syncRecipes(recipes: Recipe[]): Promise<boolean> {
    try {
      const response = await fetch(`${CLOUD_SYNC_URL}/recipes/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId: DEVICE_ID,
          recipes,
          timestamp: Date.now(),
        }),
      });
      
      if (response.ok) {
        const data: SyncResponse = await response.json();
        if (data.success) {
          return true;
        }
      }
    } catch (error) {
      console.warn('Failed to sync recipes to cloud:', error);
    }
    return false;
  },

  // Set up real-time sync listener (using polling as fallback)
  setupSyncListener(callback: (recipes: Recipe[]) => void): () => void {
    let lastSyncTime = Date.now();
    
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `${CLOUD_SYNC_URL}/recipes/changes?deviceId=${DEVICE_ID}&since=${lastSyncTime}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (response.ok) {
          const data: SyncResponse = await response.json();
          if (data.success && data.data) {
            lastSyncTime = Date.now();
            callback(data.data);
          }
        }
      } catch (error) {
        console.warn('Error checking for sync updates:', error);
      }
    }, 5000); // Poll every 5 seconds

    // Return cleanup function
    return () => clearInterval(pollInterval);
  },

  getDeviceId(): string {
    return DEVICE_ID;
  }
};
