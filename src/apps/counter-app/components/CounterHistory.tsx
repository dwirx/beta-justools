import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';

interface HistoryItem {
  value: number;
  action: string;
  time: Date;
}

interface CounterHistoryProps {
  history: HistoryItem[];
}

export default function CounterHistory({ history }: CounterHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No history yet. Start counting!
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'increment':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'decrement':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      case 'reset':
        return <RotateCcw className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">History</h3>
      <ScrollArea className="h-32 rounded-lg border bg-muted/30 p-2">
        <AnimatePresence>
          {[...history].reverse().map((item, index) => (
            <motion.div
              key={history.length - index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 py-1 px-2 text-sm"
            >
              {getActionIcon(item.action)}
              <span className="font-mono">{item.value}</span>
              <span className="text-muted-foreground text-xs ml-auto">
                {item.time.toLocaleTimeString()}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
