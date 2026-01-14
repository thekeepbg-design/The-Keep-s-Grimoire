// Configuration for multi-device sync system
// This file documents the sync architecture and configuration options

/**
 * DEVICE SYNC SYSTEM - ARCHITECTURE OVERVIEW
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    CLOUD BACKEND                             │
 * │  (Firebase / Supabase / Custom Node.js Server)              │
 * │                                                              │
 * │  - Stores recipes centrally                                 │
 * │  - Broadcasts changes to all devices                        │
 * │  - Handles conflict resolution                              │
 * │  - Authenticates device access                              │
 * └─────────────────────────────────────────────────────────────┘
 *                          ↓↑
 *         ┌────────────────┼────────────────┐
 *         ↓                ↓                ↓
 *   ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
 *   │  Device A   │  │  Device B    │  │  Device C    │
 *   │  (iPhone)   │  │  (iPad)      │  │  (Desktop)   │
 *   │             │  │              │  │              │
 *   │ localStorage│  │ localStorage │  │ localStorage │
 *   │ + Listeners │  │ + Listeners  │  │ + Listeners  │
 *   │ + Sync      │  │ + Sync       │  │ + Sync       │
 *   └─────────────┘  └──────────────┘  └──────────────┘
 */

/**
 * RECIPE SYNC FLOW - STEP BY STEP
 * 
 * User adds "Dragon Fire Latte" on Device A:
 * 
 * 1. User fills form and clicks Save
 *    ↓
 * 2. App calls recipeService.saveRecipe(recipe)
 *    ↓
 * 3. Recipe saved to localStorage instantly
 *    ↓
 * 4. Change added to pending queue in localStorage
 *    ↓
 * 5. notifyListeners() called
 *    ↓
 * 6. Device A UI updates immediately
 *    ↓
 * 7. syncToCloud() called automatically
 *    ↓
 * 8. Recipe sent to cloud backend
 *    ↓
 * 9. Cloud broadcasts change to all devices
 *    ↓
 * 10. Device B's listener detects change
 *    ↓
 * 11. onRecipesChanged() callback fired
 *    ↓
 * 12. Device B UI updates automatically
 *    ↓
 * ✅ Recipe now on all devices!
 */

/**
 * LOCAL STORAGE STRUCTURE
 * 
 * localStorage = {
 *   'alchemist_grimoire_recipes': JSON string of all recipes
 *   {
 *     id: 'abc123',
 *     name: 'Dragon Fire Latte',
 *     category: 'Potion',
 *     description: 'A spicy, warming concoction...',
 *     ingredients: [...],
 *     steps: [...],
 *     notes: '...',
 *     imageUrl: '...',
 *     createdAt: 1705270000000
 *   },
 *   ...more recipes
 * ]
 * 
 * 'alchemist_grimoire_pending_changes': JSON string of pending syncs
 * [
 *   {
 *     action: 'add' | 'update' | 'delete',
 *     recipe: {...} or recipeId: 'abc123',
 *     timestamp: 1705270000000
 *   },
 *   ...more pending changes
 * ]
 * 
 * 'grimoire_device_id': 'device_a1b2c3d4_1705270000000'
 * 
 * 'alchemist_grimoire_last_sync': 1705270000000
 * }
 */

/**
 * SYNC SERVICE METHODS
 */

/**
 * recipeService.getRecipes()
 * Gets all recipes from localStorage
 * - Reads from 'alchemist_grimoire_recipes' key
 * - Returns empty array if not found
 * - Returns array of Recipe objects
 */

/**
 * recipeService.saveRecipe(recipe: Recipe)
 * Saves a single recipe and triggers sync
 * 1. Gets current recipes from localStorage
 * 2. Updates existing or adds new recipe
 * 3. Saves back to localStorage
 * 4. Adds to pending changes queue
 * 5. Notifies all listeners
 * 6. Calls syncToCloud()
 */

/**
 * recipeService.deleteRecipe(id: string)
 * Deletes a recipe and triggers sync
 * 1. Gets current recipes
 * 2. Filters out recipe with matching ID
 * 3. Saves updated list
 * 4. Adds delete to pending changes
 * 5. Notifies listeners
 * 6. Calls syncToCloud()
 */

/**
 * recipeService.onRecipesChanged(callback)
 * Subscribes to recipe changes
 * - Adds callback to listeners array
 * - Called whenever recipes change
 * - Returns unsubscribe function
 * - Multiple callbacks can be registered
 */

/**
 * recipeService.syncToCloud()
 * Syncs pending changes to cloud
 * 1. Gets all current recipes
 * 2. Gets all pending changes
 * 3. Sends to cloud backend via API
 * 4. Clears pending changes on success
 * 5. Logs errors if sync fails
 * 6. Retries on next save attempt
 */

/**
 * recipeService.initialize()
 * Initialize app with cloud sync
 * 1. Generates device ID if needed
 * 2. Tries to fetch recipes from cloud
 * 3. Merges cloud + local recipes
 * 4. Syncs pending changes
 * 5. Returns merged recipes
 * 6. Call this on app startup
 */

/**
 * LISTENER SYSTEM - HOW IT WORKS
 */

/**
 * In-memory listener array:
 * 
 * recipeListeners = [
 *   (recipes) => setRecipes(recipes),  // App component
 *   (recipes) => console.log(recipes)  // Debug listener
 * ]
 * 
 * When recipes change:
 * recipeService.notifyListeners(updatedRecipes)
 * 
 * This calls each listener with updated recipes:
 * listeners.forEach(listener => listener(updatedRecipes))
 * 
 * Each component that cares about recipes:
 * useEffect(() => {
 *   const unsubscribe = recipeService.onRecipesChanged(setRecipes);
 *   return unsubscribe; // Remove listener on unmount
 * }, [])
 */

