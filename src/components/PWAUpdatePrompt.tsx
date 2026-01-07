import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PWA Update Prompt Component
 * Menampilkan notifikasi saat ada update baru tersedia
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

  // Handle install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismissInstall = () => {
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
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[100]"
          >
            <div className="bg-card border border-border rounded-xl shadow-2xl p-4 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Download className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">Install DevTools Hub 📱</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Install app ini untuk akses cepat & offline support.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={handleInstall} className="h-8 text-xs">
                      <Download className="w-3 h-3 mr-1.5" />
                      Install
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleDismissInstall} className="h-8 text-xs">
                      Tidak
                    </Button>
                  </div>
                </div>
                <button
                  onClick={handleDismissInstall}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
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
