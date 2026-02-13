# GPTKids Design System Documentation

## Overview
The GPTKids design system is built to support two distinct "moods" within a single application:
1.  **Kid Mood**: Playful, colorful, large touch targets, soft shapes (Border Radius: 1rem+).
2.  **Parent/Admin Mood**: Clean, trustworthy, SaaS-like, professional (Border Radius: 0.5rem - 1rem).

## Design Tokens

### Colors (Tailwind)
The system uses semantic color names that map to CSS variables.

| Token | Description | Kid Mode Usage | Parent Mode Usage |
| :--- | :--- | :--- | :--- |
| `primary` | Brand Blue | Main buttons, highlights | Primary actions, links |
| `secondary` | Slate 100 | Backgrounds, secondary buttons | Secondary actions, muted areas |
| `accent` | Blue 50 | - | Active states, subtle highlights |
| `muted` | Slate 100/400 | - | Subtext, disabled states |
| `kid.blue` | Soft Blue | Primary elements, cards | - |
| `kid.pink` | Soft Pink | Secondary elements, avatars | - |
| `kid.yellow` | Soft Yellow | Highlights, stars, rewards | - |
| `kid.green` | Soft Green | Success, safety indicators | - |

### Typography
**Font Family**: `Vazirmatn` (Persian/Arabic support).
- **Headings**: Bold/ExtraBold, tight tracking.
- **Body**: Regular/Medium, relaxed line-height for readability.

### Spacing & Layout
- **Container**: Centered, max-width 1400px.
- **Grid System**: 12-column equivalent using Flex/Grid.
- **Spacing Scale**: Standard Tailwind spacing (rem-based).

### Animation
- `animate-in`: Used for page transitions.
- `hover:scale-105`: Subtle zoom for interactive kid elements.
- `floaty`: Gentle floating animation for mascots.

## Component Usage Guidelines

### Buttons
- **Kid**: `h-12` or `h-14`, `rounded-2xl`, distinct colors (Pink/Blue/Yellow).
- **Parent**: `h-10`, `rounded-lg`, standard shadcn variants.

### Cards
- **Kid**: bright backgrounds (`bg-white/80`), heavy shadows (`shadow-soft`), large padding.
- **Parent**: white background, subtle border, standard padding.

### Forms
- **Validation**: Inline error messages (Red).
- **Labels**: Always visible, bold for parents.
- **Input Fields**: `h-10` (Parent) vs `h-12` (Kid Login).
