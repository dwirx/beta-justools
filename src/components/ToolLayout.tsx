import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Link } from 'react-router-dom';

interface ToolLayoutProps {
  toolName: string;
  toolIcon: string;
  toolDescription: string;
  children: ReactNode;
}

export const ToolLayout = ({ toolName, toolIcon, toolDescription, children }: ToolLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header showBack toolName={toolName} />
      
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tool Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{toolIcon}</span>
              <div>
                <h1 className="text-3xl font-bold">{toolName}</h1>
                <p className="text-muted-foreground">{toolDescription}</p>
              </div>
            </div>
          </motion.div>

          {/* Tool Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            {children}
          </motion.div>

          {/* Related Tools */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <Link
              to="/"
              className="text-primary hover:underline text-sm"
            >
              ← Browse all tools
            </Link>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-border/50 py-6 px-6 mt-auto">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>All tools run locally in your browser. Your data never leaves your device.</p>
        </div>
      </footer>
    </div>
  );
};
