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

const ColorConverterPage = () => {
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

  const hexValue = hex;
  const rgbValue = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslValue = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <ToolLayout
      toolName="Color Converter"
      toolIcon="🎨"
      toolDescription="Convert between HEX, RGB, HSL color formats"
    >
      <div className="space-y-6">
        {/* Color Preview */}
        <div
          className="w-full h-32 rounded-xl border border-border shadow-lg"
          style={{ backgroundColor: hex }}
        />
        
        {/* Color Picker */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Pick a Color</label>
          <input
            type="color"
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="w-full h-14 cursor-pointer rounded-lg border border-border"
          />
        </div>

        {/* Color Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <label className="text-sm text-muted-foreground mb-2 block">HEX</label>
            <input
              type="text"
              value={hex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="tool-input font-mono"
            />
            <div className="mt-2">
              <CopyButton text={hexValue} />
            </div>
          </div>
          <div className="glass-card p-4">
            <label className="text-sm text-muted-foreground mb-2 block">RGB</label>
            <input
              type="text"
              value={rgbValue}
              readOnly
              className="tool-input font-mono"
            />
            <div className="mt-2">
              <CopyButton text={rgbValue} />
            </div>
          </div>
          <div className="glass-card p-4">
            <label className="text-sm text-muted-foreground mb-2 block">HSL</label>
            <input
              type="text"
              value={hslValue}
              readOnly
              className="tool-input font-mono"
            />
            <div className="mt-2">
              <CopyButton text={hslValue} />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default ColorConverterPage;
