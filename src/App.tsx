import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MyAppsPage from "./pages/MyAppsPage";
import HtmlAppWrapper from "./pages/HtmlAppWrapper";

// Import registries for dynamic routing
import toolRegistry from "./lib/toolRegistry";
import { tsxModules } from "./lib/appRegistry";

const queryClient = new QueryClient();

// Loading component for lazy-loaded tools/apps
const ToolLoading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  </div>
);

// Helper to convert to kebab-case
const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
};

// Build TSX app routes - handles both single files and project folders
const tsxAppRoutes = Object.entries(tsxModules).map(([path, importFn]) => {
  // Check if it's a project folder (contains /index.tsx or /App.tsx)
  const isProjectFolder = path.includes('/index.tsx') || path.includes('/App.tsx');
  
  let routeId: string;
  if (isProjectFolder) {
    // For project folders: /src/apps/counter-app/index.tsx -> counter-app
    const parts = path.split('/');
    const folderName = parts[parts.length - 2];
    routeId = toKebabCase(folderName);
  } else {
    // For single files: /src/apps/HelloWorld.tsx -> hello-world
    const filename = path.split('/').pop()?.replace('.tsx', '') || 'unknown';
    routeId = toKebabCase(filename);
  }
  
  return {
    path: `/apps/${routeId}`,
    component: lazy(importFn),
  };
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<ToolLoading />}>
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
            
            {/* Dynamic TSX App Routes - Auto-detected from src/apps/ */}
            {tsxAppRoutes.map((route) => (
              <Route 
                key={route.path} 
                path={route.path} 
                element={<route.component />} 
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
  </QueryClientProvider>
);

export default App;
