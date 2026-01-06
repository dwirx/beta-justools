import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Copy, Check } from 'lucide-react';

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

const HashGeneratorPage = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const generateHashes = async () => {
    if (!input) return;
    
    setLoading(true);
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const results: Record<string, string> = {};

    for (const algo of algorithms) {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      results[algo] = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    setHashes(results);
    setLoading(false);
  };

  return (
    <ToolLayout
      toolName="Hash Generator"
      toolIcon="#️⃣"
      toolDescription="Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes"
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Enter text to hash</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to generate hashes..."
            className="tool-input h-32"
          />
        </div>

        <button 
          onClick={generateHashes} 
          className="action-button primary w-full"
          disabled={loading || !input}
        >
          {loading ? 'Generating...' : 'Generate Hashes'}
        </button>

        {Object.keys(hashes).length > 0 && (
          <div className="space-y-4">
            {Object.entries(hashes).map(([algo, hash]) => (
              <div key={algo} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary">{algo}</span>
                  <CopyButton text={hash} />
                </div>
                <div className="font-mono text-xs break-all text-muted-foreground">{hash}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default HashGeneratorPage;
