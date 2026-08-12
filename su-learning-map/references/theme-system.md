# Theme system

## Why three files

A prose or JSON prompt alone is not a stable visual source of truth. Use three coordinated layers:

1. `theme.json` — semantic intent, suitability, tokens, and component policy;
2. `theme.css` — deterministic visual implementation;
3. reader `index.html` — stable information hierarchy and interaction hooks.

The build script reads `theme.json`, turns token values into CSS custom properties, and combines them with the fixed CSS and HTML shell.

## `wabi-reading`

Use for reflective books, philosophy, personal growth, long-form thinking, and quiet self-study.

Do not use by default for real-time dashboards, dense operational tools, children's learning, high-energy marketing, or data-heavy comparison products.

Visual contract:

- warm paper background, charcoal text, muted clay accent;
- serif display and reading faces; sans-serif controls;
- generous whitespace and restrained decoration;
- one dominant cover action;
- learning paths on the second screen;
- two-column reader on desktop;
- full-width reader and bottom controls on mobile;
- original-source block visually distinct but not louder than the concept;
- no rounded-card grid as the main learning structure.

## Extending themes

Create a sibling folder containing `theme.json` and `theme.css`. Keep DOM hooks unchanged. A new theme must pass the same desktop/mobile and interaction checks before it becomes callable.

