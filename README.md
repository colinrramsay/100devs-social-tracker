# 100Devs Community Taught Social Overlay
A simple Chrome extension social overlay for the 100Devs progress tracker at communitytaught.org. The idea is to replicate a social encouragement feature a la Duolingo to support each other's progress.

Built for a weekend hackathon.

Developed by Colin Ramsay & Felice Forgione
https://github.com/colinrramsay
https://github.com/feliceforgione

## How It's Made:

**Tech used:** Appwrite, vanilla JS, Tailwind, Vite with CRX and ViteStaticCopy plugins, Chrome APIs

This is an unpackaged Chrome extension for running locally in developer mode. To use:

1. Open chrome://extensions in a Chrome window
2. Toggle "Developer mode" on
3. "Load unpacked" and select the "dist" folder from the repo
4. Make sure the extension is toggled on
5. Pin extension to browser menu

To build:

1. npm install //install dependencies
2. add .env file with your own appwrite DB IDs // VITE_PROJECT_ID, VITE_DATABASE_ID, VITE_COLLECTION_ID
3. npm run build //build production files into the 'dist' folder

## Features:
-Set/change username from extension popup

-Collapsible activity overlay showing latest 10 updates from feed

-"Like" activity by clicking the heart next to any item

-Marking any homework item complete or any class "watched" adds an entry to the activity feed

-Activity feed refreshes from the db on page load and every minute

https://github.com/user-attachments/assets/f8f2b726-8d10-4760-b5a6-d64fc0b32077

## Optimizations
This extension is currently unfinished and hacked together with a lot of room for improvement. Proposed improvements, in no particular order:

1. Personal activity feed showing individual likes of user's own updates, filtered by username
2. login/authentication functionality
