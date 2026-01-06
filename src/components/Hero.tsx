import { motion } from 'framer-motion';
import { getToolsMeta, categories } from '@/lib/toolRegistry';

export const Hero = () => {
  const tools = getToolsMeta();
  
  const stats = [
    { value: tools.length, label: 'Tools' },
    { value: categories.length, label: 'Categories' },
    { value: '100%', label: 'Open Source' },
    { value: '0', label: 'Tracking' },
  ];

  return (
    <section className="relative py-6 sm:py-8 md:py-16 px-4 sm:px-6 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      {/* Gradient orbs - hidden on mobile for performance */}
      <div className="hidden sm:block absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="hidden sm:block absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-3">
            <span className="gradient-text">Lightweight</span> Developer Tools
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-10 px-2">
            All tools run locally in your browser. No installation required. 
            Privacy-first — your data never leaves your device.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="stat-card"
            >
              <div className="stat-value text-xl sm:text-2xl">{stat.value}</div>
              <div className="stat-label text-xs sm:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
