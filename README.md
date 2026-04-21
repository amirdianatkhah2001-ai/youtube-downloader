# YouTube Downloader Companion Extension

This repository contains a clean-room browser extension that detects YouTube video pages and opens a configurable downloader endpoint for MP4 or MP3 export.

## Project structure

- `manifest.json` - extension manifest (MV3)
- `src/popup.*` - popup UI and behavior
- `src/options.*` - endpoint configuration page
- `src/lib/downloader.js` - URL detection/download URL helpers
- `tests/downloader.test.js` - focused unit tests for helper logic

## Local checks

```bash
npm test
npm run lint
```

## Load in Chrome/Edge

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this repository folder
5. Open any YouTube video page and use the extension popup
