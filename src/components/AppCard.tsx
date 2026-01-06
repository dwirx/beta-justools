import { Star, ExternalLink, Copy, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { App } from '@/data/apps';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AppCardProps {
  app: App;
  index: number;
}

const AppCard = ({ app, index }: AppCardProps) => {
  const getAppUrl = () => {
    return `/myapps/${app.path}`;
  };

  const handleUse = () => {
    window.location.href = getAppUrl();
  };

  const handleOpenTab = () => {
    window.open(getAppUrl(), '_blank');
  };

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}${getAppUrl()}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">{app.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{app.path}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              app.type === 'single-file'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-violet-500/20 text-violet-400'
            }`}
          >
            {app.type === 'single-file' ? 'SINGLE FILE' : 'PROJECT'}
          </span>
          <button className="p-1 hover:bg-muted rounded-full transition-colors">
            <Star className="w-5 h-5 text-muted-foreground hover:text-yellow-400" />
          </button>
        </div>
      </div>

      {app.description && (
        <p className="text-sm text-muted-foreground mb-4">{app.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          onClick={handleUse}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          size="sm"
        >
          <Play className="w-4 h-4 mr-1" />
          Gunakan
        </Button>
        <Button
          onClick={handleOpenTab}
          variant="outline"
          size="sm"
          className="border-border hover:bg-muted"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Buka Tab
        </Button>
        <Button
          onClick={handleCopyLink}
          variant="outline"
          size="sm"
          className="border-border hover:bg-muted"
        >
          <Copy className="w-4 h-4 mr-1" />
          Salin Link
        </Button>
      </div>
    </motion.div>
  );
};

export default AppCard;
