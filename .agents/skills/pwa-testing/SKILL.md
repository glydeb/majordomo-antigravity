---
name: pwa-testing
description: Use this skill when implementing or testing Progressive Web App (PWA) features in LifeOS, including Web App Manifest, Service Worker offline caching, and mobile responsiveness.
---

# Progressive Web App (PWA) Testing Runbook

This skill outlines testing and verifying PWA features for the LifeOS frontend application.

## 1. PWA Requirements Checklist

- [ ] **Web App Manifest**: Valid `manifest.webmanifest` / `manifest.json` configured in `frontend/`.
- [ ] **Icons**: High-resolution icons (192x192, 512x512, maskable icons) configured.
- [ ] **Theme Color & Background**: Defined matching the "Premium" dark theme (`#09090b` / `#0f172a`).
- [ ] **Display Mode**: `standalone` display mode to simulate native app experience.
- [ ] **Service Worker**: Registered and active for caching static assets and shell navigation.

## 2. Testing Service Worker & Offline Caching

In `frontend/`:
```bash
# Build the production bundle
npm run build

# Preview production build locally
npm run preview
```

### Verification with DevTools
1. Open Chrome DevTools -> **Application** panel.
2. Inspect **Manifest**:
   - Verify `name`, `short_name`, `start_url`, `display`, and icons.
   - Click "Add to Home screen" or install icon in URL bar.
3. Inspect **Service Workers**:
   - Verify Service Worker status is "Activated and is running".
   - Check the **Offline** checkbox in DevTools Network or Service Worker tab.
   - Reload page to ensure App Shell renders seamlessly while offline.

## 3. Viewport & Touch Target Guidelines

- Touch targets must be at least 44x44 CSS pixels.
- Ensure safe-area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`) are accounted for on notch/island devices.
