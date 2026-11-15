# Academy Google sign-in setup (V7)

1. Firebase Console > Project settings > General > Your apps > Web app > SDK setup and configuration. Copy the PUBLIC web config values into `aio/firebase-config.js` (apiKey, authDomain, projectId, appId, messagingSenderId). Do not use a service account key.
2. Authentication > Sign-in method > Google > Enable; select a support email; Save.
3. Authentication > Settings > Authorized domains > Add your exact GitHub Pages hostname (for example `tylerjhines.github.io`), without `https://` or `/repository`.
4. Firestore Database > Create database (if not already created). Then Rules > paste contents of root `firestore.rules` > Publish. This includes per-user access for the academy, AIN, and AIO.
5. Upload the changed files to the GitHub Pages repository `main` branch, preserving the folder structure. In particular, root `academy.js`, `firestore.rules` (for your reference), `aio/firebase-config.js`, `ain/index.html`, `ain/app.js`, and `ain/cloud.js`.
6. Wait for GitHub Pages deployment, hard refresh the homepage, sign in with Google. Open NCP-AIN and NCP-AIO from the certification pages. Both open in NEW tabs and use the same Firebase project and authentication session (subject to browser privacy settings).
7. Test in normal browser tabs: sign in on home; check a course; complete an AIN lab; complete an AIO lab; refresh and verify; sign out on home; sign back in; verify restored progress. Firestore Console should show `users/{uid}/academy/progress`, `users/{uid}/ain/progress`, and AIO records under `users/{uid}/profile/progress`, `users/{uid}/labs`, and `users/{uid}/exams`.

Note: AIN cloud save currently stores guided-lab completions and the current mock state; AIO uses its existing history model. Opening a new tab is not itself a new Google login. Some browsers and standalone PWAs may restrict auth persistence. Existing guest AIN progress is imported on first sign-in if no remote record exists. Cloud records are authoritative on later sign-ins.