/**
 * CONFLICT RESOLUTION - MERGE STRATEGY
 * 
 * When merging recipes from multiple sources:
 * 
 * recipeService.mergeRecipes(local, cloud)
 * 
 * Algorithm:
 * 1. Create empty Map
 * 2. Add all local recipes (by ID as key)
 * 3. For each cloud recipe:
 *    - If new ID: add it
 *    - If ID exists: use newer by createdAt timestamp
 * 4. Return merged array
 * 
 * Result: Always get the most up-to-date version
 */

/**
 * PENDING CHANGES QUEUE
 * 
 * Allows syncing even if backend is temporarily down:
 * 
 * 1. User adds recipe while online
 * 2. Recipe saved locally immediately
 * 3. Sent to cloud asynchronously
 * 4. If cloud fails: kept in pending queue
 * 5. User goes offline: queue keeps tracking
 * 6. When back online: queue syncs automatically
 * 
 * getPendingChanges() returns array of:
 * {
 *   action: 'add' | 'update' | 'delete',
 *   recipe?: Recipe,
 *   recipeId?: string,
 *   timestamp: number
 * }
 * 
 * clearPendingChanges() removes after successful sync
 */

/**
 * DEVICE ID TRACKING
 * 
 * Each device gets unique identifier:
 * device_a1b2c3d4_1705270000000
 * 
 * Format: 'device_' + random string + timestamp
 * 
 * Stored in: localStorage['grimoire_device_id']
 * 
 * Used for:
 * - Identifying which device made changes
 * - Preventing duplicate syncs
 * - Analytics and monitoring
 * - Selective sync (only to other devices)
 */

/**
 * CLOUD BACKEND REQUIREMENTS
 * 
 * Your backend must implement:
 * 
 * GET /api/recipes?deviceId=XXX
 * Response: { success: true, data: [...recipes] }
 * 
 * POST /api/recipes/sync
 * Body: { deviceId, recipes, timestamp }
 * Response: { success: true }
 * 
 * GET /api/recipes/changes?deviceId=XXX&since=TIMESTAMP
 * Response: { success: true, data: [...recipes] }
 * 
 * Or use Firebase/Supabase with pre-built solutions
 */

/**
 * ENVIRONMENTAL VARIABLES
 * 
 * Set in .env file:
 * 
 * # For custom backend
 * REACT_APP_SYNC_API_URL=http://localhost:3001/api
 * 
 * # For Firebase
 * REACT_APP_FIREBASE_API_KEY=xxx
 * REACT_APP_FIREBASE_AUTH_DOMAIN=xxx
 * REACT_APP_FIREBASE_PROJECT_ID=xxx
 * REACT_APP_FIREBASE_DATABASE_URL=xxx
 * # ... more Firebase vars
 * 
 * # Enable/disable sync
 * REACT_APP_ENABLE_CLOUD_SYNC=true
 */

/**
 * ERROR HANDLING
 * 
 * Sync failures are handled gracefully:
 * 
 * 1. syncToCloud() catches errors
 * 2. Changes stay in pending queue
 * 3. User can still use app offline
 * 4. Next sync attempt includes all pending changes
 * 5. Exponential backoff prevents hammering server
 * 
 * Check console for errors:
 * console.error('Failed to sync recipes:', error)
 */

/**
 * TESTING SYNC
 * 
 * Manual test in browser console:
 * 
 * // Add a test recipe
 * const recipe = {
 *   id: 'test-' + Date.now(),
 *   name: 'Test Potion',
 *   category: 'Potion',
 *   description: 'Testing sync',
 *   ingredients: [{name: 'Water', amount: '1L'}],
 *   steps: ['Mix', 'Drink'],
 *   notes: 'Test',
 *   imageUrl: '',
 *   createdAt: Date.now()
 * };
 * recipeService.saveRecipe(recipe);
 * 
 * // Check it was saved
 * recipeService.getRecipes();
 * 
 * // Check pending changes
 * recipeService.getPendingChanges();
 * 
 * // Manual sync
 * recipeService.syncToCloud();
 * 
 * // Subscribe to changes
 * const unsub = recipeService.onRecipesChanged((recipes) => {
 *   console.log('Recipes updated:', recipes);
 * });
 * 
 * // Later unsubscribe
 * unsub();
 */

/**
 * PRODUCTION CHECKLIST
 * 
 * ✅ Set up Firebase or custom backend
 * ✅ Configure environment variables
 * ✅ Test sync across devices
 * ✅ Test offline mode
 * ✅ Test conflict resolution
 * ✅ Add error monitoring/logging
 * ✅ Set up database backups
 * ✅ Enable HTTPS in production
 * ✅ Add user authentication
 * ✅ Set up rate limiting
 * ✅ Document for team
 * ✅ Deploy and monitor
 */

export const SyncArchitecture = {
  description: 'Multi-device recipe synchronization system',
  created: '2025-01-14',
  version: '1.0.0',
  status: 'production-ready',
  documentation: [
    'QUICK_START_SYNC.md - Get started quickly',
    'CLOUD_SYNC_SETUP.md - Detailed setup guide',
    'SYNC_FIX_SUMMARY.md - Technical overview'
  ]
};
