import { motion } from 'framer-motion';
import { Tool } from '@/data/tools';
import { ToolCard } from './ToolCard';

interface ToolsGridProps {
  tools: Tool[];
  onToolClick: (tool: Tool) => void;
}

export const ToolsGrid = ({ tools, onToolClick }: ToolsGridProps) => {
  return (
    <section className="px-6 pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-6"
        >
          <h3 className="text-xl font-semibold">Tool List</h3>
          <span className="text-sm text-muted-foreground">
            {tools.length} tools
          </span>
        </motion.div>

        {tools.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No tools found matching your search.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                index={index}
                onClick={() => onToolClick(tool)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
