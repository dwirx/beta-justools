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

const JsonFormatterPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError('Invalid JSON');
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e) {
      setError('Invalid JSON');
      setOutput('');
    }
  };

  return (
    <ToolLayout
      toolName="JSON Formatter"
      toolIcon="📋"
      toolDescription="Format and beautify JSON data with syntax highlighting"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name": "example", "value": 123}'
            className="tool-input h-40"
          />
        </div>
        
        <div className="flex gap-2">
          <button onClick={formatJson} className="action-button primary">
            Format (Beautify)
          </button>
          <button onClick={minifyJson} className="action-button secondary">
            Minify (Compress)
          </button>
        </div>
        
        {error && <p className="text-destructive text-sm">{error}</p>}
        
        {output && (
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Output</label>
            <pre className="tool-output whitespace-pre-wrap h-40 overflow-auto">{output}</pre>
            <div className="mt-2">
              <CopyButton text={output} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default JsonFormatterPage;
