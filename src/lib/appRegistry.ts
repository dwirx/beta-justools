// =============================================================
// APP REGISTRY - Auto-detection untuk HTML Apps
// =============================================================
// 
// CARA MENAMBAH APP BARU (TANPA KONFIGURASI!):
// 
// 1. SINGLE FILE: Taruh file HTML di public/justhtml/
//    Contoh: public/justhtml/helloworld.html
//    -> Otomatis terdeteksi dengan nama "Helloworld"
//    
// 2. PROJECT FOLDER: Buat folder dengan index.html
//    Contoh: public/justhtml/my-game/index.html
//    -> Otomatis terdeteksi dengan nama "My Game"
//
// 3. KUSTOMISASI (Opsional): Tambah metadata di appCustomizations
//
// =============================================================

export type AppType = 'single-file' | 'project';
export type AppCategory = 'Games' | 'Tools' | 'Productivity' | 'Education' | 'Entertainment' | 'Other';

export interface AppMeta {
  id: string;
  name: string;
  description: string;
  type: AppType;
  path: string;
  category: AppCategory;
  icon?: string;
  featured?: boolean;
}

// =============================================================
// KUSTOMISASI APPS (Opsional) - Untuk override auto-detection
// =============================================================
// Key = nama file tanpa ekstensi atau nama folder
// Contoh: 'calculator' untuk calculator.html atau folder calculator/

interface AppCustomization {
  name?: string;
  description?: string;
  category?: AppCategory;
  icon?: string;
  featured?: boolean;
}

const appCustomizations: Record<string, AppCustomization> = {
  // ===== GAMES =====
  'tictactoe': {
    name: 'Tic Tac Toe',
    description: 'Classic Tic Tac Toe game for two players',
    category: 'Games',
    icon: '⭕',
    featured: true,
  },
  'snake': {
    name: 'Snake Game',
    description: 'Classic Snake game with mobile touch controls',
    category: 'Games',
    icon: '🐍',
    featured: true,
  },
  'memory-game': {
    name: 'Memory Game',
    description: 'Match pairs of cards to test your memory',
    category: 'Games',
    icon: '🃏',
  },

  // ===== TOOLS =====
  'calculator': {
    name: 'Calculator',
    description: 'Simple calculator for basic math operations',
    category: 'Tools',
    icon: '🧮',
  },
  'stopwatch': {
    name: 'Stopwatch',
    description: 'Stopwatch with lap timer functionality',
    category: 'Tools',
    icon: '⏱️',
  },
  'promptLibrary': {
    name: 'Prompt Library',
    description: 'Collection of useful AI prompts',
    category: 'Tools',
    icon: '💬',
  },

  // ===== PRODUCTIVITY =====
  'todo': {
    name: 'Todo List',
    description: 'Simple todo list with localStorage persistence',
    category: 'Productivity',
    icon: '✅',
  },
  'notes': {
    name: 'Quick Notes',
    description: 'Take quick notes with color coding',
    category: 'Productivity',
    icon: '📝',
  },
};

// =============================================================
// AUTO-DETECTION: Daftar file yang ada di public/justhtml/
// =============================================================
// Update daftar ini saat menambah file baru
// Format: { path: string, type: AppType }

const detectedFiles: { path: string; type: AppType }[] = [
  // Single files
  { path: 'calculator.html', type: 'single-file' },
  { path: 'memory-game.html', type: 'single-file' },
  { path: 'notes.html', type: 'single-file' },
  { path: 'promptLibrary.html', type: 'single-file' },
  { path: 'stopwatch.html', type: 'single-file' },
  { path: 'todo.html', type: 'single-file' },
  // Project folders
  { path: 'snake/index.html', type: 'project' },
  { path: 'tictactoe/index.html', type: 'project' },
];

// =============================================================
// HELPER: Convert filename/folder to readable name
// =============================================================

const toReadableName = (filename: string): string => {
  // Remove extension and path
  const name = filename
    .replace(/\.html$/, '')
    .replace(/\/index\.html$/, '')
    .split('/')
    .pop() || filename;
  
  // Convert camelCase, kebab-case, snake_case to Title Case
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase
    .replace(/[-_]/g, ' ') // kebab-case & snake_case
    .replace(/\b\w/g, c => c.toUpperCase()) // Title Case
    .trim();
};

const getIdFromPath = (path: string): string => {
  return path
    .replace(/\.html$/, '')
    .replace(/\/index\.html$/, '')
    .split('/')
    .pop() || path;
};

// =============================================================
// BUILD REGISTRY - Auto-generate dari detectedFiles
// =============================================================

const buildAppRegistry = (): AppMeta[] => {
  return detectedFiles.map(({ path, type }) => {
    const id = getIdFromPath(path);
    const custom = appCustomizations[id] || {};
    
    return {
      id,
      name: custom.name || toReadableName(path),
      description: custom.description || `Open ${toReadableName(path)}`,
      type,
      path,
      category: custom.category || 'Other',
      icon: custom.icon || '📦',
      featured: custom.featured || false,
    };
  });
};

const appRegistry: AppMeta[] = buildAppRegistry();

// =============================================================
// HELPER FUNCTIONS
// =============================================================

export const getAppRegistry = () => appRegistry;

export const getAppById = (id: string) => 
  appRegistry.find(app => app.id === id);

export const getAppsByCategory = (category: AppCategory) => 
  appRegistry.filter(app => app.category === category);

export const getFeaturedApps = () => 
  appRegistry.filter(app => app.featured);

export const searchApps = (query: string) => {
  const q = query.toLowerCase();
  return appRegistry.filter(app => 
    app.name.toLowerCase().includes(q) ||
    app.description.toLowerCase().includes(q) ||
    app.category.toLowerCase().includes(q)
  );
};

export const getAppCategories = (): AppCategory[] => [
  'Games',
  'Tools', 
  'Productivity',
  'Education',
  'Entertainment',
  'Other',
];

export const getAppUrl = (app: AppMeta) => `/justhtml/${app.path}`;

// =============================================================
// QUICK ADD FUNCTIONS - Untuk menambah file baru dengan cepat
// =============================================================

/**
 * Untuk menambah file baru, cukup tambahkan ke detectedFiles:
 * 
 * Single file: { path: 'namafile.html', type: 'single-file' }
 * Project:     { path: 'namafolder/index.html', type: 'project' }
 * 
 * Opsional: Tambah kustomisasi di appCustomizations
 */

export default appRegistry;
