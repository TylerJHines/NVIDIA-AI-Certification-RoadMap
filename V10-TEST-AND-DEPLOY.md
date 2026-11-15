# V10 verified changes
- Shared exported Firebase config in aio/firebase-config.js
- Default Firebase app name in academy-cloud.js and ain/cloud.js, matching aio/cloud.js
- Local persistence in AIN and signed-in Google display name
- Cache-busted module script references

Upload files to GitHub Pages preserving directory structure. Do not put private service account credentials into web files.

Tests: JS syntax, ZIP integrity, and local browser smoke tests. Live Firebase Google OAuth and Firestore require deployment and cannot be verified offline.
