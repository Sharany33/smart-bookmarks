# Smart Bookmark App

This is a simple bookmark manager built using Next.js and Supabase.  
Users can log in using Google and manage their own private bookmarks with real-time updates.

I built this project as part of a technical assignment to understand authentication, data privacy, and real-time behavior in a full-stack app.

---

## Live Demo

- Live URL: https://smart-bookmarks-lyart.vercel.app  
- GitHub Repo: https://github.com/Sharany33/smart-bookmarks

---

## Tech Stack Used

- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Google OAuth
- Tailwind CSS (basic styling)
- Vercel (deployment)

---

## Features Implemented

- Sign up / login using Google (OAuth only)
- Add bookmarks with title and URL
- Each user can only see their own bookmarks
- Bookmark list updates in real time (no page refresh)
- Users can delete their own bookmarks
- Backend security enforced using Supabase RLS

---

## How Authentication Works (In Simple Terms)

1. User clicks **Login with Google**
2. Google verifies the user
3. Supabase validates the Google OAuth token
4. Supabase creates a session for the user
5. The app reads the session and shows the logged-in UI

Passwords are never handled or stored by the application.

---

## Data Privacy & Security (RLS)

Row Level Security (RLS) is enabled on the `bookmarks` table in Supabase.

This ensures:
- A user can only read their own bookmarks
- A user can only insert bookmarks linked to their user ID
- A user can only delete their own bookmarks

Even if someone tries to access the database directly, they cannot see another user’s data.

---

## Real-time Updates

Supabase Realtime is used to listen for changes in the `bookmarks` table.

Because of this:
- New bookmarks appear instantly
- Deleted bookmarks disappear immediately
- Opening the app in multiple tabs stays in sync

This works without manually refreshing the page.

---

## Problems I Faced & How I Solved Them

### 1. Google OAuth redirect going to localhost
After logging in with Google, the app was redirecting to `localhost` even when deployed.

**How I fixed it:**
- Updated redirect URLs in Supabase Auth settings
- Updated Google Cloud OAuth configuration
- Added correct production URLs in Vercel environment variables

---

### 2. Confusion around Supabase anon key
At first, I was confused why the `anon public` key is exposed in the frontend.

**What I learned:**
- The key itself is not the security layer
- Security is enforced using Row Level Security (RLS)
- Without valid RLS policies, the app would be insecure even if the key was hidden

---

### 3. Tailwind CSS styles not applying
UI changes were not reflecting even after adding Tailwind classes.

**How I fixed it:**
- Fixed the PostCSS configuration
- Ensured Tailwind was properly connected to the App Router setup

---

### 4. Logout not updating UI instantly
After logging out, the UI only updated after a refresh.

**How I fixed it:**
- Properly handled auth state changes so the UI updates immediately when the session changes

---

## Project Structure (Simplified)

smart-bookmarks/
├─ app/
│ ├─ components/
│ │ ├─ Auth.tsx
│ │ ├─ BookmarkForm.tsx
│ │ └─ BookmarkList.tsx
│ ├─ lib/
│ │ └─ supabaseClient.ts
│ ├─ global.css
│ ├─ layout.tsx
│ └─ page.tsx
├─ package.json
├─ tailwind.config.js
└─ postcss.config.js

---

## Deployment

The app is deployed on Vercel.  
Environment variables are configured for Supabase and Google OAuth.

OAuth redirect URLs support both local development and production.

---

## Final Notes

This project helped me clearly understand:
- OAuth based authentication
- Backend-level data security using RLS
- Real-time updates using database subscriptions
- How Next.js App Router components work together

The main focus was correctness, security, and clarity rather than complex UI.

---

## Author

Sharanya Bhat N
