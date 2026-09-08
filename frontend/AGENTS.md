# Frontend Development Rules (React + Vite + Tailwind CSS)

## Architecture & UI Guidelines

1. **Stack & Configuration**:
   - React 19 with Vite 5 and TypeScript.
   - Tailwind CSS v4 using `@tailwindcss/vite`.
   - Client routing via `react-router-dom`.
   - Icons from `lucide-react`.
   - Animations via `framer-motion`.

2. **"Premium" Design System**:
   - Primary theme: Dark mode first (e.g. slate-900 / zinc-950 backgrounds, subtle border highlights, clean typography).
   - Use Framer Motion for smooth layout transitions (`AnimatePresence`, `motion.div`), drawer/modal opens, and list reordering.
   - Design for both mobile viewport (PWA on iOS/Android) and desktop workstation.

3. **PWA Best Practices**:
   - Configure and maintain Progressive Web App standards (`vite-plugin-pwa` / web app manifest).
   - Support offline caching for cached task views and queueing local inbox items when disconnected.
   - Provide installation prompt components and touch-friendly targets (minimum 44x44px tap targets).

4. **Authentication Integration**:
   - Integrate Passkey WebAuthn registration and sign-in using `@simplewebauthn/browser`.
   - Provide fallback states and intuitive user feedback during biometric / security key prompts.

5. **Build & Quality Gates**:
   - Ensure strict TypeScript typing; run `npm run build` (`tsc -b && vite build`) to verify there are no compilation errors.
   - Follow ESLint rules via `npm run lint`.
