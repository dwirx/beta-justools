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

const TextCasePage = () => {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const conversions = [
    { id: 'upper', label: 'UPPERCASE', fn: (t: string) => t.toUpperCase() },
    { id: 'lower', label: 'lowercase', fn: (t: string) => t.toLowerCase() },
    { id: 'title', label: 'Title Case', fn: (t: string) => t.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()) },
    { id: 'sentence', label: 'Sentence case', fn: (t: string) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() },
    { id: 'camel', label: 'camelCase', fn: (t: string) => t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
    { id: 'pascal', label: 'PascalCase', fn: (t: string) => t.toLowerCase().replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, (_, c) => c.toUpperCase()) },
    { id: 'snake', label: 'snake_case', fn: (t: string) => t.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') },
    { id: 'kebab', label: 'kebab-case', fn: (t: string) => t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
    { id: 'constant', label: 'CONSTANT_CASE', fn: (t: string) => t.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '') },
  ];

  const convert = (fn: (t: string) => string) => {
    setOutput(fn(text));
  };

  return (
    <ToolLayout
      toolName="Text Case Converter"
      toolIcon="Aa"
      toolDescription="Convert text between different cases"
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Enter text to convert</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="tool-input h-32"
          />
        </div>

        {/* Conversion Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {conversions.map((conv) => (
            <button
              key={conv.id}
              onClick={() => convert(conv.fn)}
              className="action-button secondary text-sm py-3"
            >
              {conv.label}
            </button>
          ))}
        </div>

        {/* Output */}
        {output && (
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Result</label>
            <div className="tool-output">{output}</div>
            <div className="mt-2">
              <CopyButton text={output} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default TextCasePage;
