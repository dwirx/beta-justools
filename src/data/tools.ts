export type Category = 'converter' | 'developer' | 'text' | 'image' | 'utility';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon: string;
  tags: string[];
  featured?: boolean;
}

export const categories: { id: Category; label: string; icon: string }[] = [
  { id: 'converter', label: 'Format Converter', icon: '🔄' },
  { id: 'developer', label: 'Developer Tools', icon: '👨‍💻' },
  { id: 'text', label: 'Text Processing', icon: '📝' },
  { id: 'image', label: 'Image Tools', icon: '🖼️' },
  { id: 'utility', label: 'Utilities', icon: '🧰' },
];

export const tools: Tool[] = [
  // Format Converters
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and beautify JSON data with syntax highlighting',
    category: 'converter',
    icon: '📋',
    tags: ['json', 'format', 'beautify'],
    featured: true,
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 to text',
    category: 'converter',
    icon: '🔐',
    tags: ['base64', 'encode', 'decode'],
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode or decode URL components safely',
    category: 'converter',
    icon: '🔗',
    tags: ['url', 'encode', 'decode'],
  },
  {
    id: 'json-to-csv',
    name: 'JSON to CSV',
    description: 'Convert JSON arrays to CSV format',
    category: 'converter',
    icon: '📊',
    tags: ['json', 'csv', 'convert'],
  },
  {
    id: 'html-entity',
    name: 'HTML Entity Encoder',
    description: 'Encode special characters to HTML entities',
    category: 'converter',
    icon: '🏷️',
    tags: ['html', 'entity', 'encode'],
  },
  // Developer Tools
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUID v4 identifiers',
    category: 'developer',
    icon: '🆔',
    tags: ['uuid', 'id', 'random'],
    featured: true,
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256 hashes',
    category: 'developer',
    icon: '#️⃣',
    tags: ['hash', 'md5', 'sha'],
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JWT tokens',
    category: 'developer',
    icon: '🎫',
    tags: ['jwt', 'token', 'decode'],
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions',
    category: 'developer',
    icon: '🔍',
    tags: ['regex', 'pattern', 'test'],
  },
  {
    id: 'timestamp-converter',
    name: 'Unix Timestamp',
    description: 'Convert between Unix timestamps and dates',
    category: 'developer',
    icon: '⏰',
    tags: ['timestamp', 'unix', 'date'],
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL color formats',
    category: 'developer',
    icon: '🎨',
    tags: ['color', 'hex', 'rgb', 'hsl'],
    featured: true,
  },
  // Text Processing
  {
    id: 'text-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs',
    category: 'text',
    icon: '📊',
    tags: ['word', 'count', 'character'],
  },
  {
    id: 'text-case',
    name: 'Text Case Converter',
    description: 'Convert text between different cases',
    category: 'text',
    icon: 'Aa',
    tags: ['case', 'upper', 'lower', 'title'],
  },
  {
    id: 'lorem-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for your designs',
    category: 'text',
    icon: '📝',
    tags: ['lorem', 'placeholder', 'text'],
  },
  {
    id: 'text-diff',
    name: 'Text Diff Checker',
    description: 'Compare two texts and see differences',
    category: 'text',
    icon: '🔀',
    tags: ['diff', 'compare', 'text'],
  },
  // Image Tools
  {
    id: 'image-to-base64',
    name: 'Image to Base64',
    description: 'Convert images to Base64 encoded strings',
    category: 'image',
    icon: '🖼️',
    tags: ['image', 'base64', 'convert'],
  },
  {
    id: 'svg-viewer',
    name: 'SVG Viewer',
    description: 'Preview and validate SVG code',
    category: 'image',
    icon: '🎯',
    tags: ['svg', 'preview', 'view'],
  },
  // Utilities
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes from text or URLs',
    category: 'utility',
    icon: '📱',
    tags: ['qr', 'code', 'generate'],
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure random passwords',
    category: 'utility',
    icon: '🔒',
    tags: ['password', 'secure', 'random'],
  },
  {
    id: 'number-base',
    name: 'Number Base Converter',
    description: 'Convert between binary, octal, decimal, and hex',
    category: 'utility',
    icon: '🔢',
    tags: ['number', 'binary', 'hex', 'convert'],
  },
];
