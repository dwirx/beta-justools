import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';

const WordCounterPage = () => {
  const [text, setText] = useState('');

  const stats = {
    characters: text.length,
    'characters (no spaces)': text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    sentences: text.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: text.split(/\n\n+/).filter(Boolean).length,
    lines: text.split('\n').length,
  };

  const readingTime = Math.ceil(stats.words / 200); // Average reading speed
  const speakingTime = Math.ceil(stats.words / 150); // Average speaking speed

  return (
    <ToolLayout
      toolName="Word Counter"
      toolIcon="📊"
      toolDescription="Count words, characters, sentences, and paragraphs"
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Enter or paste your text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className="tool-input h-48"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{value.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground capitalize mt-1">{key}</div>
            </div>
          ))}
        </div>

        {/* Reading/Speaking Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 text-center">
            <div className="text-xl font-bold gradient-text">{readingTime} min</div>
            <div className="text-xs text-muted-foreground mt-1">Reading Time</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-xl font-bold gradient-text">{speakingTime} min</div>
            <div className="text-xs text-muted-foreground mt-1">Speaking Time</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default WordCounterPage;
