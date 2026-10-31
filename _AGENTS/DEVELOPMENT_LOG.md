# Development Log

## Project: Photo Collage Website
* **Status**: Completed & Production Ready
* **Date**: October 2026
* **Language Requirement**: All markdown files in English; Application UI supports EN (Default) and KO.

---

### Sprint 1: Initialization & Core Setup
- [x] Create core directive records in `_AGENTS/USER_REQUIREMENTS_AND_RULES.md`.
- [x] Create architectural specification in `_AGENTS/ARCHITECTURE_AND_TECH_STACK.md`.
- [x] Initialize Vite + React + TypeScript project with Tailwind CSS.
- [x] Populate bilingual JSON dictionaries in `languages/EN/` and `languages/KO/` following strict naming pattern `folder-subfolder-filename-feature.json`.
- [x] Implement `assets/css` and `assets/js` structure.
- [x] Implement Theme Provider (Dark / Light mode).
- [x] Implement i18n Provider with persistent locale switching.

### Sprint 2: Collage Engine & Smart Auto-Layout
- [x] Implement reactive canvas & layout mathematical engine:
  - Smart auto-layout based on photo count (2 to 12+ photos).
  - Classic grids (1x2, 2x1, 2x2, 3x3, 2x3, 3x2).
  - Editorial / Magazine layouts (Hero + Thumbnails).
  - Photobooth 4-cut vertical strip & 2x2 grid (Life4Cuts style).
  - Polaroid style frame with captions.
  - Asymmetric split & dynamic mosaic.
- [x] Aspect ratio controls (1:1, 4:5, 9:16, 16:9, 3:4, 4:3).
- [x] Gap, border padding, and border radius controls.
- [x] Custom background studio palettes & modern gradients.
- [x] Aesthetic text / date stamp generator.

### Sprint 3: Interactive Photo Adjustments
- [x] Drag-and-drop photo reordering / swapping.
- [x] Individual photo pan/zoom and rotation.
- [x] Client-side visual filters (Monochrome, Noir, Warm, Vintage, Vivid, etc.).
- [x] Replace and delete individual photos.

### Sprint 4: High-Res Export & Privacy Verification
- [x] Client-side high-resolution export (PNG, JPEG, WebP) with 1x/2x scale.
- [x] One-click download and copy-to-clipboard functionality.
- [x] Verify zero network transmission of image data.

### Sprint 5: Documentation & Repo Showcase
- [x] Write rich, promotional, and detailed `README.md` in English.
- [x] Final verification of all user requirements.

### Sprint 6: Global Seamless Drag-and-Drop Enhancement
- [x] Implemented global window & canvas drag-and-drop listener for external image files.
- [x] User can drop image files anywhere onto the canvas, workspace, or browser window without clicking "Add Photos".
- [x] Created stylish floating drop overlay (`editor.dragToAddTitle`, `editor.dragToAddSubtitle`) with bilingual i18n support.
- [x] Auto-layout seamlessly accommodates newly appended photos while preserving 100% in-memory client-side privacy.
- [x] Handled drop on individual photo slots to differentiate internal swapping vs external file addition.
- [x] Fixed drag-to-add modal overlay lingering issue:
  - Removed event propagation block (`e.stopPropagation()`) in canvas slots.
  - Added dedicated `onDrop` and `onDragLeave` handlers directly on the overlay with `pointer-events-auto`.
  - Added window-level listeners (`drop`, `dragend`, `mouseleave`) and click-to-dismiss fail-safe ensuring the modal always disappears immediately upon file release or cancel.
- [x] Fixed duplicate photo upload bug:
  - Eliminated duplicate `addPhotos` invocations caused by drop events bubbling through nested parent containers (`overlay` -> `root` and `slot` -> `canvas` -> `root`).
  - Restricted `CollageCanvas` drop handlers strictly to internal photo swapping; external file drops are handled solely by `App.tsx`.
  - Added `e.stopPropagation()` on overlay drop and initial dropzone drop.
  - Added a fingerprint & timestamp debounce barrier in `CollageContext.tsx` preventing identical file batches from being processed more than once within 600ms.

### Sprint 7: Interactive Framing & Position Adjustment Modal
- [x] Implemented `PhotoCropModal` (`src/components/PhotoCropModal.tsx`) with strict framing parity:
  - Dynamically measures slot aspect ratio so the modal crop viewport exactly matches the slot's aspect ratio.
  - Initializes with identical zoom, rotation, and offsets so the cropped extent when opening the modal is 100% identical to the collage slot.
  - Interactive mouse/touch dragging to smoothly pan the photo within the crop boundaries.
  - Precision zoom slider (1.0x to 2.5x), 90° rotation, and framing reset.
  - Rule-of-thirds composition overlay grid.
- [x] Added click-to-edit support directly on collage photo slots (with drag-vs-click distance threshold detection) and added a dedicated crop button in the hover toolbar.
- [x] Updated canvas exporter (`src/utils/canvasExporter.ts`) to synchronize percentage-based offsets with CSS transforms for pixel-perfect Ultra HD exports.
- [x] Added modular i18n dictionaries: `languages/EN/src-components-crop-modal.json` and `languages/KO/src-components-crop-modal.json`.
- [x] Resolved `tsconfig.json` lint warning by removing deprecated `"baseUrl": "."` when using `"moduleResolution": "bundler"`, maintaining clean `"paths"` mapping.

### Sprint 8: Precision `object-position` Framing & Bottom Truncation Fix
- [x] Diagnosed and fixed image bottom truncation bug:
  - Previously, using `translate(...)` on a `w-full h-full` image element moved the element box itself, leaving an empty gray container gap at the bottom/top instead of revealing hidden photo content.
  - Replaced translation with native CSS `object-fit: cover` and `object-position: ${50 + offsetX}% ${50 + offsetY}%`.
  - Guarantees 100% full-frame coverage at all times: moving `offsetY` towards +50 smoothly and completely reveals the bottom of tall photos, and towards -50 reveals the top, without ever exposing gray background.
  - Added precision "Vertical Position" (위/아래) and "Horizontal Position" (좌/우) interactive sliders in `PhotoCropModal` alongside 1:1 mouse/touch dragging.
  - Aligned HTML5 Canvas export math in `canvasExporter.ts` to exactly mirror `object-position` calculations for identical exports.

---

### Verification Summary
- **Zero Server Uploads**: Verified. All file operations utilize `URL.createObjectURL(file)` and HTML5 Canvas in RAM.
- **Multilingual Support**: Fully operational across all UI components, buttons, menus, tooltips, and modals.
- **Dark/Light Mode**: Smooth switching with high-contrast aesthetic palettes.
- **Build Quality**: Verified with `npm run build` — compiles cleanly in ~1.4s with 0 errors.
