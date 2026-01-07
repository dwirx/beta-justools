import { Suspense, lazy, ComponentType, memo, useMemo } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Home, Maximize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PWAUpdatePrompt from "./components/PWAUpdatePrompt";

// Lazy load pages for better initial load
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MyAppsPage = lazy(() => import("./pages/MyAppsPage"));
const HtmlAppWrapper = lazy(() => import("./pages/HtmlAppWrapper"));

// Import registries for dynamic routing
import toolRegistry from "./lib/toolRegistry";
import { tsxModules } from "./lib/appRegistry";

// Simple loading spinner
const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Helper to convert to kebab-case
const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
};

// Helper to convert to readable name
const toReadableName = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTO HEADER WRAPPER - Untuk TSX Apps
// ─────────────────────────────────────────────────────────────────────────────

interface AppWrapperProps {
  component: ComponentType;
  name: string;
  icon: string;
  routePath: string;
}

const AppWithHeader = memo(({ component: Component, name, icon, routePath }: AppWrapperProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if opened in standalone mode (new tab tanpa header)
  const isStandalone = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('standalone') === 'true';
  }, [location.search]);

  const handleOpenInNewTab = () => {
    window.open(`${location.pathname}?standalone=true`, '_blank');
  };

  // Jika standalone mode, render app saja tanpa header
  if (isStandalone) {
    return <Component />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Auto Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-3 py-2 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-8 px-2 gap-1 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="flex items-center gap-1.5">
            <span className="text-lg">{icon}</span>
            <h1 className="text-sm font-medium truncate max-w-[120px] sm:max-w-none">
              {name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenInNewTab}
            className="h-8 px-2 text-muted-foreground"
            title="Open in new tab"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>

          <Link to="/">
            <Button 
              variant="default" 
              size="sm"
              className="h-8 px-2.5 gap-1 text-xs"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Button>
          </Link>
        </div>
      </header>
      
      {/* App Content */}
      <div className="flex-1">
        <Component />
      </div>
    </div>
  );
});

AppWithHeader.displayName = 'AppWithHeader';

// ─────────────────────────────────────────────────────────────────────────────
// BUILD TSX APP ROUTES dengan Auto Header
// ─────────────────────────────────────────────────────────────────────────────

// Random icon generator (deterministic)
const getAutoIcon = (name: string): string => {
  const icons = ['🎮', '🎯', '🎲', '⚡', '🔥', '💎', '🎨', '🎵', '🚀', '✨', '💫', '🌟', '⭐', '🎪', '🎭'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash;
  }
  return icons[Math.abs(hash) % icons.length];
};

// Build TSX app routes - handles both single files and project folders
const tsxAppRoutes = Object.entries(tsxModules).map(([path, importFn]) => {
  const isProjectFolder = path.includes('/index.tsx') || path.includes('/App.tsx');
  
  let routeId: string;
  let displayName: string;
  
  if (isProjectFolder) {
    const parts = path.split('/');
    const folderName = parts[parts.length - 2];
    routeId = toKebabCase(folderName);
    displayName = toReadableName(folderName);
  } else {
    const filename = path.split('/').pop()?.replace('.tsx', '') || 'unknown';
    routeId = toKebabCase(filename);
    displayName = toReadableName(filename);
  }
  
  return {
    path: `/apps/${routeId}`,
    component: lazy(importFn),
    name: displayName,
    icon: getAutoIcon(displayName),
  };
});

const App = () => (
  <TooltipProvider delayDuration={300}>
    <Toaster />
    <PWAUpdatePrompt />
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Dynamic Tool Routes - Auto-generated from registry */}
          {toolRegistry.map((tool) => (
            <Route 
              key={tool.id} 
              path={`/${tool.id}`} 
              element={<tool.component />} 
            />
          ))}
          
          {/* Dynamic TSX App Routes - Auto-detected with Back & Home header */}
          {tsxAppRoutes.map((route) => (
            <Route 
              key={route.path} 
              path={route.path} 
              element={
                <AppWithHeader 
                  component={route.component} 
                  name={route.name}
                  icon={route.icon}
                  routePath={route.path}
                />
              } 
            />
          ))}

          {/* HTML App Wrapper - Apps with Back & Home header */}
          <Route path="/html-app/:appId" element={<HtmlAppWrapper />} />
          
          {/* My Apps */}
          <Route path="/myapps" element={<MyAppsPage />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
