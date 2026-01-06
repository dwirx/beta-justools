import { Button } from '@/components/ui/button';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface CounterControlsProps {
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}

export default function CounterControls({ onIncrement, onDecrement, onReset }: CounterControlsProps) {
  return (
    <div className="flex justify-center gap-4">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="lg"
          variant="outline"
          onClick={onDecrement}
          className="w-16 h-16 rounded-full"
        >
          <Minus className="w-6 h-6" />
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="lg"
          variant="secondary"
          onClick={onReset}
          className="w-16 h-16 rounded-full"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="lg"
          onClick={onIncrement}
          className="w-16 h-16 rounded-full"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
}
