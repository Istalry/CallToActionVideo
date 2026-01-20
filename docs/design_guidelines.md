# Design & Aesthetic Guidelines (UI/UX)

## Core Philosophy
The application should feel **"Premium, Modern, and Dynamic"**. It is a creative tool, so the interface itself should inspire creativity.

## Visual Identity
-   **Theme**: Dark Mode default (preferred for video editing tools).
-   **Palette**:
    -   **Background**: Deep rich grays/blacks (e.g., `#121212`, `#1E1E1E`).
    -   **Accents**: Vibrant, electric colors (Neon Purple, Cyber Blue, Hot Pink) to guide user action and highlight active states. Users can customize CTA colors via a color wheel.
    -   **Glassmorphism**: Use subtle translucent layers with backdrop blur for panels and overlays.
    -   **Images**: User uploaded images must support "cover" fitting to avoid stretching, with optional manual adjustments (scale/position).
-   **Typography**:
    -   Primary: **Inter** or **Outfit** (Clean, geometric, modern).
    -   Headings: Bold, distinct weight.

## UI Components
-   **Input Fields**: Minimalist, no heavy borders. Underline or filled background with subtle focus glow.
-   **Buttons**:
    -   *Primary (Export)*: Gradient background, slight glow/shadow.
    -   *Secondary*: Ghost or outlined.
-   **Preview Area**: The canvas should be the "hero". Centered, with a checkerboard background (to show transparency).

## User Experience (UX) Flow
1.  **Landing**: Immediate access to the editor. No login wall.
2.  **Editing**:
    -   **Left Panel**: Configuration (Text, Images, Colors). Changes reflect *instantly* in the preview.
    -   **Center**: Live Preview (Looping animation).
    -   **Right Panel (Optional)**: Presets or Advanced Settings.
    -   **Bottom/Top**: specific animation timeline or simple "Play/Pause" controls.
3.  **Export**:
    -   A prominent "Export Video" button.
    -   Show a progress loading state during rendering/recording.
    -   Auto-download the file upon completion.

## Animation Rules (For the CTA itself)
-   **Easing**: All movements must use smooth easing (e.g., `easeOutExpo`, `easeInOutBack`). No linear mechanical movements.
-   **Timing**: The entire animation should be short (5-10 seconds max).
-   **Attention**: Use "pop" effects or subtle scales to draw the eye to the Subscribe button before the click happens.
