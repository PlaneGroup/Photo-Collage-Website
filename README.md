# ✨ CollageCraft Studio

> **The Sleek, Modern & 100% Private Client-Side Photo Collage Studio**  
> Turn your favorite moments and photo dumps into stunning, magazine-grade collages and Korean photobooth strips in seconds. Zero cloud uploads, zero server storage, and zero account required.

---

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](https://opensource.org/licenses/MIT)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20In--Memory-emerald.svg)](#-zero-server-privacy-guarantee)
[![Built with: Vite + React + TS](https://img.shields.io/badge/Built%20With-Vite%20%7C%20React%20%7C%20TypeScript-blue.svg)](https://vitejs.dev/)
[![Tailwind CSS: v3.4](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com/)
[![i18n: EN & KO](https://img.shields.io/badge/i18n-English%20%7C%20한국어-purple.svg)](#-multilingual-support-i18n)

---

## 🌟 Why CollageCraft?

Most online collage makers force you to upload sensitive personal photos to unknown cloud servers, require tedious logins, bombard you with ads, or watermark your artwork. 

**CollageCraft Studio** was built differently:
- 🔒 **100% Private & In-Memory**: Your photos **never** leave your browser. All compositing, scaling, and filters happen directly on your local device.
- ⚡ **Instant Auto-Collage**: Simply drop your photos — CollageCraft automatically determines the optimal aesthetic arrangement instantly.
- 🎨 **Trendy Aesthetic Layouts**: From classic grids to Korean **Life4Cuts (인생네컷)** photobooth strips, editorial magazine layouts, and polaroid aesthetics.
- 🎛️ **Deep Creative Controls**: Drag-and-drop photo swap, live pan/zoom, 90° rotation, color filters (Noir, Warm Sunset, Vintage 90s, Vivid), corner radius, and custom typography stamps.
- 💎 **Ultra HD Client-Side Export**: Download crystal-clear PNG, JPEG, or WebP files at 1x or 2x Retina resolution, or copy straight to your clipboard with one click.
- 🌓 **Dark & Light Mode**: Seamless theme switching with modern glassmorphic interface.
- 🌐 **Always Multilingual**: Native real-time toggle between **English (Default)** and **한국어 (Korean)**.

---

## 🔒 Zero-Server Privacy Guarantee

Your memories belong to you. CollageCraft operates under a strict **Zero-Server Retention Architecture**:

```
Your Device (Web Browser)
┌─────────────────────────────────────────────────────────────┐
│ 1. Drag & Drop Photos                                       │
│    │                                                        │
│    ▼                                                        │
│ 2. In-Memory Blobs (URL.createObjectURL)                   │
│    │  - Volatile browser RAM only                           │
│    ▼                                                        │
│ 3. HTML5 Canvas Compositing & Color Filters                 │
│    │                                                        │
│    ▼                                                        │
│ 4. Client-side Canvas.toBlob() / toDataURL()               │
│    │                                                        │
│    ▼                                                        │
│ 5. Direct File Download & Clipboard Copy                    │
└─────────────────────────────────────────────────────────────┘
       ❌ No Server Uploads
       ❌ No Database Storage
       ❌ No Tracking or Watermarks
```

---

## 📸 Key Features

### 1. Smart Auto-Collage & Layout Presets
* **Smart Auto Layout**: Dynamically calculates the most flattering aspect ratios and grid distributions for 1 to 12+ photos.
* **Korean Photobooth Strip (인생네컷)**: 4-cut vertical strip format with signature bottom stamp spacing.
* **Photobooth 4-Grid**: 2x2 nostalgic photobooth frame.
* **Editorial & Magazine**: Featured Hero layout with thumbnail sidebars.
* **Polaroid Aesthetic**: Subtle polaroid framing and caption area.
* **Classic Grids**: 1x2, 2x1, 2x2, 3x2, 2x3, 3x3.
* **Asymmetric & Golden Ratio**: Modern split designs.

### 2. Aspect Ratio Flexibility
* **1:1** — Square (Instagram Feed, Profile)
* **4:5** — Portrait (Instagram Feed optimum)
* **9:16** — Stories, TikTok, Reels, Shorts
* **16:9** — Cinematic Landscape, Wallpaper
* **3:4** — Classic Photobooth & Print
* **4:3** — Vintage Classic

### 3. Creative Customization & Styling
* **Spacing & Corners**: Sliders for Outer Margin (0-44px), Inner Gap (0-32px), and Corner Radius (0-36px).
* **Studio Backgrounds**: Curated palettes including Obsidian Black, Warm Cream, Pastel Blossom, Fresh Mint, and vibrant modern gradients (Sunset Boulevard, Neon Velvet, Deep Ocean, Peach Sherbet).
* **Aesthetic Watermark & Date Stamp**: Add customizable date or commemorative titles with Modern, Serif, Typewriter, or Handwriting typography.
* **Per-Photo Tools**:
  * Drag & drop to swap positions.
  * Instant 90° rotation.
  * One-click zoom toggle (1x to 1.6x).
  * Color filter presets: Original, Black & White, Film Noir, Warm Sunset, Cool Breeze, Vintage Film, Vivid Pop, Moody Fade, Retro Polaroid.

---

## 🌐 Multilingual Support (i18n)

CollageCraft provides first-class internationalization out of the box with zero setup:
* **Default Language**: English (`EN`)
* **Supported Locales**: English (`EN`) & Korean (`KO`)
* **Dynamic Loading**: Translations are structured as modular JSON files in `languages/EN` and `languages/KO`:
  * `src-components-header-navigation.json`
  * `src-components-editor-collage.json`
  * `src-components-presets-templates.json`
  * `src-components-export-modal.json`
  * `src-components-common-ui.json`

---

## 🛠️ Tech Stack & Architecture

* **Build Tool & Dev Server**: [Vite 6](https://vitejs.dev/)
* **UI Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with custom glassmorphism and animations
* **Icons**: [Lucide React](https://lucide.dev/)
* **Rendering Engine**: HTML5 Canvas 2D (`CanvasRenderingContext2D`) running strictly in-browser
* **State Management**: React Context API with persistent theme and locale storage
* **Zero Backend**: Deployable to any static host (GitHub Pages, Vercel, Netlify, Cloudflare Pages, S3).

---

## 🚀 Quick Start Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* `npm`, `pnpm`, or `yarn`

### Installation & Local Run

```bash
# 1. Clone repository
git clone https://github.com/your-username/Photo-Collage-Website.git
cd Photo-Collage-Website

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your web browser.

### Production Build

```bash
# Build production bundle to /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Repository Structure

```
Photo-Collage-Website/
├── _AGENTS/                             # AI Agent specifications & persistent memory
│   ├── USER_REQUIREMENTS_AND_RULES.md  # Master rules (i18n, privacy, language format)
│   ├── ARCHITECTURE_AND_TECH_STACK.md  # Technical decisions & security model
│   └── DEVELOPMENT_LOG.md              # Sprints and progress log
├── assets/                             # Global styling & helper scripts
│   ├── css/
│   │   └── main.css                    # Tailwind directives & glassmorphic styles
│   └── js/
│       ├── collage-filters.js          # Canvas filter preset matrices & helpers
│       └── collage-filters.d.ts        # TypeScript declarations
├── languages/                          # Multilingual dictionaries
│   ├── EN/                             # English JSON files (Default)
│   │   ├── src-components-common-ui.json
│   │   ├── src-components-editor-collage.json
│   │   ├── src-components-export-modal.json
│   │   ├── src-components-header-navigation.json
│   │   └── src-components-presets-templates.json
│   └── KO/                             # Korean JSON files
│       ├── src-components-common-ui.json
│       ├── src-components-editor-collage.json
│       ├── src-components-export-modal.json
│       ├── src-components-header-navigation.json
│       └── src-components-presets-templates.json
├── src/                                # Application source code
│   ├── components/
│   │   ├── Header.tsx                  # Nav, privacy badge, theme & lang toggles
│   │   ├── Dropzone.tsx                # Drag-and-drop zone with instant demo loader
│   │   ├── CollageCanvas.tsx           # Interactive canvas preview & frame tools
│   │   ├── SidebarControls.tsx         # Layouts, ratios, sliders, colors, stamps
│   │   └── ExportModal.tsx             # High-res export, copy to clipboard
│   ├── context/
│   │   ├── CollageContext.tsx          # Photo list, layout, slot math & state
│   │   ├── LanguageContext.tsx         # i18n engine with auto JSON aggregation
│   │   └── ThemeContext.tsx            # Dark / Light mode provider
│   ├── types/
│   │   └── collage.ts                  # TypeScript models and interfaces
│   ├── utils/
│   │   ├── layoutEngine.ts             # Mathematical slot positioning engine
│   │   └── canvasExporter.ts           # In-memory canvas rendering & download API
│   ├── App.tsx                         # Main studio application view
│   └── main.tsx                        # React application entrypoint
├── index.html                          # HTML template with Google Fonts
├── package.json                        # Scripts and dependencies
├── tailwind.config.js                  # Tailwind studio palettes & animations
├── tsconfig.json                       # TypeScript configuration
└── vite.config.ts                      # Vite configuration & path aliases
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
Feel free to use, modify, and distribute for personal or commercial projects.
