# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for "Better With You," a Cape Town events brand. The site features interactive visual effects including mouse-responsive fog animations, pulsing corner lights, and parallax effects to create a nightclub atmosphere.

## Running the Website

Can run a local web server:

```bash
# Recommended: Use the included Python server
python server.py

# Alternative: Python built-in server
python -m http.server 8000
```

Then navigate to `http://localhost:8000`

or launch directly from index.html

## Project Architecture

### File Structure

```
/workspace/
├── index.html           # Home page (root level)
├── pages/              # All other pages (about, events, gallery, artists, contact)
│   └── *.html          # Pages use relative paths (../) to reference assets
├── css/                # Modular stylesheets
│   ├── base.css        # Reset, body, grain overlay
│   ├── effects.css     # Fog canvas, corner lights, backgrounds
│   ├── navigation.css  # Hamburger menu, nav menu, overlay
│   └── layout.css      # Page layout, logo, sections
└── js/                 # Modular scripts
    ├── config.js       # Site configuration (pages list)
    ├── navigation.js   # Menu toggle and navigation logic
    └── effects.js      # Fog animation, cursor trail, lights, parallax
```

### Asset Path Conventions

- **Root pages** (`index.html`): Use direct paths (`css/`, `js/`, `pages/`)
- **Subpages** (`pages/*.html`): Use parent paths (`../css/`, `../js/`, `../index.html`)

When adding new pages or modifying paths, ensure consistency with these conventions.

### Visual Effects Architecture

**effects.js** manages three independent visual systems:

1. **Fog Animation System** (lines 1-255)
   - Canvas-based particle system with 120 `FogParticle` instances
   - Particles have drift movement, wrap-around edges, and mouse interaction
   - Mouse cursor clears fog in a 340px radius with push force
   - Cursor trail creates a persistent clearing effect (1.5s lifetime, 280px radius)
   - Fast mouse movement triggers interpolation to avoid gaps in trail

2. **Corner Light System** (lines 21-63)
   - Four corner lights with randomized pulse timing
   - Lights influence fog particle colors within 800px radius
   - Each light has RGB color values that blend into nearby fog
   - Autonomous pulsing cycle (1.5-3.5s intervals)

3. **Logo Parallax Effect** (lines 257-265)
   - 3D CSS transform based on mouse position
   - Creates subtle depth effect on `.logo-text` element

**Important:** These systems run independently. The fog canvas sits above all content (`z-index` layering via CSS) but is non-interactive (`pointer-events: none`).

### Navigation System

**Configuration-Based Navigation:**
- Navigation menu items are dynamically generated from `js/config.js`
- Edit `config.js` to add/remove pages from the site
- The system automatically handles correct paths for root vs subpages

**navigation.js** handles:
- Building navigation menu from config on page load
- Hamburger menu toggle (button + overlay click)
- Menu state classes (`.active` toggle)
- Hash link vs page navigation differentiation

The navigation overlay provides backdrop for the slide-out menu.

## Making Changes

### Managing Site Pages

**To add or remove pages from the navigation:**
1. Edit `js/config.js`
2. Add/remove/comment entries in the `siteConfig.pages` array
3. Each page needs:
   - `name`: Display name in navigation
   - `path`: Path from root (e.g., `pages/about.html`)
   - `relativePath`: Path from subpages (e.g., `about.html` or `../index.html` for home)

**Current release includes:** Home, About, Events, Contact
**Available but hidden:** Gallery, Artists (uncomment in config.js to enable)

### Adding New Visual Effects

When adding effects to `effects.js`:
- Maintain the three-system separation
- Use `requestAnimationFrame` for animations
- Clean up event listeners and intervals to prevent memory leaks
- Test performance with 120+ particles

### Adding New Pages

1. Create HTML file in `pages/` directory
2. Use `pages/about.html` as template (has correct relative paths)
3. Add entry to `js/config.js` in the `siteConfig.pages` array
4. Ensure all asset paths use `../` prefix
5. Include `<script src="../js/config.js"></script>` before navigation.js
6. Navigation menu will automatically include the new page

### Modifying Fog Behavior

Key fog parameters in `effects.js`:
- `particleCount`: Number of fog particles (line 187)
- `clearRadius`: Cursor clearing radius (line 102)
- `trailLifetime`: How long cursor trail persists (line 14)
- Particle size range: 150-350px (line 74)
- Opacity range: 0.25-0.6 (line 77)

### CSS Modifications

The CSS is modular:
- **base.css**: Touch only for global styles or fonts
- **effects.css**: Visual effect positioning and appearance
- **navigation.css**: Menu behavior and styling
- **layout.css**: Page structure and responsive design

## Testing

After making changes:
1. Always test with local server running
2. Test navigation between all pages (home ↔ subpages)
3. Verify fog interaction responds to mouse movement
4. Check corner lights pulse randomly
5. Test responsive behavior at mobile widths
6. Verify all external links (Instagram, SoundCloud, Tickets) work

## Known Constraints

- No build process or bundler (vanilla HTML/CSS/JS)
- No package.json or dependencies
- All effects run client-side with vanilla JavaScript
- Canvas performance may vary on low-end devices (120 particles)
