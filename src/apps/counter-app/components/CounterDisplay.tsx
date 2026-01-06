import { motion, AnimatePresence } from 'framer-motion';

interface CounterDisplayProps {
  count: number;
}

export default function CounterDisplay({ count }: CounterDisplayProps) {
  return (
    <div className="flex justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`text-7xl md:text-9xl font-bold ${
            count > 0 ? 'text-green-500' : count < 0 ? 'text-red-500' : 'text-foreground'
          }`}
        >
          {count}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
