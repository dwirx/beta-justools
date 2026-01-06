import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Copy, Check, RefreshCw } from 'lucide-react';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="action-button secondary flex items-center gap-2"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

const UuidGeneratorPage = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);

  const generateUuid = () => {
    const newUuids = Array.from({ length: count }, () =>
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
    );
    setUuids(newUuids);
  };

  return (
    <ToolLayout
      toolName="UUID Generator"
      toolIcon="🆔"
      toolDescription="Generate random UUID v4 identifiers"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Count:</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="tool-input w-24"
            />
          </div>
          <button onClick={generateUuid} className="action-button primary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Generate UUIDs
          </button>
        </div>
        
        {uuids.length > 0 && (
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Generated UUIDs</label>
            <div className="tool-output font-mono text-sm space-y-1 max-h-80 overflow-auto">
              {uuids.map((uuid, i) => (
                <div key={i} className="flex items-center justify-between gap-2 p-2 rounded hover:bg-secondary/50">
                  <span>{uuid}</span>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <CopyButton text={uuids.join('\n')} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default UuidGeneratorPage;
