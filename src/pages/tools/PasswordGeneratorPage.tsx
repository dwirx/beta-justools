import { useState, useCallback } from 'react';
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

const PasswordGeneratorPage = () => {
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

  const getStrength = () => {
    let strength = 0;
    if (options.lowercase) strength++;
    if (options.uppercase) strength++;
    if (options.numbers) strength++;
    if (options.symbols) strength++;
    if (length >= 16) strength++;
    if (length >= 24) strength++;
    return strength;
  };

  const strengthColors = ['bg-destructive', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600', 'bg-primary'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

  return (
    <ToolLayout
      toolName="Password Generator"
      toolIcon="🔒"
      toolDescription="Generate secure random passwords"
    >
      <div className="space-y-6">
        {/* Length Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-muted-foreground">Password Length</label>
            <span className="text-sm font-mono text-primary">{length} characters</span>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(options).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 glass-card p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                className="rounded w-5 h-5"
              />
              <span className="capitalize">{key}</span>
            </label>
          ))}
        </div>

        {/* Generate Button */}
        <button onClick={generate} className="action-button primary w-full flex items-center justify-center gap-2 py-3">
          <RefreshCw className="w-5 h-5" />
          Generate Password
        </button>

        {/* Password Output */}
        {password && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Generated Password</label>
              <div className="tool-output font-mono text-lg break-all p-4">{password}</div>
            </div>
            
            {/* Strength Indicator */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Strength</span>
                <span className="text-sm">{strengthLabels[getStrength()]}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${strengthColors[getStrength()]}`}
                  style={{ width: `${(getStrength() + 1) / 6 * 100}%` }}
                />
              </div>
            </div>
            
            <CopyButton text={password} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default PasswordGeneratorPage;
