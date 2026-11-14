# Version 4 — navigation, command academy and study progress

- AIN top navigation buttons now call the corresponding page renderer.
- AIN Command Academy uses the same two-column list/detail layout as AIO.
- Main academy header has Google sign-in and course-link completion checkboxes.
- Completed links are saved locally for guests and synced to the signed-in Firebase account at users/{uid}/academy/progress.
- Firestore rules have an additional academy path; publish updated rules in Firebase Console.
- AIO simulator is retained from v3.
- The AIO Firebase config in this supplied ZIP is blank; copy your existing working firebase-config.js into aio/ before deployment.
- This build does not yet unify AIN and AIO simulator results into the academy homepage.
