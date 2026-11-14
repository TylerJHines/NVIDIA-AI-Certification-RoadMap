# Tyler's NVIDIA Certification Academy

Open `index.html` on a static web server (GitHub Pages recommended). The `aio/` folder contains your original v11 NCP-AIO project, including its existing Firebase configuration and Google sign-in. Do not move files out of `aio/` individually.

## Deployment
Upload the entire contents of this folder to the root of your GitHub Pages repository, preserving `aio/`. In GitHub Settings > Pages, deploy from the branch and root directory. On a new site, add the site hostname to Firebase Authentication > Authorized domains if you want AIO Google login.

## Important limitations
The homepage and three new practice banks are original educational simulations. NCP-AIN labs simulate three plausible skill families, not NVIDIA-confirmed exam lab tasks. The official NCP-AIN exam currently says 70–75 questions and a hands-on lab. Four 30-question practice sets are custom. The NCA-APC uploaded guide explicitly identifies its exam details as provisional. Individual NVIDIA networking course URLs were not reliably verifiable; the verified self-paced catalog is linked per course instead. New exam progress is saved locally; AIO Firebase login is preserved but new exam scores are not yet integrated into Firestore. No claim of official endorsement or exact exam question replication.
