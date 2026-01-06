import { motion } from 'framer-motion';
import { ToolMeta } from '@/lib/toolRegistry';
import { ToolCard } from './ToolCard';

interface ToolsGridProps {
  tools: ToolMeta[];
}

export const ToolsGrid = ({ tools }: ToolsGridProps) => {
  return (
    <section className="px-4 sm:px-6 pb-12 sm:pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-4 sm:mb-6"
        >
          <h3 className="text-lg sm:text-xl font-semibold">Tool List</h3>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {tools.length} tools
          </span>
        </motion.div>

        {tools.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 sm:py-12"
          >
            <p className="text-muted-foreground text-sm sm:text-base">No tools found matching your search.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {tools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
