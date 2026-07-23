# 🖼️ PosterForge — Privacy-First Online Poster Tiler & PDF Exporter

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25_Client_Side-emerald?style=for-the-badge)](https://github.com/pkprasad0306/PosterForge)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

> **PosterForge** is a fast, modern, privacy-first web application that allows anyone to split large images into printable multi-page posters and export high-resolution (300 DPI) PDFs directly inside the browser. No server uploads. No accounts required. 100% Free forever.

---

## ✨ Features

- 🔒 **100% Client-Side Privacy**: All processing, image scaling, canvas rendering, and PDF exports run inside your browser's RAM via HTML5 Canvas API. Your photos never leave your device.
- 📐 **Cut-to-Cut (0 mm) & Overlap Printing**: Support for 0mm full-bleed borderless printing, custom margins (0–25mm), and shaded glue overlap tabs (0–20mm).
- 🎯 **Crop Mark Crosshairs & Page Numbers**: Automatic alignment crosshairs and page index labels (`Pg 1 (1,1)`) for flawless poster assembly.
- 🖱️ **Interactive Bounding Box Resizing**: Drag visual blue handles on the live preview canvas to resize your poster width/height or page grid on the fly.
- 📄 **Standard & Custom Paper Presets**: Support for ISO standard paper sizes (A5, A4, A3) and US formats (Letter, Legal, Tabloid), or fully custom dimensions in `mm`, `cm`, or `inches`.
- 🪄 **AI Canvas Filters**: Fine-tune image brightness, contrast, saturation, sharpening kernels, and auto-color enhancement before printing.
- 🖨️ **Vector-Accurate 300 DPI PDF & ZIP Tile Archive**: Download a single printable PDF ready for home printers or export individual PNG tiles as a `.zip` archive.
- 💾 **Local Project History**: Save poster project configurations locally in your browser with compact thumbnail compression.
- ↩️ **Undo / Redo History**: Full `Ctrl+Z` / `Ctrl+Y` configuration history stack.
- 📱 **Fully Responsive Light Theme**: Apple / Linear-inspired light glassmorphic user interface designed for both mobile and widescreen desktop displays.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS Glassmorphism
- **PDF Generation**: [`pdf-lib`](https://pdf-lib.js.org/) (Vector 300 DPI PDF builder)
- **Archive Exporter**: [`JSZip`](https://stuk.github.io/jszip/)
- **Icons**: [`Lucide React`](https://lucide.dev/)
- **Effects**: [`canvas-confetti`](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- `npm` or `pnpm` / `yarn`

### Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pkprasad0306/PosterForge.git
   cd PosterForge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to launch the workspace.

---

## 📄 Production Build

To build the optimized production bundle:

```bash
npm run build
npm run start
```

---

## 🔒 Security & Privacy Architecture

PosterForge is engineered to be **zero-trust and offline-capable**:

1. **No External Network Requests**: Images are processed using `URL.createObjectURL` without uploading data to any backend.
2. **No Data Storage on Remote Servers**: No databases, tracking scripts, or user accounts.
3. **Offline Capability**: Once loaded in your browser, you can disconnect your internet connection and PosterForge will continue to generate PDFs seamlessly offline.

---

## 📖 How to Print & Assemble

1. **Upload your image** to the workspace.
2. **Select your paper size** (e.g. A4 or US Letter) and grid layout (e.g. 3x3 pages).
3. **Enable Overlap (10mm recommended)** and **Crop Mark Crosshairs**.
4. **Click "Export PDF"** and download the 300 DPI document.
5. **Print Setting**: In your printer dialog, set Scale to **`100% / Actual Size`** (do not select *Fit to Printable Area*).
6. **Assemble**: Trim off the margin on ONE side along the crop lines, apply glue along the shaded tab, and tile your poster!

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p center="text-center">Built with privacy and precision for creators everywhere.</p>
