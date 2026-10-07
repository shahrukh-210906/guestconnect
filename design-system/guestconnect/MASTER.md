# GuestConnect — modern minimal workspace

Direction: restrained SaaS administration interface. White cards on a slate background, one blue action accent, readable type, subtle borders, generous spacing. No decorative gradients, glass panels, or promotional illustrations.

Palette: text #0F172A, secondary text #64748B, background #F8FAFC, surface #FFFFFF, border #E2E8F0, primary #2563EB, selected navigation #EFF6FF. Status colors include explicit text labels.

Typography: DM Sans with system sans-serif fallback. Headings 28–32px, section titles 16px, content 12–14px, metadata 11–12px. Avoid the previous 8–10px body copy.

Interaction: visible blue focus indicators, consistent button and input shapes, keyboard-accessible dialogs, hover feedback and reduced-motion support. Mobile icon controls have 44px targets.

Responsive: four statistic cards on wide screens; two on tablets and phones. Split dashboard sections become single columns at 1150px. Navigation becomes a drawer on phones. Data tables retain horizontal scrolling to preserve legibility.

Skill references: UI/UX Pro Max SaaS design-system search recommended Plus Jakarta Sans, slate surfaces and blue accents. Its glassmorphism/marketing layout suggestions were not applied because the user's requested direction is minimal and this is an operational dashboard. React guidance supports controlled forms and accessible role/label queries.

Implementation: src/modern.css holds the current design layer; src/style.css supplies original component structure.

## Enhanced workspace
The current visual layer is src/premium.css: dark navy navigation and command panel, violet accents, richer cards, a readiness ring, network distribution bars, and saved preparation checklists. Functional status colors retain explicit labels. src/Enhancements.jsx computes metrics from actual guest and event records.


## Reference-led redesign (October 2026)
The supplied lavender and pastel mobile references now guide the workspace. Desktop uses a rounded horizontal navigation bar; mobile uses six labelled bottom-navigation destinations. A light lavender canvas, white 24px-radius cards, charcoal active pills, and muted violet primary actions replace the dark sidebar. A segmented semicircular readiness gauge uses actual confirmations and transport arrangements. Adjacent event actions take coordinators directly to pending invitations and transport. Pastel KPI cards, simplified guest lineup, and preparation tools establish a clear hierarchy without repeating the same event summary. Secondary text uses darker neutral violet to retain readability. Keyboard focus rings, reduced-motion support, printable transport sheets, and existing dialog focus handling remain supported.
