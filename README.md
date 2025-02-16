# 100Devs Community Taught Social Overlay
A simple Chrome extension social overlay for the 100Devs progress tracker at communitytaught.org. The idea is to replicate a social encouragement feature a la Duolingo to support each other's progress.

Built for a weekend hackathon.

## How It's Made:

**Tech used:** Appwrite, vanilla JS

This is an unpackaged Chrome extension for running locally in developer mode. To load:

1. Open chrome://extensions in a Chrome window
2. Toggle "Developer mode" on
3. "Load unpacked" and select the project folder
4. Make sure the extension is toggled on

The extension uses a content script that run on any communitytaught.org url.

Writing to the DB: event listeners are added to the progress checkboxes that write new documents to the DB on checked
Reading from the DB: the content script appends a fixed overlay to the DOM, loads a document list from the DB and appends each item as an li in a ul

*Note: this was originally designed to show the activity in the extension popup, but I found that ultimately to be clunkier due to more difficulty communicating between content scripts running on the site, and popup scripts and the inability to keep the popup open as you navigate the site.

## Optimizations
This extension is currently unfinished and hacked together with a lot of room for improvement. Proposed improvements, in no particular order:

1. General css styling of overlay
2. Positioning of overlay, including functionality to move it between different corners
3. Refresh of activity list on regular intervals, instead of just page load
4. Personal activity feed showing individual likes of user's own updates, filtered by username
5. login/authentication functionality
6. db permissions to prevent miswriting/reading and limit abuse of api calls/document spam
