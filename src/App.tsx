import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MyAppsPage from "./pages/MyAppsPage";

// Import tool registry for dynamic routing
import toolRegistry from "./lib/toolRegistry";

const queryClient = new QueryClient();

// Loading component for lazy-loaded tools
const ToolLoading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground text-sm">Loading tool...</p>
    </div>
  </div>
);

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
