import { useEffect, useState, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X, Download, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Storage key for dismissal
const INSTALL_DISMISSED_KEY = 'pwa_install_dismissed_until';

/**
 * PWA Update Prompt Component
 * Menampilkan notifikasi saat ada update baru tersedia
 * Dengan fitur "Don't show today" untuk install prompt
 */
export const PWAUpdatePrompt = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('SW Registered:', registration);
      // Check for updates every 1 hour
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  // Check if install prompt should be shown based on dismissal time
  const shouldShowInstallPrompt = useCallback(() => {
    const dismissedUntil = localStorage.getItem(INSTALL_DISMISSED_KEY);
    if (!dismissedUntil) return true;
    
    const dismissedTime = parseInt(dismissedUntil, 10);
    return Date.now() > dismissedTime;
  }, []);

  // Handle install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Only show if not dismissed for today
      if (shouldShowInstallPrompt()) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [shouldShowInstallPrompt]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        // Clear any dismissal when user installs
        localStorage.removeItem(INSTALL_DISMISSED_KEY);
      }
      setDeferredPrompt(null);
    }
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  // Simple dismiss - just hides for now
  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
  };

  // Don't show today - saves timestamp until end of day
  const handleDontShowToday = () => {
    // Set to end of today (midnight)
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    localStorage.setItem(INSTALL_DISMISSED_KEY, endOfDay.getTime().toString());
    setShowInstallPrompt(false);
  };

  const handleDismissUpdate = () => {
    setNeedRefresh(false);
  };

  return (
    <>
      {/* Update Available Prompt */}
      <AnimatePresence>
        {needRefresh && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[100]"
          >
            <div className="bg-card border border-border rounded-xl shadow-2xl p-4 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">Update Tersedia! 🎉</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Versi baru sudah siap. Refresh untuk mendapatkan fitur terbaru.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={handleUpdate} className="h-8 text-xs">
                      <RefreshCw className="w-3 h-3 mr-1.5" />
                      Update Sekarang
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleDismissUpdate} className="h-8 text-xs">
                      Nanti
                    </Button>
                  </div>
                </div>
                <button
                  onClick={handleDismissUpdate}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[420px] z-[100]"
          >
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-border rounded-2xl shadow-2xl p-5 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base sm:text-lg">Install DevTools Hub 📱</h4>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    Install app ini untuk akses cepat & offline support.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button 
                      size="sm" 
                      onClick={handleInstall} 
                      className="h-9 text-sm font-medium px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Install
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleDontShowToday} 
                      className="h-9 text-sm px-3"
                    >
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      Jangan tampilkan hari ini
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={handleDismissInstall} 
                      className="h-9 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Tidak
                    </Button>
                  </div>
                </div>
                <button
                  onClick={handleDismissInstall}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 -mt-1 -mr-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PWAUpdatePrompt;
