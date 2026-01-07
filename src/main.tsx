import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register PWA service worker
import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    console.log('SW registered:', swUrl);
    if (registration) {
      // Check for updates periodically
      setInterval(async () => {
        if (!(!registration.installing && navigator)) return;
        if ('connection' in navigator && !navigator.onLine) return;
        
        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: {
            'cache': 'no-store',
            'cache-control': 'no-cache',
          },
        });
        
        if (resp?.status === 200) {
          await registration.update();
        }
      }, 60 * 60 * 1000); // Check every hour
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

createRoot(document.getElementById("root")!).render(<App />);
