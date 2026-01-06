// =============================================================
// CONTOH APP TSX - Auto-detected!
// =============================================================
// File ini otomatis terdeteksi dan muncul di My Apps
// Cukup export default component dan appMeta (opsional)
// =============================================================

import { motion } from 'framer-motion';

// Metadata opsional - jika tidak ada, akan auto-generate dari nama file
export const appMeta = {
  name: 'Hello World',
  description: 'Contoh app TSX yang auto-detected',
  category: 'Education' as const,
  icon: '👋',
  featured: true,
};

const HelloWorld = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center shadow-2xl border border-white/20"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl md:text-8xl mb-6"
        >
          👋
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Hello World!
        </h1>
        
        <p className="text-white/80 text-lg md:text-xl mb-6">
          Ini adalah contoh app TSX yang auto-detected
        </p>
        
        <div className="bg-white/10 rounded-xl p-4 text-left">
          <p className="text-white/60 text-sm font-mono">
            📁 src/apps/HelloWorld.tsx
          </p>
          <p className="text-white/80 text-sm mt-2">
            ✨ Buat file .tsx baru di folder ini, otomatis muncul di My Apps!
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.history.back()}
          className="mt-6 px-6 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-white/90 transition-colors"
        >
          ← Kembali
        </motion.button>
      </motion.div>
    </div>
  );
};

export default HelloWorld;
