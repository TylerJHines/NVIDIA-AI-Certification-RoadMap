# Version 11: Certificate and badge uploads

Upload the whole archive to your GitHub Pages repository, preserving folders. Existing AIO and AIN simulators are unchanged. The Firebase web config is included in this package; verify it matches your own project.

**Required Firebase Console steps:**
1. Firebase Console → Build → Storage → Get started (if not already enabled). Select the appropriate bucket/location. Some projects require upgrading to the Blaze billing plan to use Cloud Storage; review pricing before enabling.
2. Storage → Rules: replace with `storage.rules` and Publish. These rules allow only the signed-in owner to read/write/delete a single evidence object for each certification; max 5MB, PDF/JPEG/PNG.
3. Firestore Database → Rules: merge the `certifications` match block from `firestore.rules` into your current live rules, retaining all existing rules for AIO, AIN, exams and labs. Publish.
4. Commit updated `academy.js`, `academy-cloud.js`, `academy.css`, `index.html`. Do not upload the rules files as a substitute for publishing them in Firebase Console.
5. Hard refresh your site. Sign in, choose a cert, upload a PDF/JPG/PNG, verify green status, refresh, view the file, then remove it. Test from another device signed into the same Google account.

**Security/behavior:** Certificates are self-reported and not NVIDIA-verified. They are private by Firebase rules, but Firebase Storage download URLs contain access tokens and should not be publicly shared. Removing a certificate deletes the Storage object and Firestore metadata. If metadata write fails after upload, the file may exist without a visible certified status; retry upload. Do not use the same Firebase Storage bucket for unrelated content unless the new rules are merged with existing Storage rules.

**Tests:** Local JavaScript syntax, HTML structure, rule consistency, ZIP integrity and offline simulated UI tests can be run. Actual Google popup, Firebase Storage uploads and Firestore permissions require testing in the deployed project.
