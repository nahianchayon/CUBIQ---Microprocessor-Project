# CUBIQ Developer Guidelines

This repository contains the official CUBIQ Microprocessor Focus & Meeting Intelligence web interface.

- **Stack**: React 19, TanStack Router, Vite, Tailwind CSS v4, Firebase Auth & Realtime Database.
- **State Management**: `src/lib/cubiq/device-store.tsx` handles real-time IoT hardware states and Firebase sync.
- **Routing**: TanStack Router with client SPA static generation (`scripts/prepare-dist.js`).
