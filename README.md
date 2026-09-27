# My Dating App — Setup Guide

## 1. Install dependencies
Open this folder in VS Code, open a terminal, and run:
```
npm install
```

## 2. Connect Firebase
1. In your Firebase project, go to **Project settings** (gear icon) → scroll to "Your apps" → click the **</>** web icon → register the app.
2. Copy the `firebaseConfig` values it shows you into `src/firebase.js`, replacing the placeholders.

## 3. Run it locally
```
npm run dev
```
Open the localhost link it prints. Create two test accounts (e.g. in a normal window + an incognito window) so you can like each other and test matching/chat.

## 4. Lock down Firestore (IMPORTANT before sharing with real people)
Your database currently starts in "test mode," which means anyone can read/write anything. Before you share this app, go to **Firestore Database → Rules** and replace the default with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /profiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /likes/{likeId} {
      allow read, write: if request.auth != null;
    }
    match /matches/{matchId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.users;
      allow create: if request.auth != null;
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```
Click **Publish**.

## 5. Deploy for free
1. Push this folder to a new GitHub repo.
2. Go to vercel.com → "Add New Project" → import that repo → deploy.
3. You'll get a free live URL (e.g. `my-dating-app.vercel.app`) to share.

## What's built
- Sign up / log in (email + password)
- Profile creation with photo upload, name, age, bio
- Swipe/browse other profiles → like or pass
- Mutual likes automatically create a match
- Real-time chat within each match

## Not built yet (add later if you want)
- Block / report button (recommend adding before wider sharing)
- Location-based filtering
- Forgot-password flow
- Photo moderation
