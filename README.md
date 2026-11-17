# Junior Ruiz Sánchez — engineering portfolio

Published with GitHub Pages at [jrpompio.github.io](https://jrpompio.github.io/).

A bilingual, buildless HTML/CSS/JavaScript portfolio. English is the default; Spanish is available. Select an engineering discipline to change the introduction, color, projects and interactive illustration. Share a view with `#embedded`, `#software`, `#digital`, etc.

## Files

- `index.html`: page structure and native controls.
- `assets/portfolio.css`: workbench design and responsive layout.
- `assets/content.js`: both languages, disciplines, projects and experience.
- `assets/portfolio.js`: application coordination and the existing discipline demos.
- `assets/scroll-effects.js`: All journey and navigation observers.
- `assets/demos/workbench.js`: persistent SVG scenes for All, Firmware and Embedded Linux.

The private CV project holds the editable source and maintenance documentation. Copy `index.html` and the complete `assets/` directory together when updating this repository. GitHub Pages publishes the root of `main`; no build step or dependencies are required. Private CVs, references and application records are not included.

## Scroll and layout

All has a five-stage engineering journey: requirement → software ↔ simulation/emulation → hardware → software/hardware tests → documentation. On wide, tall screens its instrument stays visible while scrolling the steps. Manual controls take over until “Follow scroll” is enabled again. Small screens use a dedicated vertical illustration and manual controls. Project entries, the experience line and subtle instrument depth use native CSS scroll timelines where supported, with static fallbacks.

The CSS separates legacy scenes, shared tokens, layout, components, motion and accessibility into layers. Native ES modules require an HTTP server for local preview:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`; stop the server with Ctrl+C.

## Interactive laboratory

**Embedded:** Firmware illustrates cross-compilation, MCU programming, I²C acquisition, signal observation and a Python interface. Embedded Linux illustrates academic team work integrating an existing IMX477 camera driver on Jetson Nano, rebuilding the module and correcting its Bayer configuration. Both have step-by-step and play/pause controls. HEX preserves the seven-segment counter. These are illustrative scenes, not live measurements; technical context is expandable.

**Software:** reaction time (red → yellow → green, random wait0–3000ms, best time in page memory only) and Flappy with a red ball. Other views retain robotics, a1-bit ALU, control response, inspection and network failover illustrations.

Timed demonstrations start on request. Scroll-driven presentation and demonstrations respect reduced-motion preferences. View Transitions and container queries progressively enhance the basic page. No analytics or telemetry was added.

## Guidance

Implementation informed by [Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance), in particular scrollytelling, scroll entry effects, parallax, motion, same-document transitions, size-aware styling, responsive design and typography. Guidance documentation is CC-BY4.0. No CLI package is required at runtime.
