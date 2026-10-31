# User Requirements and Core Directives

This document records all instructions and rules provided by the USER. It serves as a persistent memory and directive guide for all AI agents working on this project.

## 1. Multi-Language (i18n) Policy — MANDATORY & PERMANENT
* **Rule**: Multi-language support must **always be implemented and maintained across the entire application**.
* **Zero-reminder requirement**: The agent must **NEVER** wait for the user to ask for i18n support. Every new feature, UI component, tooltip, modal, and alert must support both English (EN) and Korean (KO).
* **Default Language**: `EN` (English).
* **Supported Languages**: `EN`, `KO`.
* **Language Directory Structure**:
  * Located under the `languages/` folder:
    * `languages/EN/`
    * `languages/KO/`
* **File Format**: `.json`
* **File Naming Convention**:
  * Format: `폴더-서브폴더-파일명-기능명.json` (Folder-Subfolder-Filename-FeatureName.json)
  * **Strict Exclusion**: The leading language folder name (`EN` or `KO`) **MUST NOT** be part of the JSON filename.
  * Examples:
    * `languages/EN/src-components-header-navigation.json`
    * `languages/KO/src-components-header-navigation.json`
    * `languages/EN/src-components-editor-collage.json`
    * `languages/KO/src-components-editor-collage.json`
    * `languages/EN/src-components-presets-templates.json`
    * `languages/KO/src-components-presets-templates.json`
    * `languages/EN/src-components-export-modal.json`
    * `languages/KO/src-components-export-modal.json`
    * `languages/EN/src-components-common-ui.json`
    * `languages/KO/src-components-common-ui.json`

## 2. Privacy & Zero-Server Storage Guarantee
* **Uploaded Photos**: **MUST NEVER** be stored on any server or saved into web folders. All image processing must occur entirely client-side in the browser's volatile memory (`URL.createObjectURL` / `FileReader` / HTML5 Canvas).
* **Exported Photos**: **MUST NEVER** be saved into server folders. Exports must be rendered on the client canvas and downloaded directly to the user's local machine via browser download APIs.
* **No Server / No Authentication**: The site requires **no backend server** and **no user login/authentication**. It is a 100% client-side privacy-first web application.

## 3. Framework Selection
* The user permits either **Next.js** or **Vite.js** based on which is best suited.
* **Selection**: **Vite.js + React + TypeScript + Tailwind CSS** was chosen.
  * *Reasoning*: As a 100% client-side application with zero backend requirements and strict in-browser image processing, Vite provides the fastest build times, cleanest client-only architecture, no SSR overhead/hydration traps with canvas manipulation, and effortless static deployment.

## 4. Documentation Guidelines
* **Location**: All agent notes and development records must be stored in the `_AGENTS/` directory as `.md` files.
* **Language**: **ALL `.md` files MUST be written in ENGLISH.**
* **README.md**:
  * Must contain compelling promotional and explanatory information about the repository.
  * Must always be kept up-to-date with current features, tech stack, and setup guides.

## 5. UI/UX & Design Expectations
* **Theme**: Must support both **Dark Mode** and **Light Mode** with smooth transitions and persistent theme settings.
* **Aesthetics**: Sleek, modern, and high-end design (not outdated or plain). Features glassmorphism, responsive controls, modern typography, micro-interactions, and an intuitive layout.
* **Assets**: Required custom CSS and JS utilities must be organized in the `assets/` directory.

## 6. Core Product Capabilities
* Auto-collage generation immediately upon uploading photos.
* Multiple layout presets:
  * Classic Grids (2x2, 3x3, etc.)
  * Modern Editorial / Magazine (Featured + Thumbnails)
  * Korean 4-Cut Photobooth Strip (인생네컷 style)
  * Polaroid Aesthetic Frames
  * Asymmetric & Golden Ratio splits
* Aspect ratio presets: 1:1, 4:5, 9:16, 16:9, 3:4, 4:3.
* Deep customization:
  * Outer border padding, inner spacing, corner radius.
  * Background colors (Solids, Gradients, Aesthetic studio palettes).
  * Optional date/title stamps and stickers.
  * Per-photo controls: drag-and-drop swap, pan/zoom, rotate, filter presets, swap/delete.
* High-res export (PNG, JPEG, WebP) with 1x/2x scale options and clipboard copy.
