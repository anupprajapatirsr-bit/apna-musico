# APNA MUSICO — Netlify build

An Android-friendly, installable web music player with a clean original interface. This package is a static site plus a Netlify Function; it does not need a framework build command.

## Deploy on Netlify

1. Extract this ZIP and put the **contents of `apna-musico`** in a GitHub repository (so `index.html`, `netlify.toml`, and `netlify/functions/` are at the repository root).
2. In Netlify, choose **Add new site → Import an existing project** and connect the repository. Build command: leave blank. Publish directory: `.`. The `netlify.toml` file configures the function automatically.
3. Create your own Jamendo developer application at https://devportal.jamendo.com/ and copy its client ID.
4. In Netlify **Site configuration → Environment variables**, add `JAMENDO_CLIENT_ID` with that value, then redeploy. Never put your client ID in `app.js` or publish it in the repository.
5. Open the HTTPS site in Android Chrome and choose **Install app** / **Add to Home screen** from the browser menu when available.

## What is included

- Responsive, original interface for Android and desktop
- Midnight, Violet and Cloud themes with accent colours
- Jamendo catalogue search through a Netlify Function; the function returns only tracks with HTTPS audio and HTTPS licence URLs
- Apple/iTunes song search as a fallback; Apple results are preview clips, not full songs
- In-app audio playback, seek, volume, previous/next, shuffle and repeat
- Queue state for the currently selected search results, saved tracks and recent plays
- Local audio-file playback; selected files are not uploaded to a server
- Browser Media Session controls where supported, sleep timer and three-band Web Audio equalizer where supported
- Library backup file and backup-code restore
- PWA manifest and app-shell caching; provider API and audio are not cached by the service worker

## Music and licensing limits

- Jamendo offers independent music, not a guarantee of every commercial song worldwide. A registered API client ID is required for the Jamendo search function. Follow Jamendo's API terms and each track's licence. Confirm your intended public/commercial use with Jamendo before monetising or distributing the app.
- The app does not offer Jamendo music downloads or offline access. The offline app shell does not mean the online music catalogue is available offline.
- Apple/iTunes API search results do not grant unrestricted full-track streaming; this app plays preview URLs supplied by Apple.
- Commercial catalogues (for example, major-label Hindi and international hits) require a provider agreement or an authorised playback integration. No API credential or music rights are bundled with this ZIP.

## Known limitations

- This is a deployable PWA, not a native Android APK/AAB and not a Spotify-scale licensed catalogue.
- Local audio object URLs may not survive a browser restart; the actual files stay on the device.
- Crossfade/gapless controls are preferences only; true crossfade, lyrics, cloud sync/accounts, and a native Android home-screen music widget are not included.
- Test playback and review provider terms on the deployed site before public release.
