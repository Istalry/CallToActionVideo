# Design & Aesthetic Guidelines (UI/UX)

## Core Philosophy
The application should feel **"Premium, Modern, and Dynamic"**. It is a creative tool, so the interface itself should inspire creativity.

## Visual Identity
-   **Theme**: Dark Mode default.
-   **Palette**:
    -   **Background**: Deep rich grays/blacks (`#121212`, `#1E1E1E`).
    -   **Accents**: Vibrant, electric colors (Neon Purple) to guide user action.
    -   **Surface**: Card-like surfaces with subtle borders (`border-gray-800`).
-   **Typography**:
    -   Primary: **Inter** or **Outfit**.
    -   Text Sizes: Small, dense controls (12px-14px) to maximize screen real estate.

## UI Components
-   **Sidebar Controls**:
    -   Grouped into collapsible **Sections** (Content, Appearance, Animation, Particles).
    -   **Inputs**: Dark background, light border on focus.
    -   **Sliders**: Custom styled with linear-gradient fill to visualize value intensity.
    -   **Color Pickers**: Circular, distinct hit-areas.
-   **Preview Area**: 
    -   Centered Canvas.
    -   Checkerboard pattern background to clearly indicate transparency.

## User Experience (UX) Flow
1.  **Configuration**:
    -   Users adjust settings in the sidebar.
    -   Changes reflect *instantly* in the preview loop.
2.  **Animation Control**:
    -   **Motion Type**: Select between Smooth, Elastic, and Bounce curves.
    -   **Cursor**: Independent control for cursor motion smoothing.
3.  **Export**:
    -   Prominent "Export" button.
    -   Handles browser-native file saving (File System Access API where supported).

## Animation Rules (For the CTA itself)
-   **Easing**: Default to smooth easing (`easeOutExpo`). Optional `Elastic` and `Bounce` for more playful brands.
-   **Timing**: The entire animation loop is effectively 6 seconds.
-   **Attention**:
    -   Entrance: Smooth slide/fade in.
    -   Interaction: Cursor simulates a realistic click.
    -   Reaction: Button scaling/color change upon click.
    -   Exit: Clean slide out.
