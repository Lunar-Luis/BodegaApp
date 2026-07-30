---
name: Tú Bodega Online
colors:
  surface: '#fdf7ff'
  surface-dim: '#ded5fd'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f1ff'
  surface-container: '#f2ebff'
  surface-container-high: '#ece4ff'
  surface-container-highest: '#e7deff'
  on-surface: '#1d1735'
  on-surface-variant: '#4a4456'
  inverse-surface: '#322c4b'
  inverse-on-surface: '#f5eeff'
  outline: '#7c7488'
  outline-variant: '#ccc2d9'
  surface-tint: '#7620f1'
  primary: '#5f00ce'
  on-primary: '#ffffff'
  primary-container: '#7a28f5'
  on-primary-container: '#e7d8ff'
  inverse-primary: '#d3bbff'
  secondary: '#006686'
  on-secondary: '#ffffff'
  secondary-container: '#45c8fd'
  on-secondary-container: '#00516c'
  tertiary: '#910060'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc007d'
  on-tertiary-container: '#ffd3e4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ebddff'
  primary-fixed-dim: '#d3bbff'
  on-primary-fixed: '#250059'
  on-primary-fixed-variant: '#5b00c5'
  secondary-fixed: '#c0e8ff'
  secondary-fixed-dim: '#70d2ff'
  on-secondary-fixed: '#001e2b'
  on-secondary-fixed-variant: '#004d66'
  tertiary-fixed: '#ffd8e7'
  tertiary-fixed-dim: '#ffafd3'
  on-tertiary-fixed: '#3d0026'
  on-tertiary-fixed-variant: '#8b005b'
  background: '#fdf7ff'
  on-background: '#1d1735'
  surface-variant: '#e7deff'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  price-primary:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 22px
  price-secondary:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  safe-area-bottom: 80px
---

## Brand & Style
The design system is engineered for the high-energy, fast-paced environment of Venezuelan local commerce. The brand personality is **Energetic, Friendly, and Playful**, utilizing a "sticker-style" aesthetic to evoke the familiar feeling of physical price tags and shop window decals.

The visual style blends **Modern Minimalism** with **Tactile/Sticker** elements. It prioritizes high-contrast legibility for shop owners who need to manage inventory and sales with one hand, often in bright or cluttered environments. The interface uses "White Sticker" elements—pure white surfaces with subtle outlines—layered over a warm lilac background to create depth without visual noise.

## Colors
The palette is centered around a high-vibrancy **Vibrant Violet** to project modern tech-savviness, paired with **Electric Cyan** for accents. 

- **Primary & Secondary:** Used for branding, hero states, and navigation highlights.
- **Key Action (Sell):** Hot Magenta is reserved exclusively for the "Vender" action to ensure it stands out as the most important function in the app.
- **Hierarchy:** Deep Indigo is used for primary text to maintain high contrast against the Warm Lilac-White background. 
- **Gradients:** Apply the Purple-to-Blue gradient only to hero cards and the primary "Vender" button background.

## Typography
The typography strategy differentiates between brand expression and functional data.

- **Headlines:** Uses **Plus Jakarta Sans** for a friendly, rounded geometric feel that aligns with the sticker aesthetic.
- **Body:** Uses **Inter** for maximum clarity and utility in lists and forms.
- **Pricing:** Uses **JetBrains Mono** (Tabular Numbers) to ensure that currency values align perfectly in lists, making it easier for owners to compare prices at a glance.
- **Dual Currency Rule:** USD is always primary (Bold, Primary Text Color). Bs. (Bolívares) is secondary (Regular, Muted Gray, smaller size) placed immediately below or beside the USD value.

## Layout & Spacing
This is a **mobile-first PWA** layout utilizing a fluid 1-column system with a 16px gutter. 

- **Tap Targets:** Every interactive element (buttons, list items, checkboxes) must have a minimum height of 48px to accommodate fast, one-handed operation.
- **Bottom Navigation:** A fixed bar at the bottom contains 5 slots. The center slot ("Vender") is elevated and larger than the others.
- **Safe Areas:** Ensure content does not sit behind the elevated "Vender" button or the device notch. Use 24px horizontal padding for main container cards to ensure a "sticker" look that doesn't hit the screen edges.

## Elevation & Depth
Depth is created through "Soft Glows" rather than traditional gray shadows.

- **Level 1 (Cards):** Pure white background with a 1px #E9E1FB border and a very soft, diffused violet shadow (e.g., `0px 4px 20px rgba(122, 40, 245, 0.08)`).
- **Level 2 (Active/Floating):** Used for the bottom nav and active "Vender" button. A stronger violet glow to signify interactivity.
- **Sticker Effect:** White elements should appear "applied" to the lilac background. Use a crisp 1px border in a slightly darker lilac to define the sticker edge.

## Shapes
The shape language is dominated by high-radius curves to maintain the friendly, approachable brand voice.

- **Cards & Containers:** Use a consistent 20px (range 18-22px) corner radius.
- **Buttons & Chips:** All buttons are fully pill-shaped (rounded-full).
- **Hero Cards:** May feature "bubble" or "droplet" textures in the background to add a playful, organic feel to the top of the dashboard.

## Components
- **Primary Buttons:** Pill-shaped, using the Primary Gradient for "Vender" or Solid Vibrant Violet for other primary actions. Text is always white and centered.
- **Sticker Cards:** Pure white containers with 20px rounded corners. Used for product items, daily summaries, and history logs.
- **Action Chips:** Small pill-shaped tags used for categories (e.g., "Alimentos", "Bebidas"). Use light violet backgrounds with dark violet text.
- **Product List Items:** High-density rows with a thumbnail (20% radius), Product Name (Body-lg), and Dual Currency Pricing (Tabular Mono) aligned to the right.
- **Bottom Navigation:** A persistent frosted-glass or solid white bar. The "Vender" icon is a large circle with the Magenta-to-Purple gradient, positioned in the center, protruding slightly above the bar's top edge.
- **Input Fields:** Large 56px height fields with 12px rounded corners and a subtle lilac stroke that turns Vibrant Violet on focus.