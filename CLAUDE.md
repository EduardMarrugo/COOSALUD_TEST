# Claude.MD - Next.js Frontend Development Guidelines

## RULES

- **NEVER** write code without concrete functionality
- **NEVER** mention Claude in commits
- **ALWAYS** apply ESLint + Prettier
- **ALWAYS** use TypeScript with strict typing on everything
- **ALWAYS** implement components with responsive design (Mobile First)
- **ALWAYS** use the custom `.ui-*` CSS classes for core UI elements (cards, buttons, tables) to maintain prototype consistency.
- **ALWAYS** extract reusable components to `src/components/ui/` or `src/components/layout/`
- **ALWAYS** use Lucide React for icons.
- **ALWAYS** separate views into their own route in the App Router (`app/[route]/page.tsx`).

## UI / STYLING PATTERN

This project is focused on **prototypes**. We use a hybrid styling approach:
1. **Global UI Classes (`.ui-*`)**: Provided in `app/globals.css`. Use these for primary layout structures, buttons, and panels to ensure the prototype matches the design system.
2. **Tailwind CSS**: Use utility classes for spacing, flexbox, grid, and specific overrides not covered by the `.ui-*` classes.

### Custom CSS Classes Available
- `.ui-btn`, `.ui-btn--primary`, `.ui-btn--outline`, `.ui-btn--ghost`
- `.ui-panel`, `.ui-panel__header`, `.ui-panel__body`, `.ui-panel__footer`
- `.ui-subcard`
- `.ui-form-grid`, `.ui-form-grid--cols-2`, etc.
- `.ui-field`, `.ui-field__label`, `.ui-field__value`
- `.ui-menu-item`, `.ui-status-dot`, `.ui-empty-state`, `.ui-table`

## PROJECT STRUCTURE

```
app/
├── globals.css           # Global styles and .ui-* classes
├── layout.tsx            # Root layout containing the Sidebar wrapper
├── page.tsx              # Main Dashboard view
└── autorizacion/
    └── page.tsx          # Specific prototype views
components/
├── layout/
│   ├── Sidebar.tsx       # Main aside navigation
│   └── MobileMenu.tsx    # Responsive navigation toggle
└── ui/                   # Shared UI components (Radix/shadcn)
```

## ROUTING & PROTOTYPES

When adding a new prototype:
1. Create a new folder in `app/` (e.g., `app/nuevo-prototipo/`).
2. Add a `page.tsx` inside.
3. Link the new prototype in the `Sidebar` and the Main `Dashboard` cards.

## RESPONSIVE DESIGN (MOBILE-FIRST)

All features **must** be fully responsive and tested on mobile screens. 
- Use Tailwind's responsive prefixes (`md:`, `lg:`) to adjust layouts, text sizes, and padding.
- Grids must collapse to a single column on mobile (`grid-cols-1 md:grid-cols-X`).
- Ensure navigation headers stack correctly (`flex-col md:flex-row`).
- Do not let tables overflow the screen; use wrappers with `overflow-x-auto`.
