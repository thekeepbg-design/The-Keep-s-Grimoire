
import { Recipe } from '../types';
import { INITIAL_RECIPES } from '../constants';

const STORAGE_KEY = 'alchemist_grimoire_recipes';
const SYNC_TIMESTAMP_KEY = 'alchemist_grimoire_last_sync';
const PENDING_CHANGES_KEY = 'alchemist_grimoire_pending_changes';

// In-memory listeners for real-time updates
let recipeListeners: ((recipes: Recipe[]) => void)[] = [];

interface PendingChange {
  action: 'add' | 'update' | 'delete';
  recipe?: Recipe;
  recipeId?: string;
  timestamp: number;
}

export const recipeService = {
  // Get all recipes with hybrid cloud/local storage
  getRecipes: (): Recipe[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECIPES));
      return INITIAL_RECIPES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_RECIPES;
    }
  },

  // Save recipe locally and mark for cloud sync
  saveRecipe: (recipe: Recipe): void => {
    const recipes = recipeService.getRecipes();
    const index = recipes.findIndex(r => r.id === recipe.id);
    
    if (index > -1) {
      recipes[index] = recipe;
    } else {
      recipes.push(recipe);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    
    // Track pending changes
    recipeService.addPendingChange({
      action: index > -1 ? 'update' : 'add',
      recipe,
      timestamp: Date.now()
    });

    // Notify all listeners
    recipeService.notifyListeners(recipes);
    
    // Attempt cloud sync
    recipeService.syncToCloud();
  },

  // Delete recipe locally and mark for cloud sync
  deleteRecipe: (id: string): void => {
    const recipes = recipeService.getRecipes();
    const filtered = recipes.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    // Track pending changes
    recipeService.addPendingChange({
      action: 'delete',
      recipeId: id,
      timestamp: Date.now()
    });

    // Notify all listeners
    recipeService.notifyListeners(filtered);
    
    // Attempt cloud sync
    recipeService.syncToCloud();
  },

  // Add listener for recipe changes (for real-time updates across components)
  onRecipesChanged: (callback: (recipes: Recipe[]) => void): (() => void) => {
    recipeListeners.push(callback);
    // Return unsubscribe function
    return () => {
      recipeListeners = recipeListeners.filter(listener => listener !== callback);
    };
  },

  // Notify all listeners of changes
  notifyListeners: (recipes: Recipe[]): void => {
    recipeListeners.forEach(listener => {
      try {
        listener(recipes);
      } catch (error) {
        console.error('Error notifying listener:', error);
      }
    });
  },

  // Track pending changes for sync
  addPendingChange: (change: PendingChange): void => {
    const pending = recipeService.getPendingChanges();
    pending.push(change);
    localStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(pending));
  },

  // Get all pending changes
  getPendingChanges: (): PendingChange[] => {
    const data = localStorage.getItem(PENDING_CHANGES_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  // Clear pending changes after successful sync
  clearPendingChanges: (): void => {
    localStorage.removeItem(PENDING_CHANGES_KEY);
  },

  // Sync recipes to cloud
  syncToCloud: (): Promise<boolean> => {
    return (async () => {
      try {
        const recipes = recipeService.getRecipes();
        const pendingChanges = recipeService.getPendingChanges();
        
        // For now, simulate cloud sync - replace with actual backend
        const syncData = {
          recipes,
          pendingChanges,
          deviceId: localStorage.getItem('grimoire_device_id') || recipeService.generateDeviceId(),
          timestamp: Date.now()
        };

        // Store sync timestamp
        localStorage.setItem(SYNC_TIMESTAMP_KEY, JSON.stringify(Date.now()));
        
        // Clear pending changes on successful "sync"
        recipeService.clearPendingChanges();
        
        // Log for debugging
        console.log('Recipes synced to cloud:', syncData);
        return true;
      } catch (error) {
        console.error('Failed to sync recipes:', error);
        return false;
      }
    })();
  },

  // Sync recipes from cloud
  syncFromCloud: (): Promise<Recipe[]> => {
    return (async () => {
      try {
        // For now, this returns local recipes
        // In production, fetch from backend and merge
        return recipeService.getRecipes();
      } catch (error) {
        console.error('Failed to sync from cloud:', error);
        return recipeService.getRecipes();
      }
    })();
  },

  // Generate unique device ID
  generateDeviceId: (): string => {
    const deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('grimoire_device_id', deviceId);
    return deviceId;
  },

  // Get device ID
  getDeviceId: (): string => {
    const stored = localStorage.getItem('grimoire_device_id');
    if (stored) return stored;
    return recipeService.generateDeviceId();
  },

  // Initialize recipe service with sync
  initialize: (): Promise<Recipe[]> => {
    return (async () => {
      // Generate device ID if not exists
      recipeService.getDeviceId();
      
      // Try to sync from cloud
      const cloudRecipes = await recipeService.syncFromCloud();
      
      // Merge with local recipes
      const localRecipes = recipeService.getRecipes();
      const merged = recipeService.mergeRecipes(localRecipes, cloudRecipes);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      
      // Sync pending changes
      await recipeService.syncToCloud();
      
      return merged;
    })();
  },

  // Merge recipes from multiple sources (local + cloud)
  mergeRecipes: (local: Recipe[], cloud: Recipe[]): Recipe[] => {
    const map = new Map<string, Recipe>();
    
    // Add local recipes
    local.forEach(recipe => {
      map.set(recipe.id, recipe);
    });
    
    // Add cloud recipes, preferring newer versions
    cloud.forEach(recipe => {
      const existing = map.get(recipe.id);
      if (!existing || recipe.createdAt > existing.createdAt) {
        map.set(recipe.id, recipe);
      }
    });
    
    return Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
  }
};
