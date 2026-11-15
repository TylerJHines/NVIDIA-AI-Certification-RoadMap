# Version 12 — Free badge URL saving (no Firebase Storage)

Replace these four GitHub Pages files: `academy-cloud.js`, `academy.js`, `academy.css`, `index.html`. Leave `aio/`, `ain/`, and `aio/firebase-config.js` unchanged.

## Firestore rules
In Firebase Console → Firestore Database → Rules, retain your existing rules and ADD the certifications match below **inside** `match /databases/{database}/documents { ... }` if not already present. Do not replace all existing rules with only this snippet.

```
match /users/{userId}/certifications/{certCode} {
  allow read, write: if request.auth != null && request.auth.uid == userId
    && certCode in ['NCA-AIIO','NCP-AII','NCA-APC','NCP-ARI','NCP-AIN','NCP-AIO'];
}
```

Sign in on the homepage, open each certification, paste a public Credly or NVIDIA HTTPS badge URL, click Save badge. Reload to check persistence. The status is self-reported, not verified by NVIDIA. No Storage bucket or Blaze plan required.

Testing performed: static JS syntax and package checks. Live Firebase auth, writes, and cross-device persistence cannot be verified without your deployed Firebase environment.
