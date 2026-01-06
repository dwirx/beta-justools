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

const LoremGeneratorPage = () => {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [output, setOutput] = useState('');

  const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];

  const generate = () => {
    const getWord = () => words[Math.floor(Math.random() * words.length)];
    const getSentence = () => {
      const len = 8 + Math.floor(Math.random() * 12);
      const sentence = Array.from({ length: len }, getWord).join(' ');
      return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    };
    const getParagraph = () => Array.from({ length: 4 + Math.floor(Math.random() * 4) }, getSentence).join(' ');

    switch (type) {
      case 'words':
        setOutput(Array.from({ length: count }, getWord).join(' '));
        break;
      case 'sentences':
        setOutput(Array.from({ length: count }, getSentence).join(' '));
        break;
      case 'paragraphs':
        setOutput(Array.from({ length: count }, getParagraph).join('\n\n'));
        break;
    }
  };

  return (
    <ToolLayout
      toolName="Lorem Ipsum Generator"
      toolIcon="📝"
      toolDescription="Generate placeholder text for your designs"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Generate</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="tool-input w-20"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="tool-input"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
          <button onClick={generate} className="action-button primary">
            Generate
          </button>
        </div>

        {output && (
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Generated Text</label>
            <div className="tool-output whitespace-pre-wrap max-h-96 overflow-auto">{output}</div>
            <div className="mt-2">
              <CopyButton text={output} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default LoremGeneratorPage;
