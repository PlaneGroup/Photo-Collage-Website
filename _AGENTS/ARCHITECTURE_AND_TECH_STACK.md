# Architecture and Technical Stack Selection

## 1. Executive Summary

This project is a high-performance, client-side photo collage generator designed with a strict zero-server privacy architecture and modern aesthetics.

## 2. Framework Comparison & Selection

| Criteria | Next.js | Vite.js (Chosen) | Advantage |
| :--- | :--- | :--- | :--- |
| **Server Requirement** | Node.js runtime or static export | 100% pure client static bundle | **Vite**: Guarantees zero backend leakage |
| **Image Privacy** | Risk of accidental API routes / server actions | No server endpoints exist anywhere | **Vite**: Uncompromising user privacy |
| **Canvas Manipulation** | Requires `use client` directives & SSR hydration guards | Native DOM / Canvas execution | **Vite**: Smoother canvas integration |
| **Build & HMR Speed** | Heavier compilation & SSR build step | Sub-second HMR with esbuild / Rollup | **Vite**: Rapid development & lightweight bundle |
| **Deployment** | Vercel / Node server preferred | Deployable to GitHub Pages, Cloudflare Pages, S3, Netlify, or any static host | **Vite**: Universal zero-cost static hosting |

**Decision**: **Vite + React 18/19 + TypeScript + Tailwind CSS** is the optimal choice for this application.

## 3. Technology Stack Breakdown

* **Core Framework**: React 18+ with TypeScript
* **Build Tool & Dev Server**: Vite
* **Styling**: Tailwind CSS with custom glassmorphism and modern dark/light theme utilities
* **Icons**: Lucide React
* **Image Processing Engine**:
  * Native HTML5 Canvas 2D Context (`CanvasRenderingContext2D`)
  * `URL.createObjectURL` and `URL.revokeObjectURL` for zero-leak volatile memory management
  * CSS Filters + Canvas 2D pixel filter matrix for real-time preview and export
* **State Management**: React Context + Hooks (Clean, reactive, zero external bloat)
* **Internationalization (i18n)**: Custom lightweight modular i18n engine reading JSON translation maps from `languages/EN` and `languages/KO`.
* **Export Engine**: In-browser client-side rendering with canvas scaling (`devicePixelRatio` and export scale multipliers 1x, 2x) generating Blobs for instant download or clipboard copying.

## 4. Privacy & Zero-Retention Security Architecture

```
User Device (Browser)
┌────────────────────────────────────────────────────────┐
│  1. File Input / Drag & Drop                           │
│     │                                                  │
│     ▼                                                  │
│  2. In-Memory Blob URL (URL.createObjectURL)           │
│     │  (Never transmitted across the network)          │
│     ▼                                                  │
│  3. Real-time HTML5 Canvas Compositing & Filters       │
│     │                                                  │
│     ▼                                                  │
│  4. Client-side Canvas.toBlob() / toDataURL()          │
│     │                                                  │
│     ▼                                                  │
│  5. Browser Download Trigger (Anchor Tag / Clipboard)  │
└────────────────────────────────────────────────────────┘
          ❌ No API Requests
          ❌ No Cloud Storage
          ❌ No Web Server File Persistence
```

## 5. Asset & File Structure Overview

* `languages/`:
  * `EN/`: English JSON dictionaries named as `folder-subfolder-filename-feature.json`
  * `KO/`: Korean JSON dictionaries named as `folder-subfolder-filename-feature.json`
* `assets/`:
  * Custom stylesheet (`assets/css/main.css`)
  * Utility scripts and presets (`assets/js/`)
* `_AGENTS/`:
  * Developer and agent directives, architecture documentation, and development logs (English).
* `src/`:
  * `components/`: UI and editor components
  * `context/`: i18n, Theme, and Collage State Contexts
  * `types/`: Strongly typed definitions
  * `utils/`: Canvas math, layout calculations, and filter algorithms.
