# CTA Video Generator

> [!CAUTION]
> **Vibe Coded Project**
> This project was "vibe coded" (generated via AI assistance) and will **not be maintained**.

A web-based tool for streamers to create professional "Call to Action" (CTA) videos for their broadcasts. Export transparent WebM videos directly from your browser.

## Demo

<video src="exampleVideo.webm" controls width="100%"></video>

*(If the video doesn't play, you can [download it here](exampleVideo.webm))*

## Features

-   **Professional Quality**: Premium, modern design with smooth animations.
-   **Zero Install**: Runs entirely in the browser (or as a standalone app).
-   **Transparent Export**: Generates `.webm` files with alpha channel, perfect for OBS/Streamlabs overlays.
-   **Fully Customizable**:
    -   **Format**: Support for Landscape (16:9) and Portrait (9:16).
    -   **Branding**: Upload your channel logo and customize text/colors.
    -   **Animation**: Choose from "Smooth", "Elastic", or "Bounce" easing curves.
    -   **Particles**: Add gravity-defying confetti or custom image particles.
-   **Privacy Focused**: All processing happens client-side.

## Installation

### For Users (Windows)
1.  Go to the **Releases** page on GitHub (Right sidebar).
2.  Download the latest `.zip` file.
3.  Extract the contents of the zip file to a folder.
4.  Run the `CTA Video Generator.exe` file.

### For Developers
1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/call-to-action-video.git
    cd call-to-action-video
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  (Optional) Build the desktop app:
    ```bash
    npm run electron:build
    ```

## Usage

1.  **Customize**: Use the sidebar to adjust text, colors, and upload your logo.
    -   *Appearance*: Toggle between Landscape/Portrait.
    -   *Animation*: Tweak cursor movement and easing.
    -   *Particles*: Enable confetti for that extra pop.
2.  **Preview**: See changes instantly in the main preview window.
3.  **Export**: Click the "Export Video" button.
    -   Wait for the rendering process to complete (rendered frame-by-frame for high quality).
    -   The `.webm` file will be saved to your downloads folder.
4.  **OBS Setup**:
    -   Add a **Media Source** in OBS.
    -   Select the generated `.webm` file.
    -   Ensure "Loop" is unchecked (usually).
    -   The background will automatically be transparent!

## Tech Stack

-   **Core**: React 19 + TypeScript + Vite
-   **Styling**: TailwindCSS
-   **Rendering**: Custom HTML5 Canvas Loop (for high-performance 2D animation)
-   **Video**: `webm-writer` (Pure JS VP8 encoder for alpha transparency)
-   **Desktop**: Electron

## License

MIT
