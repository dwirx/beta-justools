import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Tool Pages
import JsonFormatterPage from "./pages/tools/JsonFormatterPage";
import Base64EncoderPage from "./pages/tools/Base64EncoderPage";
import UuidGeneratorPage from "./pages/tools/UuidGeneratorPage";
import ColorConverterPage from "./pages/tools/ColorConverterPage";
import PasswordGeneratorPage from "./pages/tools/PasswordGeneratorPage";
import WordCounterPage from "./pages/tools/WordCounterPage";
import TextCasePage from "./pages/tools/TextCasePage";
import HashGeneratorPage from "./pages/tools/HashGeneratorPage";
import UrlEncoderPage from "./pages/tools/UrlEncoderPage";
import TimestampConverterPage from "./pages/tools/TimestampConverterPage";
import LoremGeneratorPage from "./pages/tools/LoremGeneratorPage";
import NumberBasePage from "./pages/tools/NumberBasePage";
import MyAppsPage from "./pages/MyAppsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Tool Routes */}
          <Route path="/json-formatter" element={<JsonFormatterPage />} />
          <Route path="/base64-encoder" element={<Base64EncoderPage />} />
          <Route path="/uuid-generator" element={<UuidGeneratorPage />} />
          <Route path="/color-converter" element={<ColorConverterPage />} />
          <Route path="/password-generator" element={<PasswordGeneratorPage />} />
          <Route path="/text-counter" element={<WordCounterPage />} />
          <Route path="/text-case" element={<TextCasePage />} />
          <Route path="/hash-generator" element={<HashGeneratorPage />} />
          <Route path="/url-encoder" element={<UrlEncoderPage />} />
          <Route path="/timestamp-converter" element={<TimestampConverterPage />} />
          <Route path="/lorem-generator" element={<LoremGeneratorPage />} />
          <Route path="/number-base" element={<NumberBasePage />} />
          
          {/* My Apps */}
          <Route path="/myapps" element={<MyAppsPage />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
