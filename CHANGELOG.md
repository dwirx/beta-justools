# Changelog

All notable changes to DevTools Hub will be documented in this file.

---

## [1.1.0] - 2026-01-07

### 🚀 Performance Improvements

#### React Optimizations
- Added `useCallback` for event handlers (`handleSearchChange`, `handleSearchClear`, `setActiveTab`)
- Applied `memo()` to all major components (Header, Hero, UnifiedCard, UnifiedGrid, Skeleton)
- Implemented lazy loading for pages using `React.lazy()` (Index, NotFound, MyAppsPage, HtmlAppWrapper)

#### Index Page Optimizations
- Simplified scroll handling - only saves on `beforeunload` instead of every scroll event
- Reduced Hero component DOM nodes - changed from 4-column grid to inline flex
- Reduced loading timeout from 100ms to 50ms
- Removed unnecessary `transition-colors` from input elements

#### Build Optimizations
- Set `minify: 'esbuild'` for faster builds
- Enabled `cssCodeSplit: true` for per-chunk CSS splitting
- Disabled sourcemaps in production (`sourcemap: false`)
- Added manual chunks: `react-core`, `react-router`, `ui-core`

#### Initial Load Improvements
- Added inline critical CSS in `index.html` for instant first paint
- Added inline loading spinner before React mounts
- Added DNS prefetch for CDN resources

### 🎨 UI/UX Improvements

#### PWA Install Prompt
- Added "Don't show today" button to PWA install prompt
- Uses localStorage to remember dismissal until midnight

#### Responsive Design
- Improved responsive design for all device sizes (mobile, tablet, desktop)
- Added custom `xs` breakpoint at 480px
- Fixed layout overlap issues
- Simplified Header mobile menu

#### Accessibility
- Added `@media (prefers-reduced-motion)` support
- Added `@media (hover: hover)` for touch-friendly interactions
- Improved focus states for keyboard navigation

### 🐛 Bug Fixes
- Fixed `Globe is not defined` error - restored missing lucide-react imports
- Fixed layout "berantakan" (broken/overlapping) issues
- Removed heavy framer-motion animations causing render issues
- Fixed z-index conflicts in sticky elements

### 🔧 Code Quality
- Removed unused QueryClientProvider and Sonner toast wrapper
- Cleaned up unused imports
- Added `displayName` to memoized components for better debugging

### 📦 Build Results
- Main JS: ~181KB (61KB gzipped)
- React core: ~140KB (45KB gzipped)
- Total precache: ~872KB
- Build time: ~21 seconds

---

## [1.0.0] - Initial Release

### Features
- Developer Tools collection (Base64, JSON Formatter, Hash Generator, etc.)
- Auto-detected React/TSX Apps from `src/apps/`
- Auto-detected HTML Apps from `public/justhtml/`
- PWA support with offline capability
- Dark theme UI
- Search and filter functionality
- Responsive grid layout
