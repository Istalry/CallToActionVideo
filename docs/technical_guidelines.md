# Technical Guidelines & Code Structure

## Technology Stack
We will utilize a **Web Application** architecture hosted on GitHub Pages. This offers the best balance of accessibility and performance.

-   **Framework**: [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
    -   Fast development, component-based, excellent ecosystem.
-   **Language**: **TypeScript**
    -   Type safety is critical for handling media properties and configuration objects.
-   **Styling**: **TailwindCSS**
    -   Rapid UI development, consistent design system.
-   **Animation & Rendering**: **HTML5 Canvas** (likely via `react-konva` or native API) + `gsap` (GreenSock) or `framer-motion`.
    -   *Why Canvas?* To ensure frame-perfect export to video, drawing to a Canvas is more reliable than recording DOM elements. We can capture the Canvas stream easily.
    -   *Tweening*: Support variable durations and easing types (Elastic, Smooth, Bounce).
    -   *Image Processing*: Calculate aspect ratios to implement "object-fit: cover" behavior manually on Canvas draw calls.
-   **Video Export**: `MediaRecorder` API (browser native) capturing the Canvas stream.
    -   Output: `video/webm; codecs=vp9` (supports transparency).

## Project Structure
```text
src/
├── components/        # Reusable UI components (Buttons, Inputs, Panels)
├── features/
│   ├── editor/        # The main editor workspace
│   │   ├── CanvasPreview.tsx  # The visual preview
│   │   ├── Controls.tsx       # Sidebar controls
│   ├── generator/     # Logic for rendering and exporting video
│   │   ├── renderLoop.ts      # Main animation loop
│   │   ├── exporter.ts        # MediaRecorder logic
├── assets/            # Static assets (default icons, specific cursors)
├── hooks/             # Custom React hooks (useAnimation, useVideoExport)
├── utils/             # Helper functions (math, file handling)
├── types/             # Shared TypeScript interfaces
├── App.tsx            # Main entry point
└── main.tsx
```

## Naming Conventions
-   **Files/Components**: PascalCase (e.g., `CanvasPreview.tsx`, `ExportButton.tsx`).
-   **Functions/Variables**: camelCase (e.g., `startRecording`, `currentUser`).
-   **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_CANVAS_WIDTH`).
-   **CSS Classes**: kebab-case (if custom CSS used), otherwise standard Tailwind classes.

## Code Quality Rules
-   **Strict Typing**: No `any` types unless absolutely necessary.
-   **Component Purity**: separating rendering logic (Canvas) from state management (React).
-   **Comments**: Document complex animation logic or canvas operations.
