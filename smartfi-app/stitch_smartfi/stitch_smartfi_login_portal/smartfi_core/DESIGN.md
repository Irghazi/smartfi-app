---
name: SmartFi Core
colors:
  surface: '#f9f9ff'
  surface-dim: '#d2daee'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e8eeff'
  surface-container-high: '#e0e8fd'
  surface-container-highest: '#dbe2f7'
  on-surface: '#141c2a'
  on-surface-variant: '#414754'
  inverse-surface: '#293140'
  inverse-on-surface: '#ecf0ff'
  outline: '#727785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005bc0'
  primary: '#0058bc'
  on-primary: '#ffffff'
  primary-container: '#0a70e9'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#006c52'
  on-secondary: '#ffffff'
  secondary-container: '#72f7cb'
  on-secondary-container: '#007056'
  tertiary: '#745800'
  on-tertiary: '#ffffff'
  tertiary-container: '#936f00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#75f9ce'
  secondary-fixed-dim: '#56ddb3'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#00513d'
  tertiary-fixed: '#ffdf9a'
  tertiary-fixed-dim: '#f4bf2f'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5a4300'
  background: '#f9f9ff'
  on-background: '#141c2a'
  surface-variant: '#dbe2f7'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  margin-desktop: 40px
  margin-mobile: 20px
  gutter: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for a fintech platform that balances high-tech intelligence with approachable reliability. It targets a modern audience that values financial clarity and efficient digital experiences.

The style is **Corporate / Modern** with a touch of **Minimalism**. It prioritizes a clean, "breathable" interface where white space serves as a functional element to reduce cognitive load during sensitive financial tasks. The aesthetic is defined by its mathematical precision—perfectly rounded corners, a structured grid, and a sophisticated use of blue to instill a sense of security and professional maturity.

The emotional response should be one of "effortless control." Users should feel that their data is secure, the platform is intelligent, and the navigation is intuitive.

## Colors

The palette is derived directly from the brand’s visual identity, utilizing a vibrant "Trust Blue" as the primary driver for actions and brand recognition.

- **Primary (#257BF4):** Used for primary buttons, active states, and key brand highlights.
- **Secondary (#12B18A):** Borrowed from the growth chart in the logo, this green is reserved for positive financial indicators, success states, and growth-related metrics.
- **Tertiary (#F9C333):** A warm gold used sparingly for alerts, warnings, or premium feature callouts, inspired by the coin element.
- **Neutral (#1C2433):** A deep charcoal-blue for maximum legibility in text and iconography, avoiding the harshness of pure black.
- **Backgrounds:** A predominantly white and light-gray (`#F8FAFC`) canvas to maintain a "fresh" and professional appearance.

## Typography

The design system utilizes **Manrope** across all levels. This font was selected for its geometric yet modern grotesque characteristics, making it exceptionally legible for financial data while appearing friendly and contemporary.

Headlines use a bold weight with slightly tightened letter-spacing to create a strong visual anchor. Body text remains at a generous line height to ensure readability in data-heavy views. For mobile, headline scales are slightly reduced to ensure that login headers and titles do not push critical form fields off-screen.

## Layout & Spacing

This design system follows a **Fluid Grid** model with a hard-set maximum width for desktop containers to ensure content remains centered and readable. 

- **Desktop:** A 12-column grid with 24px gutters. For the login page, content is typically constrained to a 4-6 column central card.
- **Mobile:** A 4-column grid with 20px side margins. 
- **Rhythm:** An 8px linear scale is used for all internal component spacing (padding, margins, and gaps). This ensures a consistent vertical and horizontal rhythm throughout the UI. 

Login forms should use "stacking" logic where input fields are separated by 24px, while labels and their corresponding inputs are kept close with an 8px gap.

## Elevation & Depth

Visual hierarchy is established through **Ambient Shadows** and **Tonal Layers**. 

The primary interface container (e.g., the login card) sits on the highest elevation, using a very soft, multi-layered shadow: `0 20px 25px -5px rgba(28, 36, 51, 0.05), 0 10px 10px -5px rgba(28, 36, 51, 0.02)`. This creates a sense of the interface floating naturally over the background without being distracting.

Secondary elements, such as dropdown menus or tooltips, use a tighter shadow with a slightly higher opacity to indicate focus. Buttons utilize a subtle "pressed" transition where elevation decreases upon interaction to provide tactile feedback.

## Shapes

The shape language is strictly **Rounded**. This mirrors the friendly character design in the logo.

All primary components like buttons and input fields use a `0.5rem` (8px) radius. Larger layout containers, such as the login card or dashboard panels, utilize `1rem` (16px) or `1.5rem` (24px) to soften the overall appearance of the application. Pill-shapes are used exclusively for status chips or notification badges to distinguish them from actionable buttons.

## Components

- **Buttons:** Primary buttons are solid Blue (#257BF4) with white text. Secondary buttons use a subtle ghost style with a 1px border. All buttons have a height of 48px for mobile-friendly tap targets.
- **Input Fields:** Outlined style using a light-gray border that shifts to Primary Blue on focus. Labels are positioned above the field in `label-md` weight. Error states use a high-contrast red border with a helper message below.
- **Cards:** The login card is the centerpiece. It should be white, centered, with `rounded-xl` corners and the signature ambient shadow. 
- **Checkboxes:** Square with a `4px` corner radius. When checked, they fill with Primary Blue and display a white checkmark.
- **Chips/Badges:** Used for "Remember Me" status or security indicators. They utilize low-opacity versions of the brand colors (e.g., 10% opacity blue background with 100% blue text).
- **Icons:** Use thin-stroke, rounded-end icons to match the Manrope typeface.