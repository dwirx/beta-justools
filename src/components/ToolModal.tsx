import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, RefreshCw } from 'lucide-react';
import { Tool } from '@/data/tools';

interface ToolModalProps {
  tool: Tool | null;
  onClose: () => void;
}

export const ToolModal = ({ tool, onClose }: ToolModalProps) => {
  if (!tool) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{tool.icon}</span>
              <div>
                <h2 className="text-xl font-bold">{tool.name}</h2>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <ToolContent tool={tool} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ToolContent = ({ tool }: { tool: Tool }) => {
  switch (tool.id) {
    case 'json-formatter':
      return <JsonFormatterTool />;
    case 'base64-encoder':
      return <Base64Tool />;
    case 'url-encoder':
      return <UrlEncoderTool />;
    case 'uuid-generator':
      return <UuidGeneratorTool />;
    case 'color-converter':
      return <ColorConverterTool />;
    case 'text-counter':
      return <WordCounterTool />;
    case 'text-case':
      return <TextCaseTool />;
    case 'password-generator':
      return <PasswordGeneratorTool />;
    case 'hash-generator':
      return <HashGeneratorTool />;
    case 'timestamp-converter':
      return <TimestampTool />;
    case 'lorem-generator':
      return <LoremGeneratorTool />;
    case 'number-base':
      return <NumberBaseTool />;
    case 'html-entity':
      return <HtmlEntityTool />;
    default:
      return <ComingSoon />;
  }
};

const ComingSoon = () => (
  <div className="text-center py-12">
    <p className="text-muted-foreground">This tool is coming soon!</p>
  </div>
);

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

// JSON Formatter Tool
const JsonFormatterTool = () => {
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
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"name": "example", "value": 123}'
        className="tool-input h-32"
      />
      <div className="flex gap-2">
        <button onClick={formatJson} className="action-button primary">
          Format
        </button>
        <button onClick={minifyJson} className="action-button secondary">
          Minify
        </button>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      {output && (
        <>
          <pre className="tool-output whitespace-pre-wrap">{output}</pre>
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
};

// Base64 Tool
const Base64Tool = () => {
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
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
        className="tool-input h-24"
      />
      <button onClick={process} className="action-button primary">
        {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
      </button>
      {output && (
        <>
          <div className="tool-output">{output}</div>
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
};

// URL Encoder Tool
const UrlEncoderTool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setOutput('Error: Invalid input');
    }
  };

  return (
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
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter URL to encode...' : 'Enter encoded URL to decode...'}
        className="tool-input h-24"
      />
      <button onClick={process} className="action-button primary">
        {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
      </button>
      {output && (
        <>
          <div className="tool-output break-all">{output}</div>
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
};

// UUID Generator Tool
const UuidGeneratorTool = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);

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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-muted-foreground">Count:</label>
        <input
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
          className="tool-input w-24"
        />
        <button onClick={generateUuid} className="action-button primary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Generate
        </button>
      </div>
      {uuids.length > 0 && (
        <>
          <div className="tool-output font-mono text-sm space-y-1">
            {uuids.map((uuid, i) => (
              <div key={i}>{uuid}</div>
            ))}
          </div>
          <CopyButton text={uuids.join('\n')} />
        </>
      )}
    </div>
  );
};

// Color Converter Tool
const ColorConverterTool = () => {
  const [hex, setHex] = useState('#3b82f6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const handleHexChange = (value: string) => {
    setHex(value);
    const rgbVal = hexToRgb(value);
    if (rgbVal) {
      setRgb(rgbVal);
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="w-full h-24 rounded-lg border border-border"
        style={{ backgroundColor: hex }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">HEX</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="tool-input"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">RGB</label>
          <input
            type="text"
            value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
            readOnly
            className="tool-input"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">HSL</label>
          <input
            type="text"
            value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
            readOnly
            className="tool-input"
          />
        </div>
      </div>
      <input
        type="color"
        value={hex}
        onChange={(e) => handleHexChange(e.target.value)}
        className="w-full h-12 cursor-pointer rounded-lg"
      />
    </div>
  );
};

// Word Counter Tool
const WordCounterTool = () => {
  const [text, setText] = useState('');

  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    sentences: text.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: text.split(/\n\n+/).filter(Boolean).length,
    lines: text.split('\n').length,
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        className="tool-input h-40"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="glass-card p-3 text-center">
            <div className="text-xl font-bold text-primary">{value}</div>
            <div className="text-xs text-muted-foreground capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Text Case Tool
const TextCaseTool = () => {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const convert = (type: string) => {
    switch (type) {
      case 'upper':
        setOutput(text.toUpperCase());
        break;
      case 'lower':
        setOutput(text.toLowerCase());
        break;
      case 'title':
        setOutput(text.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()));
        break;
      case 'sentence':
        setOutput(text.charAt(0).toUpperCase() + text.slice(1).toLowerCase());
        break;
      case 'camel':
        setOutput(text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()));
        break;
      case 'snake':
        setOutput(text.toLowerCase().replace(/\s+/g, '_'));
        break;
      case 'kebab':
        setOutput(text.toLowerCase().replace(/\s+/g, '-'));
        break;
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert..."
        className="tool-input h-24"
      />
      <div className="flex flex-wrap gap-2">
        {['upper', 'lower', 'title', 'sentence', 'camel', 'snake', 'kebab'].map((type) => (
          <button key={type} onClick={() => convert(type)} className="action-button secondary capitalize">
            {type}
          </button>
        ))}
      </div>
      {output && (
        <>
          <div className="tool-output">{output}</div>
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
};

// Password Generator Tool
const PasswordGeneratorTool = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });

  const generate = useCallback(() => {
    let chars = '';
    if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.numbers) chars += '0123456789';
    if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setPassword('Select at least one option');
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    const result = Array.from(array, (x) => chars[x % chars.length]).join('');
    setPassword(result);
  }, [length, options]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-muted-foreground">Length: {length}</label>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="flex-1"
        />
      </div>
      <div className="flex flex-wrap gap-4">
        {Object.entries(options).map(([key, value]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
              className="rounded"
            />
            <span className="capitalize">{key}</span>
          </label>
        ))}
      </div>
      <button onClick={generate} className="action-button primary flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Generate Password
      </button>
      {password && (
        <>
          <div className="tool-output font-mono text-lg break-all">{password}</div>
          <CopyButton text={password} />
        </>
      )}
    </div>
  );
};

// Hash Generator Tool
const HashGeneratorTool = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const generateHashes = async () => {
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
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to hash..."
        className="tool-input h-24"
      />
      <button onClick={generateHashes} className="action-button primary">
        Generate Hashes
      </button>
      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="glass-card p-3">
              <div className="text-xs text-muted-foreground mb-1">{algo}</div>
              <div className="font-mono text-xs break-all">{hash}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Timestamp Tool
const TimestampTool = () => {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [date, setDate] = useState(new Date().toISOString().slice(0, 19));

  const timestampToDate = () => {
    const d = new Date(parseInt(timestamp) * 1000);
    setDate(d.toISOString().slice(0, 19));
  };

  const dateToTimestamp = () => {
    const d = new Date(date);
    setTimestamp(Math.floor(d.getTime() / 1000).toString());
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Unix Timestamp</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="tool-input flex-1"
          />
          <button onClick={timestampToDate} className="action-button primary">
            → Date
          </button>
        </div>
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Date & Time</label>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="tool-input flex-1"
          />
          <button onClick={dateToTimestamp} className="action-button primary">
            → Unix
          </button>
        </div>
      </div>
      <div className="glass-card p-3">
        <div className="text-xs text-muted-foreground mb-1">Current Time</div>
        <div className="font-mono">{Math.floor(Date.now() / 1000)}</div>
      </div>
    </div>
  );
};

// Lorem Generator Tool
const LoremGeneratorTool = () => {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [output, setOutput] = useState('');

  const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat'];

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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value) || 1)}
          className="tool-input w-20"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
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
        <>
          <div className="tool-output whitespace-pre-wrap">{output}</div>
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
};

// Number Base Tool
const NumberBaseTool = () => {
  const [decimal, setDecimal] = useState('');
  const [binary, setBinary] = useState('');
  const [octal, setOctal] = useState('');
  const [hex, setHex] = useState('');

  const updateAll = (value: number) => {
    if (isNaN(value)) {
      setBinary(''); setOctal(''); setHex('');
      return;
    }
    setBinary(value.toString(2));
    setOctal(value.toString(8));
    setHex(value.toString(16).toUpperCase());
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Decimal (10)</label>
          <input
            type="text"
            value={decimal}
            onChange={(e) => {
              setDecimal(e.target.value);
              updateAll(parseInt(e.target.value, 10));
            }}
            className="tool-input"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Binary (2)</label>
          <input
            type="text"
            value={binary}
            onChange={(e) => {
              setBinary(e.target.value);
              const val = parseInt(e.target.value, 2);
              setDecimal(val.toString());
              setOctal(val.toString(8));
              setHex(val.toString(16).toUpperCase());
            }}
            className="tool-input"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Octal (8)</label>
          <input
            type="text"
            value={octal}
            onChange={(e) => {
              setOctal(e.target.value);
              const val = parseInt(e.target.value, 8);
              setDecimal(val.toString());
              setBinary(val.toString(2));
              setHex(val.toString(16).toUpperCase());
            }}
            className="tool-input"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Hexadecimal (16)</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => {
              setHex(e.target.value.toUpperCase());
              const val = parseInt(e.target.value, 16);
              setDecimal(val.toString());
              setBinary(val.toString(2));
              setOctal(val.toString(8));
            }}
            className="tool-input"
          />
        </div>
      </div>
    </div>
  );
};

// HTML Entity Tool
const HtmlEntityTool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = () => {
    if (mode === 'encode') {
      const div = document.createElement('div');
      div.textContent = input;
      setOutput(div.innerHTML);
    } else {
      const div = document.createElement('div');
      div.innerHTML = input;
      setOutput(div.textContent || '');
    }
  };

  return (
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
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? '<div>Hello</div>' : '&lt;div&gt;Hello&lt;/div&gt;'}
        className="tool-input h-24"
      />
      <button onClick={process} className="action-button primary">
        {mode === 'encode' ? 'Encode HTML' : 'Decode HTML'}
      </button>
      {output && (
        <>
          <div className="tool-output break-all">{output}</div>
          <CopyButton text={output} />
        </>
      )}
    </div>
  );
};
