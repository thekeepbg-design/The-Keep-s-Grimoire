# 🔄 Multi-Device Recipe Synchronization Guide

## Overview

The Keep's Grimoire now supports real-time synchronization of recipes across multiple devices. Recipes added on one device will automatically appear on other devices.

## How It Works

### Local-First Architecture with Cloud Sync

1. **Local Storage**: All recipes are stored locally in browser's localStorage
2. **Pending Changes Tracking**: New/modified recipes are tracked for sync
3. **Cloud Sync**: Changes are automatically synced to the cloud backend
4. **Real-time Updates**: New devices receive updates via listeners

### Device Synchronization Flow

```
Device A (Add Recipe)
    ↓
localStorage + pending changes
    ↓
Cloud Backend (Sync)
    ↓
Device B (Listener Update)
    ↓
localStorage updated automatically
```

## Features

✅ **Automatic Sync**: Changes sync automatically to cloud  
✅ **Offline Support**: Works offline, syncs when connection restored  
✅ **Device ID**: Each device gets unique ID for tracking  
✅ **Real-time Listeners**: Components notified of changes immediately  
✅ **Conflict Resolution**: Latest timestamp wins when merging recipes  
✅ **Pending Changes Queue**: Failed syncs are retried  

## Setup Instructions

### Option 1: Firebase (Recommended) ⭐

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Realtime Database
4. Set database location to your region

#### Step 2: Install Firebase
```bash
npm install firebase
```

#### Step 3: Set Environment Variables
Create `.env` file in project root:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

#### Step 4: Enable Firebase Service
1. Open `services/firebaseService.ts`
2. Uncomment all the code
3. Update `services/recipeService.ts` to import and use `firebaseService`

#### Step 5: Configure Database Rules
In Firebase Console, set Realtime Database rules to:
```json
{
  "rules": {
    "recipes": {
      ".read": true,
      ".write": true
    }
  }
}
```

### Option 2: Custom Node.js Backend

#### Step 1: Create Backend Server
```bash
mkdir grimoire-backend
cd grimoire-backend
npm init -y
npm install express cors body-parser
```

#### Step 2: Create Express Server
```javascript
// server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage (use database in production)
let recipes = {};
let deviceRecipes = {};

// Get recipes
app.get('/api/recipes', (req, res) => {
  const deviceId = req.query.deviceId;
  res.json({
    success: true,
    data: deviceRecipes[deviceId] || []
  });
});

// Sync recipes
app.post('/api/recipes/sync', (req, res) => {
  const { deviceId, recipes: newRecipes } = req.body;
  deviceRecipes[deviceId] = newRecipes;
  
  // Broadcast to all devices
  Object.keys(deviceRecipes).forEach(id => {
    if (id !== deviceId) {
      deviceRecipes[id] = newRecipes;
    }
  });
  
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log('Grimoire sync server running on port 3001');
});
```

#### Step 3: Set Environment Variable
```env
REACT_APP_SYNC_API_URL=http://localhost:3001/api
```

### Option 3: Supabase (PostgreSQL + Real-time)

#### Step 1: Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Set up authentication

#### Step 2: Create Table
```sql
CREATE TABLE recipes (
  id text PRIMARY KEY,
  device_id text,
  name text,
  category text,
  description text,
  ingredients jsonb,
  steps jsonb,
  notes text,
  image_url text,
  created_at bigint,
  updated_at bigint DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_device_id ON recipes(device_id);
```

#### Step 3: Configure Supabase Client
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);
```

## Testing Sync

### Test Multiple Devices
1. Open the app in two different browsers or devices
2. Add a recipe in one browser
3. Refresh or visit the other browser
4. New recipe should appear automatically

### Test Offline Mode
1. Add a recipe
2. Disconnect internet
3. Add another recipe (stays in local storage)
4. Reconnect internet
5. Both recipes sync to cloud

### Check Sync Status
Open browser console and check:
```javascript
localStorage.getItem('alchemist_grimoire_recipes')
localStorage.getItem('alchemist_grimoire_pending_changes')
localStorage.getItem('grimoire_device_id')
```

## Troubleshooting

### Recipes Not Syncing

**Check 1**: Verify backend is running
```bash
curl http://localhost:3001/api/recipes
```

**Check 2**: Check browser console for errors
```javascript
// In browser console:
localStorage.getItem('grimoire_device_id')
```

**Check 3**: Verify environment variables are set
```javascript
console.log(process.env.REACT_APP_SYNC_API_URL)
```

### Duplicate Recipes

This can happen with poor conflict resolution. The service automatically deduplicates by ID and prefers newer timestamps.

To manually clean:
```javascript
// In browser console:
localStorage.removeItem('alchemist_grimoire_recipes');
localStorage.removeItem('alchemist_grimoire_pending_changes');
// Then refresh the page
```

## Architecture Details

### recipeService.ts

Main service handling:
- `getRecipes()` - Get all recipes
- `saveRecipe()` - Save and sync recipe
- `deleteRecipe()` - Delete and sync recipe
- `onRecipesChanged()` - Subscribe to changes
- `syncToCloud()` - Manual sync trigger
- `initialize()` - Initialize with cloud sync

### cloudSyncService.ts

Low-level sync operations:
- `initializeSync()` - Get recipes from cloud
- `syncRecipes()` - Send recipes to cloud
- `setupSyncListener()` - Set up polling listener

### Storage Keys

- `alchemist_grimoire_recipes` - All recipes (JSON)
- `alchemist_grimoire_pending_changes` - Pending sync (JSON)
- `alchemist_grimoire_last_sync` - Last sync timestamp
- `grimoire_device_id` - Unique device identifier

## Production Recommendations

1. ✅ Use Firebase or Supabase for reliability
2. ✅ Add user authentication before syncing
3. ✅ Implement rate limiting on backend
4. ✅ Add data validation and sanitization
5. ✅ Set up monitoring and error logging
6. ✅ Use HTTPS in production
7. ✅ Regular database backups
8. ✅ Add data encryption for sensitive recipes

## API Reference

### recipeService

```typescript
// Get all recipes
const recipes = recipeService.getRecipes(): Recipe[]

// Save a recipe
recipeService.saveRecipe(recipe: Recipe): void

// Delete a recipe
recipeService.deleteRecipe(id: string): void

// Listen to changes
const unsubscribe = recipeService.onRecipesChanged((recipes) => {})

// Manual sync
await recipeService.syncToCloud(): Promise<boolean>

// Get device ID
const deviceId = recipeService.getDeviceId(): string
```

## Examples

### Example 1: Auto-sync on Save
```typescript
const handleSaveRecipe = (recipe: Recipe) => {
  recipeService.saveRecipe(recipe); // Automatically syncs
  // Component updates via listener
};
```

### Example 2: Monitor Sync Status
```typescript
useEffect(() => {
  const unsubscribe = recipeService.onRecipesChanged((updated) => {
    console.log('Recipes updated from cloud:', updated);
  });
  return unsubscribe;
}, []);
```

### Example 3: Manual Sync
```typescript
const handleManualSync = async () => {
  const success = await recipeService.syncToCloud();
  if (success) {
    console.log('Synced successfully');
  }
};
```

## Support & Issues

If syncing isn't working:
1. Check backend is running
2. Verify environment variables
3. Check browser console for errors
4. Check network tab in DevTools
5. Try clearing localStorage and refreshing

---

**Happy Grimoire syncing! 🧙‍♂️✨**
