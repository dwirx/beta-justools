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

const TimestampConverterPage = () => {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [date, setDate] = useState(new Date().toISOString().slice(0, 19));
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  const timestampToDate = () => {
    try {
      const ts = parseInt(timestamp);
      const d = new Date(ts * 1000);
      setDate(d.toISOString().slice(0, 19));
    } catch {
      // Invalid input
    }
  };

  const dateToTimestamp = () => {
    try {
      const d = new Date(date);
      setTimestamp(Math.floor(d.getTime() / 1000).toString());
    } catch {
      // Invalid input
    }
  };

  const refreshCurrentTime = () => {
    setCurrentTime(Math.floor(Date.now() / 1000));
  };

  return (
    <ToolLayout
      toolName="Unix Timestamp Converter"
      toolIcon="⏰"
      toolDescription="Convert between Unix timestamps and dates"
    >
      <div className="space-y-6">
        {/* Current Time */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Current Unix Timestamp</span>
            <button onClick={refreshCurrentTime} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-mono font-bold text-primary">{currentTime}</span>
            <CopyButton text={currentTime.toString()} />
          </div>
        </div>

        {/* Timestamp to Date */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Unix Timestamp</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="1704067200"
              className="tool-input flex-1 font-mono"
            />
            <button onClick={timestampToDate} className="action-button primary whitespace-nowrap">
              → Convert to Date
            </button>
          </div>
        </div>

        {/* Date to Timestamp */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Date & Time</label>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="tool-input flex-1"
            />
            <button onClick={dateToTimestamp} className="action-button primary whitespace-nowrap">
              → Convert to Unix
            </button>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="glass-card p-4">
          <h4 className="text-sm font-medium mb-3">Quick Reference</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">1 second</div>
            <div className="font-mono">1</div>
            <div className="text-muted-foreground">1 minute</div>
            <div className="font-mono">60</div>
            <div className="text-muted-foreground">1 hour</div>
            <div className="font-mono">3600</div>
            <div className="text-muted-foreground">1 day</div>
            <div className="font-mono">86400</div>
            <div className="text-muted-foreground">1 week</div>
            <div className="font-mono">604800</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default TimestampConverterPage;
