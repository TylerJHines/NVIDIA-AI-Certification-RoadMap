# Academy v3 - changes and verification

## Structure
- `index.html`: six-cert academy homepage
- `ain/index.html`: dedicated NCP-AIN simulator (12 labs, command academy, four 30-question + three-lab mock exam variants)
- `aio/index.html`: original NCP-AIO simulator with four launchable randomized mock variants, retained Firebase configuration
- `academy.js` and `data.js`: academy course resources and NCA-APC / NCP-ARI mock exams

## Fixes
- NCA-AIIO and NCP-AII show courses and readings, without internal mock exams.
- NCP-AIN has a side-by-side guided terminal, simulated diagnostic output and stateful Cumulus NVUE changes, with realistic command families for InfiniBand and Spectrum-X/RoCE.
- NCP-AIO terminal now refocuses the command input after every command, including guided and mock labs.
- NCP-AIN terminal also refocuses after every command.
- AIO mock exams have four numbered entry points, each randomized. These are not four separate curated banks.

## Verification
- JavaScript syntax checked for academy, AIO, AIN, bank and lab files.
- Node-based scenario checks confirmed 12 AIN labs / 60 expected commands are recognized.
- Browser-level functional testing was attempted but browser navigation was blocked by the execution environment. Google sign-in, GitHub Pages hosting, and mobile behavior are not end-to-end verified.
- Synthetic outputs are illustrative, not live network emulation. NVIDIA CLI behavior can vary by release and configuration.

## Deploy
Extract the ZIP. Upload its **contents** (including `ain/` and `aio/` folders) into the same GitHub repository branch. Do not upload the ZIP as the site itself. Confirm existing Firebase authorized domains and avoid overwriting your original repository before backing it up.
