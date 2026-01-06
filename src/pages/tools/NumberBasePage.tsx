import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';

const NumberBasePage = () => {
  const [decimal, setDecimal] = useState('');
  const [binary, setBinary] = useState('');
  const [octal, setOctal] = useState('');
  const [hex, setHex] = useState('');

  const updateFromDecimal = (value: string) => {
    setDecimal(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setBinary(num.toString(2));
      setOctal(num.toString(8));
      setHex(num.toString(16).toUpperCase());
    } else {
      setBinary('');
      setOctal('');
      setHex('');
    }
  };

  const updateFromBinary = (value: string) => {
    setBinary(value);
    const num = parseInt(value, 2);
    if (!isNaN(num)) {
      setDecimal(num.toString());
      setOctal(num.toString(8));
      setHex(num.toString(16).toUpperCase());
    }
  };

  const updateFromOctal = (value: string) => {
    setOctal(value);
    const num = parseInt(value, 8);
    if (!isNaN(num)) {
      setDecimal(num.toString());
      setBinary(num.toString(2));
      setHex(num.toString(16).toUpperCase());
    }
  };

  const updateFromHex = (value: string) => {
    setHex(value.toUpperCase());
    const num = parseInt(value, 16);
    if (!isNaN(num)) {
      setDecimal(num.toString());
      setBinary(num.toString(2));
      setOctal(num.toString(8));
    }
  };

  return (
    <ToolLayout
      toolName="Number Base Converter"
      toolIcon="🔢"
      toolDescription="Convert between binary, octal, decimal, and hexadecimal"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <label className="text-sm text-muted-foreground mb-2 block">
              Decimal (Base 10)
            </label>
            <input
              type="text"
              value={decimal}
              onChange={(e) => updateFromDecimal(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="255"
              className="tool-input font-mono text-lg"
            />
          </div>

          <div className="glass-card p-4">
            <label className="text-sm text-muted-foreground mb-2 block">
              Binary (Base 2)
            </label>
            <input
              type="text"
              value={binary}
              onChange={(e) => updateFromBinary(e.target.value.replace(/[^01]/g, ''))}
              placeholder="11111111"
              className="tool-input font-mono text-lg"
            />
          </div>

          <div className="glass-card p-4">
            <label className="text-sm text-muted-foreground mb-2 block">
              Octal (Base 8)
            </label>
            <input
              type="text"
              value={octal}
              onChange={(e) => updateFromOctal(e.target.value.replace(/[^0-7]/g, ''))}
              placeholder="377"
              className="tool-input font-mono text-lg"
            />
          </div>

          <div className="glass-card p-4">
            <label className="text-sm text-muted-foreground mb-2 block">
              Hexadecimal (Base 16)
            </label>
            <input
              type="text"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value.replace(/[^0-9A-Fa-f]/g, ''))}
              placeholder="FF"
              className="tool-input font-mono text-lg"
            />
          </div>
        </div>

        {/* Common Values Reference */}
        <div className="glass-card p-4">
          <h4 className="text-sm font-medium mb-3">Common Values</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="text-left py-2">Decimal</th>
                  <th className="text-left py-2">Binary</th>
                  <th className="text-left py-2">Octal</th>
                  <th className="text-left py-2">Hex</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {[0, 1, 8, 16, 32, 64, 128, 255, 256, 1024].map((n) => (
                  <tr key={n} className="border-t border-border/50">
                    <td className="py-2">{n}</td>
                    <td className="py-2">{n.toString(2)}</td>
                    <td className="py-2">{n.toString(8)}</td>
                    <td className="py-2">{n.toString(16).toUpperCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default NumberBasePage;
