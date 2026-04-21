---
name: Apex Futurist
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#d3fbff'
  on-secondary: '#00363a'
  secondary-container: '#00eefc'
  on-secondary-container: '#00686f'
  tertiary: '#ffffff'
  on-tertiary: '#5b005b'
  tertiary-container: '#ffd7f5'
  on-tertiary-container: '#b300b3'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#7df4ff'
  secondary-fixed-dim: '#00dbe9'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#ffd7f5'
  tertiary-fixed-dim: '#ffabf3'
  on-tertiary-fixed: '#380038'
  on-tertiary-fixed-variant: '#810081'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-xl:
    fontFamily: Lexend
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Lexend
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-margin: 24px
  grid-gutter: 16px
---

## Brand & Style
The design system is engineered for elite athletes and media professionals who operate at the intersection of performance and production. The brand personality is aggressive, hyper-technical, and premium, evoking the feeling of a high-end command center or a futuristic HUD.

The visual style is a hybrid of **Glassmorphism** and **Tactile/3D** elements. It utilizes deep layering to create a sense of vast digital space. By combining frosted textures with high-energy neon accents, the UI transitions between an athletic training tool and a sophisticated cinematic suite. The emotional response is one of "focused power"—where every interaction feels deliberate, tactile, and high-stakes.

## Colors
The palette is rooted in an absolute "Ink Black" (#050505) to ensure infinite depth and maximum contrast for neon accents.

- **TRAINING (Neon Lime):** Used for energy, movement tracking, and performance metrics.
- **SHOOTING (Electric Cyan):** Reserved for camera controls, media playback, and recording states.
- **PROJECT (Magenta/Purple):** Applied to contracts, offer management, and professional networking.

Functional colors use the same high-vibrancy logic: Success is tied to the Training Lime, while Warnings use a high-saturation Orange (#FFB800). All interactive elements feature a "glow" state using their respective section color with a 20-40% opacity blur.

## Typography
Lexend is utilized across all levels to maintain a cohesive, athletic, and highly readable feel. 

- **Headlines:** Use Bold (700) or ExtraBold (800) for section titles. In the Training section, use italicized headers to imply speed.
- **Body:** Use Regular (400) weights. The generous x-height of Lexend ensures legibility against dark, blurred backgrounds.
- **Labels:** Use the `label-caps` style for technical data points and metadata to mimic the look of an instrumentation panel.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for desktop and a 4-column structure for mobile. 

- **Technical Grids:** In the Training section, background patterns should include a subtle 32px repeating grid line in `rgba(204, 255, 0, 0.05)` to emphasize the "scientific" nature of the data.
- **Safe Areas:** All containers use a 24px internal padding (lg) to allow the glassmorphism effects enough "breathing room" to show the background blur.
- **Rhythm:** Use a strict 4px base unit for all component heights and spacing.

## Elevation & Depth
Depth is the core differentiator of this design system. It is achieved through three specific layers:

1.  **The Void (Base):** The #050505 background.
2.  **Frosted Plates (Mid):** Containers using `backdrop-filter: blur(20px)` and a thin 1px border. The border should have a linear gradient from top-left (brighter) to bottom-right (subtle) to simulate a light source.
3.  **Active Elements (Top):** Floating 3D buttons and cards. These use a "Matte Glass" effect—higher opacity than the plates, with a soft inner glow and a drop shadow that matches the accent color of the section (e.g., a cyan shadow for Shooting components).

Use Z-index layering to stack these plates, creating a "deck of glass" appearance for complex dashboards.

## Shapes
The shape language is "Advanced Geometric." Standard containers use a 1rem (16px) corner radius to feel modern but structured. 

For 3D buttons, use a slightly more aggressive rounding (rounded-lg) to make them feel like physical "pills" of glass. Elements in the Training section may use "clipped corners" (45-degree chamfers) on decorative grid elements to reinforce the technical/tactical aesthetic.

## Components

### 3D Matte Glass Buttons
Buttons are the primary interactive element. They feature:
- A semi-opaque background color.
- A 1px "highlight" top border.
- A 2px "shadow" bottom border in a darker shade of the accent color.
- A soft outer glow (15px blur) that activates on hover.
- On click, the button should translate 2px downward on the Y-axis to simulate a physical press.

### Performance Chips
Small, high-contrast labels used for status or data categories. In the Training section, these should include a small "pulse" animation dot next to the text.

### Frosted Cards
Containers for media or data. They should have no solid background; only the backdrop blur and a thin white-to-transparent gradient stroke.

### Specialized Components
- **The HUD Overlay:** A transparent layer for the Shooting section that overlays camera metadata (ISO, Shutter, Frame Rate) in Lexend Bold Caps.
- **The Offer Blade:** A slide-out panel for the Project section using a deep Purple glass gradient to distinguish business actions from production tasks.
- **Technical Progress Bars:** Multi-segment bars that fill with the section's accent color, using a "glow" effect on the leading edge of the progress.