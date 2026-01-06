import { lazy, ComponentType } from 'react';

export type Category = 'converter' | 'developer' | 'text' | 'image' | 'utility';

export interface ToolMeta {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon: string;
  tags: string[];
  featured?: boolean;
}

export interface ToolEntry extends ToolMeta {
  component: ComponentType;
}

// =============================================================
// TOOL REGISTRY - Tambah tool baru di sini saja!
// =============================================================
// Untuk menambah tool baru:
// 1. Buat file di src/pages/tools/NamaToolPage.tsx
// 2. Import lazy component di bawah
// 3. Tambahkan entry di array toolRegistry
// =============================================================

const toolRegistry: ToolEntry[] = [
  // ===== FORMAT CONVERTERS =====
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and beautify JSON data with syntax highlighting',
    category: 'converter',
    icon: '📋',
    tags: ['json', 'format', 'beautify'],
    featured: true,
    component: lazy(() => import('@/pages/tools/JsonFormatterPage')),
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 to text',
    category: 'converter',
    icon: '🔐',
    tags: ['base64', 'encode', 'decode'],
    component: lazy(() => import('@/pages/tools/Base64EncoderPage')),
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode or decode URL components safely',
    category: 'converter',
    icon: '🔗',
    tags: ['url', 'encode', 'decode'],
    component: lazy(() => import('@/pages/tools/UrlEncoderPage')),
  },

  // ===== DEVELOPER TOOLS =====
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUID v4 identifiers',
    category: 'developer',
    icon: '🆔',
    tags: ['uuid', 'id', 'random'],
    featured: true,
    component: lazy(() => import('@/pages/tools/UuidGeneratorPage')),
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256 hashes',
    category: 'developer',
    icon: '#️⃣',
    tags: ['hash', 'md5', 'sha'],
    component: lazy(() => import('@/pages/tools/HashGeneratorPage')),
  },
  {
    id: 'timestamp-converter',
    name: 'Unix Timestamp',
    description: 'Convert between Unix timestamps and dates',
    category: 'developer',
    icon: '⏰',
    tags: ['timestamp', 'unix', 'date'],
    component: lazy(() => import('@/pages/tools/TimestampConverterPage')),
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL color formats',
    category: 'developer',
    icon: '🎨',
    tags: ['color', 'hex', 'rgb', 'hsl'],
    featured: true,
    component: lazy(() => import('@/pages/tools/ColorConverterPage')),
  },
  {
    id: 'purple-cipher',
    name: 'Purple Cipher',
    description: 'PURPLE cipher encryption/decryption simulator',
    category: 'developer',
    icon: '🟣',
    tags: ['cipher', 'encrypt', 'decrypt', 'purple', 'cryptography'],
    featured: true,
    component: lazy(() => import('@/pages/tools/PurpleCipherPage')),
  },

  // ===== TEXT PROCESSING =====
  {
    id: 'text-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs',
    category: 'text',
    icon: '📊',
    tags: ['word', 'count', 'character'],
    component: lazy(() => import('@/pages/tools/WordCounterPage')),
  },
  {
    id: 'text-case',
    name: 'Text Case Converter',
    description: 'Convert text between different cases',
    category: 'text',
    icon: 'Aa',
    tags: ['case', 'upper', 'lower', 'title'],
    component: lazy(() => import('@/pages/tools/TextCasePage')),
  },
  {
    id: 'lorem-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for your designs',
    category: 'text',
    icon: '📝',
    tags: ['lorem', 'placeholder', 'text'],
    component: lazy(() => import('@/pages/tools/LoremGeneratorPage')),
  },

  // ===== UTILITIES =====
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure random passwords',
    category: 'utility',
    icon: '🔒',
    tags: ['password', 'secure', 'random'],
    component: lazy(() => import('@/pages/tools/PasswordGeneratorPage')),
  },
  {
    id: 'number-base',
    name: 'Number Base Converter',
    description: 'Convert between binary, octal, decimal, and hex',
    category: 'utility',
    icon: '🔢',
    tags: ['number', 'binary', 'hex', 'convert'],
    component: lazy(() => import('@/pages/tools/NumberBasePage')),
  },
];

// ===== HELPER FUNCTIONS =====

export const getToolRegistry = () => toolRegistry;

export const getToolById = (id: string) => toolRegistry.find(t => t.id === id);

export const getToolsByCategory = (category: Category) => 
  toolRegistry.filter(t => t.category === category);

export const getFeaturedTools = () => 
  toolRegistry.filter(t => t.featured);

export const searchTools = (query: string) => {
  const q = query.toLowerCase();
  return toolRegistry.filter(t => 
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.toLowerCase().includes(q))
  );
};

// Convert to simple Tool type for components that don't need the component
export const getToolsMeta = (): ToolMeta[] => 
  toolRegistry.map(({ component, ...meta }) => meta);

// Categories definition
export const categories: { id: Category; label: string; icon: string }[] = [
  { id: 'converter', label: 'Format Converter', icon: '🔄' },
  { id: 'developer', label: 'Developer Tools', icon: '👨‍💻' },
  { id: 'text', label: 'Text Processing', icon: '📝' },
  { id: 'image', label: 'Image Tools', icon: '🖼️' },
  { id: 'utility', label: 'Utilities', icon: '🧰' },
];

export default toolRegistry;
