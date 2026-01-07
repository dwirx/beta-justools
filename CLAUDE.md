# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevTools Hub - A developer tools platform with auto-detection for both React (TSX) and HTML apps. Built with React 18, TypeScript, Vite, and Tailwind CSS using shadcn/ui components.

**Key Concept**: Apps are automatically discovered at build time using Vite's `import.meta.glob` - no manual registration needed. Just drop files in the right folders and restart the dev server.

## Common Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server on http://localhost:8080

# Build
npm run build        # Production build
npm run build:dev    # Development mode build

# Code Quality
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Architecture

### Dual App System

The project has **two separate app systems**:

1. **Homepage Tools** (`/src/pages/tools/`) - Manual registration in `toolRegistry.ts`
   - Shown on homepage (`/`)
   - Routes: `/{tool-id}` (e.g., `/json-formatter`)
   - Uses `ToolLayout` component wrapper

2. **My Apps** (`/src/apps/` and `/public/justhtml/`) - Auto-detected
   - Shown on `/myapps` page
   - TSX routes: `/apps/{app-id}` (e.g., `/apps/hello-world`)
   - HTML routes: `/justhtml/{filename}.html`

### Auto-Detection System

**TSX Apps** (`src/apps/`):
- Single files: `src/apps/HelloWorld.tsx` → auto-detected as `tsx-single`
- Project folders: `src/apps/counter-app/index.tsx` → auto-detected as `tsx-project`
- Alternative entry: `src/apps/my-app/App.tsx` also works
- Metadata: Export `appMeta` object from the main component file
- Registry: `src/lib/appRegistry.ts` scans using `import.meta.glob('/src/apps/*.tsx')` and `import.meta.glob('/src/apps/*/index.tsx')`

**HTML Apps** (`public/justhtml/`):
- Single files: `public/justhtml/calculator.html` → auto-detected as `html-single`
- Project folders: `public/justhtml/snake/index.html` → auto-detected as `html-project`
- Metadata: Add customization in `htmlCustomizations` object in `appRegistry.ts`
- Routes served directly by Vite as static files

**Important**: Apps are discovered at build time. Always restart dev server after adding/removing apps.

### Routing Architecture

All routing is centralized in `src/App.tsx`:
- Homepage tools: Auto-generated from `toolRegistry` array
- TSX apps: Auto-generated from `tsxModules` using `import.meta.glob`
- Static routes: `/` (Index), `/myapps` (MyAppsPage), `*` (NotFound)
- No manual route registration needed when adding new apps

### Component Patterns

**Tool Pages**: Use `ToolLayout` wrapper for consistent header/footer
```tsx
import ToolLayout from '@/components/ToolLayout';

const MyToolPage = () => (
  <ToolLayout
    toolName="Tool Name"
    toolIcon="🔧"
    toolDescription="Description"
  >
    {/* Tool content */}
  </ToolLayout>
);
```

**TSX Apps**: Include back navigation button
```tsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function MyApp() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background p-8">
      <Button variant="ghost" onClick={() => navigate('/myapps')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      {/* App content */}
    </div>
  );
}
```

**HTML Apps**: Must include navigation bar
```html
<nav class="nav-bar">
  <a href="/" class="nav-btn">🏠 Home</a>
  <a href="/myapps" class="nav-btn">← Back</a>
</nav>
```

### Styling System

**Use semantic color tokens** (defined in `tailwind.config.ts`):
- `bg-background` / `text-foreground` - Main background/text
- `bg-card` / `border-border` - Card backgrounds and borders
- `bg-primary` / `text-primary-foreground` - Primary actions
- `bg-muted` / `text-muted-foreground` - Subdued content
- `bg-accent` / `text-accent-foreground` - Accent highlights

**Never hardcode colors** like `bg-white`, `text-black`, `bg-gray-900` - they break theme consistency.

**Custom category colors** available: `bg-category-converter`, `bg-category-developer`, `bg-category-text`, `bg-category-image`, `bg-category-utility`

### State Management

- React Query (`@tanstack/react-query`) for async state - client configured in `App.tsx`
- Local state with `useState` for simple components
- No global state management (Redux/Zustand) - keep it simple
- Browser storage: Use `localStorage` for persistence in tools/apps

## Adding New Features

### Add a Homepage Tool

1. Create component: `src/pages/tools/MyToolPage.tsx`
2. Register in `src/lib/toolRegistry.ts`:
   ```ts
   {
     id: 'my-tool',              // URL slug
     name: 'My Tool',            // Display name
     description: 'Description', // Short description
     category: 'utility',        // converter | developer | text | image | utility
     icon: '🔧',                 // Emoji icon
     tags: ['keyword'],          // Search tags
     featured: false,            // Show on featured section
     component: lazy(() => import('@/pages/tools/MyToolPage')),
   }
   ```

### Add a TSX App (React)

**Single File**: Create `src/apps/MyApp.tsx`
```tsx
export const appMeta = {
  name: 'My App',
  description: 'Description',
  category: 'Tools' as const,  // Games | Tools | Productivity | Education | Entertainment | Other
  icon: '🚀',
  featured: false,
};

export default function MyApp() {
  // Component code
}
```

**Project Folder**: Create `src/apps/my-app/index.tsx` with same structure above

**Important**: Restart dev server to detect new apps

### Add an HTML App

**Single File**: Create `public/justhtml/my-app.html`

**Project Folder**: Create `public/justhtml/my-app/index.html`

**Customize metadata** in `src/lib/appRegistry.ts`:
```ts
const htmlCustomizations: Record<string, HtmlCustomization> = {
  'my-app': {  // Lowercase filename without extension
    name: 'My App',
    description: 'Description',
    category: 'Tools',
    icon: '🔧',
    featured: false,
  },
};
```

**Important**: Restart dev server to detect new apps

## Project Configuration

- **Vite config** (`vite.config.ts`): Dev server runs on port 8080, alias `@` points to `./src`
- **TypeScript**: Strict mode enabled, paths configured in `tsconfig.json`
- **Path alias**: `@/` maps to `src/` directory
- **Icons**: Using Lucide React (`lucide-react`) - import icons as components
- **Animations**: Framer Motion for page transitions and interactions
- **Forms**: React Hook Form with Zod validation via `@hookform/resolvers`

## Key Files

- `src/App.tsx` - Main app component with routing setup
- `src/lib/appRegistry.ts` - Auto-detection logic for TSX/HTML apps
- `src/lib/toolRegistry.ts` - Manual registration for homepage tools
- `src/lib/utils.ts` - Utility functions (includes `cn()` for className merging)
- `src/components/ToolLayout.tsx` - Reusable layout for tool pages
- `tailwind.config.ts` - Theme configuration with semantic tokens
- `vite.config.ts` - Vite build configuration

## Important Notes

- **Privacy-first**: All tools run client-side in the browser, no server calls
- **Mobile-responsive**: Use responsive Tailwind classes (`sm:`, `md:`, `lg:`)
- **Lazy loading**: All tools and apps are lazy-loaded for performance
- **Build-time detection**: Apps discovered via `import.meta.glob` at build time, not runtime
- **No test framework**: No test setup exists in this project
- **shadcn/ui components**: Located in `src/components/ui/`, installed via `components.json` config
