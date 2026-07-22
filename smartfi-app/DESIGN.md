---
name: SmartFi
colors:
  surface: '#f6faff'
  surface-dim: '#d4dbe3'
  surface-bright: '#f6faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf4fc'
  surface-container: '#e8eff7'
  surface-container-high: '#e2e9f1'
  surface-container-highest: '#dce3eb'
  on-surface: '#151c22'
  on-surface-variant: '#414751'
  inverse-surface: '#2a3137'
  inverse-on-surface: '#eaf1f9'
  outline: '#717783'
  outline-variant: '#c1c7d3'
  surface-tint: '#0060ac'
  primary: '#0060ac'
  on-primary: '#ffffff'
  primary-container: '#60a5fa'
  on-primary-container: '#003a6b'
  inverse-primary: '#a4c9ff'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#6d3bd7'
  on-tertiary: '#ffffff'
  tertiary-container: '#b090ff'
  on-tertiary-container: '#4600a7'
  error: '#EF4444'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a4c9ff'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#004883'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#f6faff'
  on-background: '#151c22'
  surface-variant: '#dce3eb'
  background-main: '#F0F7FF'
  surface-white: '#FFFFFF'
  sidebar-hover: '#DBEAFE'
  text-heading: '#1E293B'
  text-body: '#475569'
  border-default: '#E2E8F0'
  success: '#10B981'
  warning: '#F59E0B'
typography:
  headline-h1:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
  headline-h1-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-h2:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-xs:
    fontFamily: Inter
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
  margin-page: 2rem
  margin-mobile: 1rem
  gutter: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 1.5rem
---

## Brand & Style
The design system is built for a personal finance management and AI mentoring application. The brand personality is dependable, approachable, and intelligent, aiming to evoke a sense of financial clarity and proactive control.

The chosen design style is **Corporate / Modern**, leaning into a clean, systematic interface that prioritizes data legibility and user trust. The aesthetic uses a soft, airy background to reduce "financial anxiety," while crisp, rounded containers provide a structured and organized environment for complex information. The interface is characterized by generous white space, consistent elevation for interactive surfaces, and a professional balance of functional color accents.

## Colors
This design system utilizes a palette centered on clarity and hierarchy. The primary brand color, **Biru Muda (#60A5FA)**, is used for primary actions and focus states.

- **Primary & Secondary:** Used for buttons and high-impact UI elements.
- **Background & Surface:** The application uses a "Biru Sangat Muda" background (#F0F7FF) to differentiate the canvas from white surface containers (cards, sidebars, and forms).
- **Functional Colors:** Green, Red, and Yellow are strictly reserved for financial statuses (Income, Expense, and Pending/Warning) and system feedback.
- **Text Layers:** Headings utilize a deep slate (#1E293B) for high contrast, while body text uses a softer gray (#475569) to reduce visual fatigue during long sessions.

## Typography
The system uses **Inter** exclusively to maintain a highly legible, modern, and systematic appearance.

- **Headlines:** Use Bold weights for H1 to establish immediate page context. H2 titles use Semibold weights to distinguish sections.
- **Body:** Standard body text is set to `14px` or `16px` depending on the data density required.
- **Labels:** Button text and small widget labels utilize Medium weights to ensure clarity at smaller scales.
- **Hierarchy:** Contrast is created primarily through weight and color (Heading vs. Body colors) rather than extreme size shifts.

## Layout & Spacing
The design system follows a **Fixed Grid** philosophy for desktop layouts to ensure financial data remains centered and legible on ultra-wide screens, while transitioning to a fluid layout for mobile devices.

- **Desktop Layout:** Features a fixed-width left sidebar (approx. 260px) with a scrollable main content area. Content is organized in a 12-column grid.
- **Breakpoints:**
  - **Mobile (< 768px):** Sidebar collapses into a bottom navigation bar or a hamburger menu. Margins are reduced to 16px.
  - **Tablet (768px - 1024px):** Sidebar may collapse into an icon-only rail to maximize space for charts.
  - **Desktop (> 1024px):** Full sidebar and multi-column card layouts for dashboards.
- **Spacing Rhythm:** Use a consistent 4px/8px base unit. Gutters between dashboard cards are set to 24px (1.5rem) to provide clear visual separation.

## Elevation & Depth
This design system uses a combination of **Tonal Layers** and **Ambient Shadows** to create a structured hierarchy.

- **Level 0 (Background):** The "Biru Sangat Muda" (#F0F7FF) surface acts as the furthest back layer.
- **Level 1 (Surfaces):** White (#FFFFFF) cards and the sidebar sit on top of the background. These elements use a `shadow-md` specification (a soft, neutral gray shadow with a 12-15px blur radius and low opacity) to suggest they are liftable and interactive.
- **Interactive States:** Buttons and clickable cards may transition to a slightly deeper shadow or a subtle scale-up effect (1-2%) on hover to provide tactile feedback.
- **Separators:** In place of heavy shadows for internal card elements, use 1px borders (#E2E8F0) to maintain a clean, flat appearance within the lifted containers.

## Shapes
The shape language is defined by a consistent **Rounded-XL** application across all major containers.

- **Cards & Modals:** Use the standard `rounded-xl` (1rem / 16px) to evoke a friendly and approachable feel.
- **Buttons & Inputs:** Follow the same roundedness for consistency, though smaller elements like tags/chips may use a "Pill" shape to distinguish them from actionable buttons.
- **Focus States:** Highlighting should follow the border-radius of the parent element, maintaining the soft-rectilinear aesthetic.

## Components
- **Buttons:** Primary buttons use a solid `#60A5FA` fill with white text and `rounded-xl` corners. On hover, they shift to `#3B82F6`. Secondary buttons use a white background with a `#60A5FA` border.
- **Cards:** All cards are white with `shadow-md` and `rounded-xl`. Padding inside cards should be a minimum of `1.5rem`.
- **Form Fields:** Inputs feature a `#E2E8F0` border and a `#FFFFFF` background. On focus, the border shifts to the primary `#60A5FA` with a subtle outer glow.
- **Sidebar Items:** Hover states use the `Biru Transparan` (#DBEAFE) with a vertical accent bar on the left edge in the primary color to indicate the active page.
- **Status Chips:** Use a soft-colored background (low opacity version of success/error/warning) with high-contrast text of the same hue for clear status communication.
- **Progress Bars:** Use `#E2E8F0` for the track and the functional colors (Green/Primary/Yellow) for the fill to indicate budget health.
