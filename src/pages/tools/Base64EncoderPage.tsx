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

const Base64EncoderPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setOutput('Error: Invalid input');
    }
  };

  return (
    <ToolLayout
      toolName="Base64 Encoder/Decoder"
      toolIcon="🔐"
      toolDescription="Encode text to Base64 or decode Base64 to text"
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('encode')}
            className={`action-button ${mode === 'encode' ? 'primary' : 'secondary'}`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`action-button ${mode === 'decode' ? 'primary' : 'secondary'}`}
          >
            Decode
          </button>
        </div>
        
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
            className="tool-input h-32"
          />
        </div>
        
        <button onClick={process} className="action-button primary">
          {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
        </button>
        
        {output && (
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Result</label>
            <div className="tool-output break-all">{output}</div>
            <div className="mt-2">
              <CopyButton text={output} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default Base64EncoderPage;
