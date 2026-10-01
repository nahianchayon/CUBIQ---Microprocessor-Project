# CUBIQ — Microprocessor Focus & Meeting Intelligence Platform

Commercial-grade SaaS dashboard & IoT management interface for the physical CUBIQ smart cube.

## Key Features

- **High-Contrast Dark Mode**: Premium SaaS dark mode design system with sharp contrast, OKLCH color spaces, and responsive layouts.
- **Firebase Authentication**: Full Login (`/login`) and Signup (`/signup`) supporting Firebase Auth and instant dummy credentials shortcuts.
- **Live Firebase Realtime Database Sync**: Dual-way real-time hardware sync at `https://cubiq-b6979-default-rtdb.firebaseio.com` for orientation, focus state, meeting recordings, and live event logs.
- **Microprocessor Hardware Integration**: Real-time interface for ESP32 and Raspberry Pi sensors, battery status, microphone state, and MPU motion tracking.
- **Vercel Deployment Optimized**: Automated build and client SPA generation (`scripts/prepare-dist.js`) for seamless Vercel hosting.

## Local Development

```sh
git clone https://github.com/nahianchayon/CUBIQ---Microprocessor-Project.git
cd pixel-perfect-main
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build & Deployment

To build for production:

```sh
npm run build
```

This compiles client/server assets and generates `dist/client/index.html` for single-page app deployment on Vercel.
