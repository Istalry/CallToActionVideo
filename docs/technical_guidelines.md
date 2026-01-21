# Technical Guidelines & Code Structure

## Technology Stack
We will utilize a **Web Application** architecture hosted on GitHub Pages. This offers the best balance of accessibility and performance.

-   **Framework**: [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
    -   Fast development, component-based, excellent ecosystem.
-   **Language**: **TypeScript**
    -   Type safety is critical for handling media properties and configuration objects.
-   **Styling**: **TailwindCSS**
    -   Rapid UI development, consistent design system.
-   **Animation & Rendering**: **Custom HTML5 Canvas Loop**
    -   *Implementation*: A custom `renderLoop.ts` handles the `requestAnimationFrame` cycle.
    -   *State Separation*: Rendering logic is pure and separated from React state (`useStore`).
    -   *Tweening*: Custom easing functions (`easings.ts`) support `Smooth` (Expo), `Elastic`, and `Bounce` curves.
    -   *Particles*: Advanced particle system supporting Gravity, Rotation, and Custom Images (via `ctx.drawImage` with rotation transforms).
-   **Video Export**: `MediaRecorder` API (browser native) capturing the Canvas stream.
    -   Output: `video/webm; codecs=vp9` (supports transparency), falling back to `vp8`.

## Project Structure
```text
src/
├── components/        
│   └── ui/            # Reusable, styled UI atoms (Button, Input, Slider, Section)
├── features/
│   ├── editor/        # The main editor workspace
│   │   ├── CanvasPreview.tsx  # The visual preview
│   │   ├── Controls.tsx       # Sidebar controls (uses ui/ components)
│   ├── generator/     # Logic for rendering and exporting video
│   │   ├── renderLoop.ts      # Pure function handling frame rendering
│   │   ├── exporter.ts        # MediaRecorder logic
│   └── store/
│       └── useStore.ts    # Global Zustand state
├── assets/            # Static assets
├── hooks/             # Custom React hooks (useCanvasRender, useVideoExport)
├── utils/             # Helper functions (easings.ts)
├── types/             # Shared TypeScript interfaces
├── App.tsx            # Main entry point
└── main.tsx
```

## Naming Conventions
-   **Components**: PascalCase (e.g., `CanvasPreview.tsx`, `Slider.tsx`).
-   **Functions/Variables**: camelCase (e.g., `startRecording`, `renderFrame`).
-   **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_DURATION`).
-   **CSS Classes**: Standard Tailwind utility classes.

## Code Quality Rules
-   **Strict Typing**: Avoid `any`. Use specific interfaces for props and state.
-   **Component Purity**: 
    -   UI components (Controls) strictly handle user input and update store.
    -   Rendering logic (renderLoop) strictly draws based on passed state, with no side effects.
-   **Performance**: Minimize React re-renders. Canvas updates happen outside the React render cycle via refs where possible.
